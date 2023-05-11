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
  const [currMsg, setCurrMsg] = useState("");
  const [prevMsg, setPrevMsg] = useState("");
  const [timeoutToSendMsg, setTimeoutToSendMsg] = useState(5);

  let isMicActive = useAudioSensitivity(activeButton);
  if (activeButton !== "start") {
    isMicActive = false;
  }

  const handleSendMessage = useCallback(async () => {
    stopOngoingAudio();
    const newResponse = await sendMessage();
    await playResponse(newResponse);
  }, [sendMessage, playResponse, stopOngoingAudio]);

  useEffect(() => {
    if (transcript.text) {
      setPrevMsg(currMsg);
      setCurrMsg(transcript.text);
      console.log("Test: currMsg: ", currMsg, "prevMsg: ", prevMsg);
      if (currMsg === prevMsg) {
        console.log("Test: timeoutToSendMsg", timeoutToSendMsg);
        setTimeoutToSendMsg(timeoutToSendMsg - 1);
        if (timeoutToSendMsg === 0) {
          console.log("Test: handleSendMessage");
          handleSendMessage();
          setTimeoutToSendMsg(5);
        }
      } else {
        setTimeoutToSendMsg(5);
        setMessage(transcript.text);
      }
    }
  }, [
    transcript,
    transcript.text,
    setMessage,
    currMsg,
    prevMsg,
    timeoutToSendMsg,
    handleSendMessage,
  ]);

  useEffect(() => {
    let readyToSend =
      !transcribing &&
      wasTranscribing &&
      transcript.text &&
      transcript.text.trim() !== "";

    if (readyToSend) {
      console.log("Test: transcript.text", transcript.text);
      handleSendMessage();
    } else {
      transcript.text = "";
    }
    setWasTranscribing(transcribing);
  }, [transcribing, wasTranscribing, handleSendMessage, transcript]);

  useEffect(() => {
    if (isMicActive && !transcribing && isRecording) {
      console.log("Test: startRecording");
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
