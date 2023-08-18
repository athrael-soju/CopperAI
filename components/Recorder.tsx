import React from 'react';
import { createSpeechlySpeechRecognition } from '@speechly/speech-recognition-polyfill';
import { RecordButton, StopButton } from './Buttons';
import { useRecorder } from '../hooks/useRecorder'; // Make sure to correctly import the path
import SpeechRecognition from 'react-speech-recognition';
import { stat } from 'fs';
const appId: string = process.env.NEXT_PUBLIC_SPEECHLY_APP_ID ?? '';
const SpeechlySpeechRecognition = createSpeechlySpeechRecognition(appId);
SpeechRecognition.applyPolyfill(SpeechlySpeechRecognition);

type RecorderProps = {
  className?: string;
  setIsLoading: (loading: boolean) => void;
  namespace: string | null;
  handleAudioElement: (audio: HTMLAudioElement | null) => void;
};
let showStatus = '';
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
    status,
  } = useRecorder(appId, setIsLoading, namespace, handleAudioElement);

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn&apos;t support speech recognition.</span>;
  }
  if (buttonState === 'record') {
    if (status === 'idle') {
      showStatus = 'Listening...';
    } else if (status === 'playing') {
      showStatus = 'Speaking...';
    } else if (status === 'recording') {
      showStatus = 'Recording...';
    } else if (status === 'error') {
      showStatus = 'Something went wrong...';
    } else {
      showStatus = 'Thinking...';
    }
  } else {
    showStatus = 'Stopped';
  }
  return (
    <div className={className}>
      <div className="button-container">
        {buttonState === 'record' ? (
          <StopButton onClick={stopButtonEvent} />
        ) : (
          <RecordButton onClick={recordButtonEvent} />
        )}
        <div className="status-text">{showStatus}</div>
      </div>
    </div>
  );
};

export default Recorder;
