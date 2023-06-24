import React from "react";
import { Button, Card } from "react-bootstrap";

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

  const renderButtons = () => {
    if (isPaused) {
      return (
        <>
          <Button
            onClick={handleResumeRecording}
            variant={activeButton === "resume" ? "warning" : "outline-warning"}
            className="mx-2 voice-prompt-buttons"
          >
            <FontAwesomeIcon icon={faPlay} />
          </Button>
          <Button
            onClick={handleStopRecording}
            variant={activeButton === "stop" ? "danger" : "outline-danger"}
            className="mx-2 voice-prompt-buttons"
          >
            <FontAwesomeIcon icon={faStop} />
          </Button>
        </>
      );
    }

    if (!isRecording) {
      return (
        <div className="justify-content-center" style={{ width: "200px" }}>
          <Button
            onClick={handleStartRecording}
            variant={activeButton === "start" ? "primary" : "outline-primary"}
            className="mx-2 voice-prompt-buttons"
          >
            <FontAwesomeIcon icon={faMicrophone} />
          </Button>
        </div>
      );
    }

    return (
      <>
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
      </>
    );
  };

  return (
    <Card>
      <Card.Body className="d-flex justify-content-center">
        {renderButtons()}
      </Card.Body>
    </Card>
  );
};

export default React.memo(VoicePromptCard);
