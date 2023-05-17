import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import MainApp from "../MainApp";

// Mock the custom hooks
jest.mock("../hooks/useMessageHandler");
jest.mock("../hooks/useAudioHandler");
jest.mock("../hooks/useRecordAudio");
jest.mock("../hooks/useButtonStates");
jest.mock("react-dotenv", () => ({
  // Mock values
  VAR_NAME: "mock value",
}));

describe("MainApp", () => {
  beforeEach(() => {
    // Set up default return values for the hooks
    require("../hooks/useMessageHandler").mockReturnValue({
      setMessage: jest.fn(),
      loading: false,
      sendMessage: jest.fn(),
    });
    require("../hooks/useAudioHandler").mockReturnValue({
      playResponse: jest.fn(),
      stopOngoingAudio: jest.fn(),
    });
    require("../hooks/useRecordAudio").mockReturnValue({
      isRecording: false,
      setIsRecording: jest.fn(),
      setIsPaused: jest.fn(),
      activeButton: "start",
      setActiveButton: jest.fn(),
      transcribing: false,
      pauseRecording: jest.fn(),
      startRecording: jest.fn(),
      stopRecording: jest.fn(),
    });
    require("../hooks/useButtonStates").mockReturnValue({
      isRecording: false,
      setIsRecording: jest.fn(),
      setIsPaused: jest.fn(),
      activeButton: "start",
      setActiveButton: jest.fn(),
    });
  });

  it("renders without crashing", () => {
    render(<MainApp user={{ username: "Test User" }} />);
    expect(screen.getByTestId("main-app")).toBeInTheDocument();
  });

  it("renders LoadingSpinner when transcribing or loading", () => {
    require("../hooks/useRecordAudio").mockReturnValueOnce({
      ...require("../hooks/useRecordAudio")(),
      transcribing: true,
    });
    render(<MainApp user={{ username: "Test User" }} />);
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("renders VoicePromptCard", () => {
    render(<MainApp user={{ username: "Test User" }} />);
    expect(screen.getByTestId("voice-prompt-card")).toBeInTheDocument();
  });
});
