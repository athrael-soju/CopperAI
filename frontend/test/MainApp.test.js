import { render } from "@testing-library/react";
import React from "react";
import MainApp from "../src/MainApp.js";

jest.mock("../src/components/VoicePromptCard", () => () => (
  <div>VoicePromptCard</div>
)); // mock VoicePromptCard component
jest.mock("../src/components/LoadingSpinner", () => () => <div>LoadingSpinner</div>); // mock LoadingSpinner component

// Mock the custom hooks
jest.mock("../src/hooks/useMessageHandler", () => () => ({
  setMessage: jest.fn(),
  loading: false,
  sendMessage: jest.fn(),
}));
jest.mock("../src/hooks/useAudioHandler", () => () => ({
  playResponse: jest.fn(),
  stopOngoingAudio: jest.fn(),
}));
jest.mock("../src/hooks/useRecordAudio", () => () => ({
  transcribing: false,
  pauseRecording: jest.fn(),
  startRecording: jest.fn(),
  stopRecording: jest.fn(),
}));
jest.mock("../src/hooks/useButtonStates", () => () => ({
  isRecording: false,
  setIsRecording: jest.fn(),
  setIsPaused: jest.fn(),
  activeButton: "",
  setActiveButton: jest.fn(),
}));

describe("MainApp", () => {
  it("renders without crashing", () => {
    const { container } = render(<MainApp user={{ username: "test" }} />);
    expect(container).toMatchSnapshot();
  });

  it("renders VoicePromptCard", () => {
    const { getByText } = render(<MainApp user={{ username: "test" }} />);
    expect(getByText("VoicePromptCard")).toBeInTheDocument();
  });

  // and so on for other components and conditions...
});
