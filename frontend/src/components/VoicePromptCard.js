import React from "react";
import { Button } from "antd";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicrophone,
  faPause,
  faStop,
  faPlay,
} from "@fortawesome/fontawesome-free-solid";

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
}) => {
  const handleStartRecording = () => {
    setActiveButton("start");
    stopOngoingAudio();
    setIsRecording(true);
    startRecording();
  };

  const handleResumeRecording = () => {
    setActiveButton("start");
    setIsPaused(false);
    setIsRecording(true);
    startRecording();
  };

  const handlePauseRecording = () => {
    if (isRecording) {
      setActiveButton("pause");
      setIsPaused(true);
      pauseRecording();
    }
  };

  const handleStopRecording = () => {
    setActiveButton("stop");
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
        fontSize: "2rem",
        width: "100px",
        height: "100px",
        margin: "20px",
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
            style={{ fontSize: "2rem", width: "100px", height: "100px" }}
            variant={activeButton === "resume" ? "warning" : "outline-warning"}
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
            fontSize: "2rem",
            width: "100px",
            height: "100px",
            margin: "20px",
          }}
          onClick={handleStartRecording}
          variant={activeButton === "start" ? "primary" : "outline-primary"}
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
          style={{ fontSize: "2rem", width: "100px", height: "100px" }}
          onClick={handlePauseRecording}
          icon={<FontAwesomeIcon icon={faPause} />}
          variant={activeButton === "pause" ? "secondary" : "outline-secondary"}
        ></Button>
        {stopBtn}
      </div>
    );
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        width: "100%",
      }}
    >
      {renderButtons()}
    </div>
  );
};

export default VoicePromptCard;
