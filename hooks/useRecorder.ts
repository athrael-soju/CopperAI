import { useState, useEffect, useRef, useCallback } from 'react';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';
import useProcessRecording from '../hooks/useProcessRecording';
import useAudioSensitivity from '../hooks/useAudioSensitivity';
import { useSession } from 'next-auth/react';

export const useRecorder = (
  appId: string,
  setIsLoading: (loading: boolean) => void,
  namespace: string | null,
  handleAudioElement: (audio: HTMLAudioElement | null) => void
) => {
  const isMicActive = useAudioSensitivity();
  const { data: session } = useSession();
  const { transcript, browserSupportsSpeechRecognition, resetTranscript } =
    useSpeechRecognition();

  const [isListening, setIsListening] = useState(false);
  const [newTranscript, setNewTranscript] = useState<string | null>(null);
  const {
    status,
    setStatus,
    setRecordingProcessed,
    stopOngoingAudio,
    audioRef,
  } = useProcessRecording(newTranscript, session, setIsLoading, namespace);
  const timeoutRef = useRef<number | null>(null);
  const [buttonState, setButtonState] = useState<'record' | 'stop' | null>(
    null
  );

  const startRecording = useCallback(() => {
    if (!isListening) {
      SpeechRecognition.startListening();
      setIsListening(true);
    }
    setStatus('recording');
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, [isListening, setStatus]);

  const processRecordingAfterDelay = useCallback(() => {
    timeoutRef.current = window.setTimeout(() => {
      if (transcript) {
        setNewTranscript(transcript);
        setRecordingProcessed(false);
        resetTranscript();
      }
      SpeechRecognition.stopListening();
      setIsListening(false);
      setStatus('idle');
    }, 2000);
  }, [transcript, setStatus, setRecordingProcessed, resetTranscript]);

  useEffect(() => {
    console.log('status: ', status);
    if (isMicActive) {
      stopOngoingAudio();
    }
  }, [isMicActive, status, stopOngoingAudio]);

  useEffect(() => {
    if (buttonState !== 'record') return;

    if (isMicActive) {
      startRecording();
    } else {
      processRecordingAfterDelay();
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [buttonState, isMicActive, processRecordingAfterDelay, startRecording]);

  const handleGeneratedAudio = useCallback(() => {
    handleAudioElement(audioRef.current);
    setStatus('idle');
  }, [handleAudioElement, audioRef, setStatus]);

  useEffect(() => {
    if (status === 'generated') {
      handleGeneratedAudio();
    }
  }, [handleGeneratedAudio, status]);

  const stopListening = () => {
    SpeechRecognition.stopListening();
    setIsListening(false);
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      SpeechRecognition.startListening();
      setIsListening(true);
    }
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
    setStatus('idle');
    setButtonState('record');
  };

  return {
    isListening,
    status,
    buttonState,
    stopButtonEvent,
    recordButtonEvent,
    browserSupportsSpeechRecognition,
  };
};
