import React from "react";
import { Button, Card } from "react-bootstrap";

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
    <Card>
      <Card.Body className="d-flex justify-content-center">
        <Button
          onClick={handleStartRecording}
          variant={activeButton === "start" ? "primary" : "outline-primary"}
          className="mx-2 voice-prompt-buttons"
        >
          <FontAwesomeIcon icon={faMicrophone} />
        </Button>
        <Button
          onClick={handlePauseRecording}
          variant={activeButton === "pause" ? "secondary" : "outline-secondary"}
          className="mx-2 voice-prompt-buttons"
        >
          <FontAwesomeIcon icon={faPause} />
        </Button>
        <Button
          onClick={handleStopRecording}
          variant={activeButton === "stop" ? "danger" : "outline-danger"}
          className="mx-2 voice-prompt-buttons"
        >
          <FontAwesomeIcon icon={faStop} />
        </Button>
      </Card.Body>
    </Card>
  );
};

export default React.memo(VoicePromptCard);
