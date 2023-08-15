import React from 'react';
import { createSpeechlySpeechRecognition } from '@speechly/speech-recognition-polyfill';
import { RecordButton, StopButton } from './Buttons';
import { useRecorder } from '../hooks/useRecorder'; // Make sure to correctly import the path
import SpeechRecognition from 'react-speech-recognition';
const appId: string = process.env.NEXT_PUBLIC_SPEECHLY_APP_ID ?? '';
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
  const {
    stopButtonEvent,
    buttonState,
    recordButtonEvent,
    browserSupportsSpeechRecognition,
  } = useRecorder(appId, setIsLoading, namespace, handleAudioElement);

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn&apos;t support speech recognition.</span>;
  }

  return (
    <div className={className}>
      {buttonState === 'record' ? (
        <StopButton onClick={stopButtonEvent} />
      ) : (
        <RecordButton onClick={recordButtonEvent} />
      )}
    </div>
  );
};

export default Recorder;
