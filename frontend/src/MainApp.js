import React from "react";
import VoicePromptCard from "./components/VoicePromptCard";
import LoadingAlerts from "./components/LoadingAlerts";
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

  const getAlert = () => {
    if (transcribing) {
      return {
        message: "AI is thinking",
        type: "info",
      };
    }

    if (isPaused) {
      return {
        message: "Paused",
        type: "warning",
      };
    }

    if (isRecording) {
      return {
        message: "User is speaking",
        type: "info",
      };
    }

    return null;
  };

  return (
    <div className="container app-container">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          margin: "auto",
          width: "100%",
          height: "calc(100vh - 64px)", // minus navbar height which is 64px
          maxWidth: "400px",
        }}
      >
        <div
          style={{
            borderRadius: "1rem",
            padding: "1rem",
            width: "100%",
            marginBottom: "1rem",
          }}
        >
          <LoadingAlerts loading={loading} alert={getAlert()} />
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
      </div>
    </div>
  );
}

export default MainApp;
