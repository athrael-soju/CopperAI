import { useState } from "react";

const useButtonStates = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [activeButton, setActiveButton] = useState("");

  return {
    isRecording,
    setIsRecording,
    isPaused,
    setIsPaused,
    activeButton,
    setActiveButton,
  };
};

export default useButtonStates;
