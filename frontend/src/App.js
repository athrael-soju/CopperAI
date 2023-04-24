import React from "react";
import "./styles/bootstrap.vapor.min.css";
import "./styles/App.css";
import VoicePromptCard from "./components/VoicePromptCard";
import LoadingSpinner from "./components/LoadingSpinner";
import useMessageHandler from "./hooks/useMessageHandler";
import useAudioHandler from "./hooks/useAudioHandler";
import useRecordAudio from "./hooks/useRecordAudio";
import useButtonStates from "./hooks/useButtonStates";

function App() {
  const { setMessage, loading, sendMessage } = useMessageHandler();
  const { playResponse, stopOngoingAudio } = useAudioHandler();
  const {
    isRecording,
    setIsRecording,
    setIsPaused,
    activeButton,
    setActiveButton,
  } = useButtonStates();

  const { transcribing, pauseRecording, startRecording, stopRecording } =
    useRecordAudio(
      setMessage,
      sendMessage,
      playResponse,
      stopOngoingAudio,
      isRecording,
      setIsRecording,
      activeButton
    );
  return (
    <div className="App container-fluid">
      <video id="live-wallpaper" loop autoPlay muted>
        <source src="assets/video/synthwave.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
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
          isRecording={isRecording}
          setIsRecording={setIsRecording}
          setIsPaused={setIsPaused}
          activeButton={activeButton}
          setActiveButton={setActiveButton}
        />
      </div>
    </div>
  );
}

export default App;
