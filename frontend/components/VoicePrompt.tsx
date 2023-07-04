import { useState } from 'react';
import { Button } from 'antd';
// import { VoiceRecorder } from 'react-voice-recorder-player';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMicrophone,
  faPause,
  faStop,
  faPlay,
} from '@fortawesome/fontawesome-free-solid';

const styles = {
  mainContainerStyle: {
    backgroundColor: 'gray',
    border: '1px solid black',
    borderRadius: '5px',
    padding: '10px',
  },
  controllerContainerStyle: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '10px',
  },
  controllerStyle: {
    backgroundColor: 'white',
    border: '1px solid black',
    borderRadius: '5px',
    cursor: 'pointer',
    padding: '5px',
  },
  waveContainerStyle: {
    height: '100px',
    marginTop: '10px',
    width: '100%',
  },
};

const VoicePromptCard = ({
  startRecording,
  pauseRecording,
  stopRecording,
  stopOngoingAudio,
  isPaused,
  isRecording,
  setIsRecording,
  setIsPaused,
  activeButton,
  setActiveButton,
}: any) => {
  const handleStartRecording = () => {
    setActiveButton('start');
    stopOngoingAudio();
    setIsRecording(true);
    startRecording();
  };

  const handleResumeRecording = () => {
    setActiveButton('start');
    setIsPaused(false);
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

  const stopBtn = (
    <Button
      danger
      type="primary"
      shape="circle"
      size="large"
      style={{
        fontSize: '2rem',
        width: '100px',
        height: '100px',
        margin: '20px',
      }}
      onClick={handleStopRecording}
      icon={<FontAwesomeIcon icon={faStop} />}
    ></Button>
  );

  const renderButtons = () => {
    if (isPaused) {
      return (
        <div>
          <Button
            onClick={handleResumeRecording}
            type="primary"
            shape="circle"
            size="large"
            style={{ fontSize: '2rem', width: '100px', height: '100px' }}
          >
            <FontAwesomeIcon icon={faPlay} />
          </Button>
          {stopBtn}
        </div>
      );
    }

    if (!isRecording) {
      return (
        <Button
          type="primary"
          shape="circle"
          size="large"
          style={{
            fontSize: '2rem',
            width: '100px',
            height: '100px',
            margin: '20px',
          }}
          onClick={handleStartRecording}
          icon={<FontAwesomeIcon icon={faMicrophone} />}
        ></Button>
      );
    }

    return (
      <div>
        <Button
          type="primary"
          shape="circle"
          size="large"
          style={{ fontSize: '2rem', width: '100px', height: '100px' }}
          onClick={handlePauseRecording}
          icon={<FontAwesomeIcon icon={faPause} />}
        ></Button>
        {stopBtn}
      </div>
    );
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        width: '100%',
      }}
    >
      {/* <VoiceRecorder
        mainContainerStyle={styles.mainContainerStyle}
        controllerContainerStyle={styles.controllerContainerStyle}
        controllerStyle={styles.controllerStyle}
        waveContainerStyle={styles.waveContainerStyle}
      /> */}
      {renderButtons()}
    </div>
  );
};

export default VoicePromptCard;
