import { useState, useEffect, useCallback, useRef } from "react";
import { useWhisper } from "@chengsokdara/use-whisper";
import env from "react-dotenv";
import useAudioSensitivity from "./useAudioSensitivity";

const useRecordAudio = (
  setMessage,
  sendMessage,
  message,
  playResponse,
  stopOngoingAudio,
  isRecording,
  setIsRecording,
  activeButton
) => {
  const {
    transcribing,
    transcript,
    speaking,
    pauseRecording,
    startRecording,
    stopRecording,
  } = useWhisper({
    apiKey: env.OPENAI_API_KEY,
    streaming: true,
    nonStop: true,
    stopTimeout: 10000,
  });

  const [wasTranscribing, setWasTranscribing] = useState(false);
  const isMicActive = useAudioSensitivity();
  const stopRecordingTimeoutRef = useRef();

  useEffect(() => {
    console.log(
      "isMicActive: ",
      isMicActive,
      "transcribing: ",
      transcribing,
      "speaking: ",
      speaking,
      "message: ",
      message
    );
    if (!isMicActive && !transcribing && !speaking && message) {
      console.log("User stopped speaking, scheduling stopRecording");
      stopRecordingTimeoutRef.current = setTimeout(() => {
        console.log("Executing scheduled stopRecording");
        stopRecording().then(() => {
          setIsRecording(false);
        });
      }, 2000);
    } else if (isMicActive && stopRecordingTimeoutRef.current) {
      console.log("User started speaking, cancelling scheduled stopRecording");
      clearTimeout(stopRecordingTimeoutRef.current);
      stopRecordingTimeoutRef.current = null;
    }
  }, [
    isMicActive,
    stopRecording,
    transcript,
    transcribing,
    wasTranscribing,
    speaking,
    message,
    setMessage,
    setIsRecording,
  ]);

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
      //transcript.text = "";
    }
    setWasTranscribing(transcribing);
  }, [
    transcribing,
    wasTranscribing,
    handleSendMessage,
    transcript,
    stopRecording,
  ]);

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
