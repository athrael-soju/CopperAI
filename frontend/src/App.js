import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";

import "./styles/bootstrap.vapor.min.css";
import "./styles/App.css";
import VoicePromptCard from "./components/VoicePromptCard";
import LoadingSpinner from "./components/LoadingSpinner";
import useMessageHandler from "./hooks/useMessageHandler";
import useAudioHandler from "./hooks/useAudioHandler";
import useRecordAudio from "./hooks/useRecordAudio";
import useButtonStates from "./hooks/useButtonStates";
import Login from "./components/Login";
import AccountModal from "./components/AccountModal";

function App() {
  const [user, setUser] = useState(null);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const handleAccountModalClose = () => setShowAccountModal(false);
  const handleAccountModalShow = () => setShowAccountModal(true);

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

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
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid">
          <a
            className="navbar-brand"
            href="https://github.com/athrael-soju/whisperChat"
          >
            whisperChat
          </a>
          <div className="collapse navbar-collapse" id="navbarColor01">
            <ul className="navbar-nav me-auto"></ul>
            <form className="d-flex">
              {user ? (
                <Button
                  onClick={handleLogout}
                  className="btn btn-danger my-2 my-sm-0"
                >
                  Logout
                </Button>
              ) : (
                <button
                  className="btn btn-secondary my-2 my-sm-0"
                  type="button"
                  onClick={handleAccountModalShow}
                >
                  Account
                </button>
              )}
            </form>
          </div>
        </div>
      </nav>
      {!user && (
        <AccountModal
          show={showAccountModal}
          handleClose={handleAccountModalClose}
        >
          <Login setUser={setUser} />
        </AccountModal>
      )}
      {user ? (
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
      ) : (
        <div className="d-flex justify-content-center align-items-center min-vh-100">
          <div className="text-center">
            <h1 className="text-primary">Welcome to whisperChat</h1>
            <p>
              This is a voice-enabled chat application. Please log in or
              register to start using it.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
