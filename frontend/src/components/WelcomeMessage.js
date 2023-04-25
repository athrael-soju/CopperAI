import React from "react";

function WelcomeMessage() {
  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="text-center">
        <h1 className="text-primary">Welcome to whisperChat</h1>
        <p>
          This is a voice-enabled chat application. Please log in or register to
          start using it.
        </p>
      </div>
    </div>
  );
}

export default WelcomeMessage;
