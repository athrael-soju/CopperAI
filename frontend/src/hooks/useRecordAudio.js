import { useState, useEffect, useCallback } from "react";
import { useWhisper } from "@chengsokdara/use-whisper";
import env from "react-dotenv";
import useAudioSensitivity from "./useAudioSensitivity";

const useRecordAudio = (
  setMessage,
  sendMessage,
  playResponse,
  stopOngoingAudio,
  isRecording,
  setIsRecording,
  activeButton
) => {
  const {
    transcribing,
    transcript,
    pauseRecording,
    startRecording,
    stopRecording,
  } = useWhisper({
    apiKey: env.OPENAI_API_KEY,
    streaming: true,
    nonStop: true,
  });

  const [wasTranscribing, setWasTranscribing] = useState(false);
  let isMicActive = useAudioSensitivity(activeButton);
  if (activeButton !== "start") {
    isMicActive = false;
  }
  useEffect(() => {
    if (transcript.text) {
      setMessage(transcript.text);
    }
  }, [transcript.text, setMessage]);

  const handleSendMessage = useCallback(async () => {
    stopOngoingAudio();
    const newResponse = await sendMessage();
    await playResponse(newResponse);
  }, [sendMessage, playResponse, stopOngoingAudio]);

  useEffect(() => {
    if (
      !transcribing &&
      wasTranscribing &&
      transcript.text &&
      transcript.text.trim() !== ""
    ) {
      handleSendMessage();
    } else {
      transcript.text = "";
    }
    setWasTranscribing(transcribing);
  }, [transcribing, wasTranscribing, handleSendMessage, transcript]);

  useEffect(() => {
    if (isMicActive && !transcribing && isRecording) {
      setIsRecording(true);
      stopOngoingAudio();
      startRecording();
    }
  }, [
    isMicActive,
    transcribing,
    startRecording,
    stopOngoingAudio,
    isRecording,
    setIsRecording,
    activeButton,
  ]);

  return {
    transcribing,
    pauseRecording,
    startRecording,
    stopRecording,
  };
};

export default useRecordAudio;
