import React, { useState, useEffect, useRef } from 'react';
import { createSpeechlySpeechRecognition } from '@speechly/speech-recognition-polyfill';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';
import { RecordButton, StopButton } from './Buttons';
import useProcessRecording from '../hooks/useProcessRecording';
import { useSession } from 'next-auth/react';
import useAudioSensitivity from '../hooks/useAudioSensitivity';

const appId: string = process.env.NEXT_PUBLIC_SPEECHLY_APP_ID || '';
const SpeechlySpeechRecognition = createSpeechlySpeechRecognition(appId);
SpeechRecognition.applyPolyfill(SpeechlySpeechRecognition);

type RecorderProps = {
  className?: string;
  setIsLoading: (loading: boolean) => void;
  namespace: string | null;
  handleAudioElement: (audio: HTMLAudioElement | null) => void;
};

const Recorder: React.FC<RecorderProps> = ({
  className,
  setIsLoading,
  namespace,
  handleAudioElement,
}) => {
  const isMicActive = useAudioSensitivity();
  const { data: session } = useSession();
  const {
    transcript,
    interimTranscript,
    finalTranscript,
    browserSupportsSpeechRecognition,
    resetTranscript,
  } = useSpeechRecognition();

  const [isListening, setIsListening] = useState(false);
  const [newTranscript, setNewTranscript] = useState<string | null>(null);
  const {
    status,
    setStatus,
    setRecordingProcessed,
    startOngoingAudio,
    stopOngoingAudio,
    audioRef,
  } = useProcessRecording(newTranscript, session, setIsLoading, namespace);
  const timeoutRef = useRef<number | null>(null);
  const [buttonState, setButtonState] = useState<'record' | 'stop' | null>(
    null
  );

  useEffect(() => {
    console.log('status', status);
  }, [isMicActive, status]);

  useEffect(() => {
    if (buttonState === 'record') {
      // If the mic is active (user is speaking)
      if (isMicActive) {
        SpeechRecognition.startListening({ continuous: true });
        // Clear any existing timeout (if present)
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      } else if (transcript?.length > 0) {
        // If mic is not active, start a timeout of 2 seconds
        timeoutRef.current = window.setTimeout(() => {
          SpeechRecognition.stopListening();
          console.log('transcript', transcript);
          setNewTranscript(transcript);
          setRecordingProcessed(false);
          resetTranscript();
          setStatus('idle');
        }, 3000); // 3 second grace period
      }
      // Clear the timeout when the component is unmounted
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }
  }, [
    buttonState,
    isMicActive,
    resetTranscript,
    setRecordingProcessed,
    setStatus,
    transcript,
  ]);

  useEffect(() => {
    if (status === 'generated') {
      handleAudioElement(audioRef.current);
      setStatus('idle');
    }
  }, [status, setStatus, handleAudioElement, audioRef]);

  const toggleListening = () => {
    if (isListening) {
      SpeechRecognition.stopListening();
    } else {
      SpeechRecognition.startListening({ continuous: true });
    }
    setIsListening(!isListening);
  };

  const stopButtonEvent = () => {
    stopOngoingAudio();
    toggleListening();
    setStatus('idle');
    setButtonState('stop');
  };

  const recordButtonEvent = () => {
    toggleListening();
    stopOngoingAudio();
    setStatus('recording');
    setButtonState('record');
  };

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn&apos;t support speech recognition.</span>;
  }

  return (
    <div className={className}>
      {isListening ? (
        <StopButton onClick={stopButtonEvent} />
      ) : (
        <RecordButton onClick={recordButtonEvent} />
      )}
    </div>
  );
};

export default Recorder;
