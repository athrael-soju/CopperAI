import React from "react";
import { Button } from "antd";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicrophone,
  faPause,
  faStop,
} from "@fortawesome/fontawesome-free-solid";

const VoicePromptCard = ({
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
    setActiveButton("start");
    stopOngoingAudio();
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

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        margin: "auto",
        width: "100%",
        height: "80vh",
      }}
    >
      <Button
        onClick={handleStartRecording}
        type="primary"
        shape="circle"
        size="large"
        icon={<FontAwesomeIcon icon={faMicrophone} />}
        style={{ fontSize: "2rem", width: "100px", height: "100px" }}
      ></Button>
      <Button
        onClick={handlePauseRecording}
        type="primary"
        shape="circle"
        size="large"
        icon={<FontAwesomeIcon icon={faPause} />}
        style={{ fontSize: "2rem", width: "100px", height: "100px" }}
      ></Button>
      <Button
        onClick={handleStopRecording}
        type="primary"
        shape="circle"
        size="large"
        icon={<FontAwesomeIcon icon={faStop} />}
        style={{ fontSize: "2rem", width: "100px", height: "100px" }}
        {...(activeButton === "stop" ? { danger: true } : {})}
      ></Button>
    </div>
  );
};

export default VoicePromptCard;
