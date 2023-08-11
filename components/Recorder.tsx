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

  useEffect(() => {
    console.log('status', status);
    if (isMicActive) {
      // Stop any ongoing audio playback when user starts speaking
      stopOngoingAudio();
    } else if (finalTranscript) {
      console.log('finalTranscript', finalTranscript);
      if (finalTranscript !== newTranscript) {
        setNewTranscript(finalTranscript);
        setRecordingProcessed(false);
        resetTranscript();
        setStatus('idle');
      }
    }
  }, [
    audioRef,
    finalTranscript,
    interimTranscript,
    isMicActive,
    newTranscript,
    resetTranscript,
    setRecordingProcessed,
    setStatus,
    status,
    stopOngoingAudio,
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
  };

  const recordButtonEvent = () => {
    toggleListening();
    stopOngoingAudio();
    setStatus('recording');
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
