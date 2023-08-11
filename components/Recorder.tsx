import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createSpeechlySpeechRecognition } from '@speechly/speech-recognition-polyfill';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';
import { RecordButton, StopButton } from './Buttons';
import useProcessRecording from '../hooks/useProcessRecording';
import { useSession } from 'next-auth/react';
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
  const { data: session } = useSession();
  const [newTranscript, setNewTranscript] = useState<string | null>(null);
  const { transcript, browserSupportsSpeechRecognition, resetTranscript } =
    useSpeechRecognition();
  const {
    status,
    setStatus,
    setRecordingProcessed,
    startOngoingAudio,
    stopOngoingAudio,
    audioRef,
  } = useProcessRecording(newTranscript, session, setIsLoading, namespace);
  const [isListening, setIsListening] = useState(false);
  const timeoutId = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isListening) {
      if (transcript) {
        setRecordingProcessed(false);
        if (timeoutId.current) {
          clearTimeout(timeoutId.current);
        }
        timeoutId.current = setTimeout(() => {
          resetTranscript();
          setNewTranscript(transcript);
          setStatus('idle'); // Set status to 'idle' when recording stops
        }, 3000);
      }

      return () => {
        if (timeoutId.current) {
          clearTimeout(timeoutId.current);
        }
      };
    }
  }, [
    isListening,
    resetTranscript,
    setRecordingProcessed,
    setStatus,
    stopOngoingAudio,
    transcript,
  ]);

  useEffect(() => {
    if (status === 'generated') {
      handleAudioElement(audioRef.current);
      setStatus('idle');
    }
  }, [status, startOngoingAudio, setStatus, handleAudioElement, audioRef]);

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
    setStatus('idle'); // Set status to 'idle' when recording stops
  };

  const recordButtonEvent = () => {
    toggleListening();
    stopOngoingAudio();
    setStatus('recording');
    setRecordingProcessed(false);
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
