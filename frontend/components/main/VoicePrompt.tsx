import React from 'react';
import { Button } from 'antd';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMicrophone,
  faPause,
  faStop,
} from '@fortawesome/fontawesome-free-solid';

const VoicePrompt = ({
  startRecording,
  pauseRecording,
  stopRecording,
  stopOngoingAudio,
  isRecording,
  setIsRecording,
  setIsPaused,
  activeButton,
  setActiveButton,
}) => {
  const handleStartRecording = () => {
    setActiveButton('start');
    stopOngoingAudio();
    setIsRecording(true);
    startRecording();
  };

  const handlePauseRecording = () => {
    if (isRecording) {
      setActiveButton('pause');
      setIsPaused(true);
      pauseRecording();
    }
  };

  const handleStopRecording = () => {
    setActiveButton('stop');
    setIsRecording(false);
    setIsPaused(false);
    stopRecording();
    stopOngoingAudio();
  };

  return (
    <Card>
      <Button onClick={handleStartRecording}>
        <FontAwesomeIcon icon={faMicrophone} />
      </Button>
      <Button onClick={handlePauseRecording}>
        <FontAwesomeIcon icon={faPause} />
      </Button>
      <Button onClick={handleStopRecording}>
        <FontAwesomeIcon icon={faStop} />
      </Button>
    </Card>
  );
};

export default VoicePrompt;
