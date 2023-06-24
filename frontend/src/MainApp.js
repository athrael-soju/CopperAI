import React from "react";
import VoicePromptCard from "./components/VoicePromptCard";
import LoadingSpinner from "./components/LoadingSpinner";
import useMessageHandler from "./hooks/useMessageHandler";
import useAudioHandler from "./hooks/useAudioHandler";
import useRecordAudio from "./hooks/useRecordAudio";
import useButtonStates from "./hooks/useButtonStates";

function MainApp({ user }) {
  const { sendMessage, loading } = useMessageHandler(
    user.username,
    user.usertype
  );
  const { playResponse, stopOngoingAudio } = useAudioHandler();
  const {
    isPaused,
    isRecording,
    setIsRecording,
    setIsPaused,
    activeButton,
    setActiveButton,
  } = useButtonStates();

  const { transcribing, pauseRecording, startRecording, stopRecording } =
    useRecordAudio(sendMessage, playResponse, stopOngoingAudio, activeButton);

  return (
    <div className="container app-container">
      <h1 className="text-center text-secondary">{/* X */}</h1>
      {(transcribing || loading) && activeButton === "start" && (
        <LoadingSpinner />
      )}
      <VoicePromptCard
        startRecording={startRecording}
        pauseRecording={pauseRecording}
        stopRecording={stopRecording}
        stopOngoingAudio={stopOngoingAudio}
        isPaused={isPaused}
        isRecording={isRecording}
        setIsRecording={setIsRecording}
        setIsPaused={setIsPaused}
        activeButton={activeButton}
        setActiveButton={setActiveButton}
      />
    </div>
  );
}

export default MainApp;
