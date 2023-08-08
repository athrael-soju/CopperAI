import React, { useEffect, useRef } from 'react';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';
import { useMachine } from '@xstate/react';
import { createMachine, assign } from 'xstate';
import { RecordButton, StopButton } from './Buttons';
import { createSpeechlySpeechRecognition } from '@speechly/speech-recognition-polyfill';
import useAudioSensitivity from '../hooks/useAudioSensitivity';
const appId: string = process.env.NEXT_PUBLIC_SPEECHLY_APP_ID || '';
const SpeechlySpeechRecognition = createSpeechlySpeechRecognition(appId);
SpeechRecognition.applyPolyfill(SpeechlySpeechRecognition);

const listenContinuously = () =>
  SpeechRecognition.startListening({
    continuous: true,
    language: 'en-GB',
  });

type RecorderContext = {
  transcript: string;
};

type RecorderEvent =
  | { type: 'START' }
  | { type: 'STOP' }
  | { type: 'TRANSCRIBE'; data: string };

const recorderMachine = createMachine<RecorderContext, RecorderEvent>(
  {
    id: 'recorder',
    initial: 'stopped',
    context: {
      transcript: '',
    },
    states: {
      stopped: {
        on: {
          START: 'recording',
        },
      },
      recording: {
        entry: 'startListening',
        exit: 'stopListening',
        on: {
          STOP: 'stopped',
          TRANSCRIBE: {
            target: 'transcribing',
            actions: ['updateTranscript'],
          },
        },
      },
      transcribing: {
        after: {
          0: 'recording',
        },
      },
    },
    predictableActionArguments: true,
  },
  {
    actions: {
      startListening: listenContinuously,
      stopListening: () => {
        SpeechRecognition.stopListening();
      },
      updateTranscript: assign({
        transcript: (context, event) => {
          if (event.type === 'TRANSCRIBE') {
            return event.data;
          }
          return context.transcript; // or some default value if needed
        },
      }),
    },
  }
);

type RecorderXProps = {
  className?: string;
  setIsLoading: (loading: boolean) => void;
  namespace: string | null;
  handleAudioElement: (audio: HTMLAudioElement | null) => void;
};

const RecorderX: React.FC<RecorderXProps> = ({
  className,
  setIsLoading,
  namespace,
  handleAudioElement,
}) => {
  const [current, send] = useMachine(recorderMachine);
  const lastUpdateRef = useRef<Date>(new Date());
  const isMicActive = useAudioSensitivity();
  const inactivityTimeoutRef = useRef<null | NodeJS.Timeout>(null);

  const commands = [
    {
      command: 'stop',
      callback: () => {
        send('STOP');
      },
      matchInterim: false,
    },
  ];

  const {
    transcript,
    resetTranscript,
    listening,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
    interimTranscript,
  } = useSpeechRecognition({
    transcribing: true,
    clearTranscriptOnListen: true,
    commands,
  });

  useEffect(() => {
    if (transcript !== '') {
      lastUpdateRef.current = new Date();
    }
  }, [transcript]);

  useEffect(() => {
    console.log('transcript', transcript);
    if (isMicActive) {
      if (inactivityTimeoutRef.current) {
        console.log('User is speaking...');
        clearTimeout(inactivityTimeoutRef.current);
      }
    } else {
      inactivityTimeoutRef.current = setTimeout(() => {
        console.log('User has finished speaking.', transcript); // create a new state for transcript and show that one instead.
        send({ type: 'TRANSCRIBE', data: transcript });
        resetTranscript();
      }, 2000);
    }

    return () => {
      if (inactivityTimeoutRef.current) {
        clearTimeout(inactivityTimeoutRef.current);
      }
    };
  }, [isMicActive, resetTranscript, send, transcript]);

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser does not support speech recognition.</span>;
  }
  if (!isMicrophoneAvailable) {
    return <span>Please allow access to the microphone</span>;
  }

  return (
    <div className={className}>
      {current.matches('stopped') && (
        <RecordButton onClick={() => send('START')} />
      )}
      {(current.matches('recording') || current.matches('transcribing')) && (
        <StopButton onClick={() => send('STOP')} />
      )}
    </div>
  );
};

export default RecorderX;
