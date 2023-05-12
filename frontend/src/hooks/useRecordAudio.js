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
    timeSlice: 2_000
  });

  //const [wasTranscribing, setWasTranscribing] = useState(false);
  const [currMsg, setCurrMsg] = useState("");
  const [prevMsg, setPrevMsg] = useState("");
  const [timeoutToSendMsg, setTimeoutToSendMsg] = useState(2);

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
    const timer = setTimeout(() => {
      setPrevMsg(currMsg);
      if (Math.random() > 0.5) {
        setCurrMsg(currMsg + "hello world, ");
      }
      console.log("Test: currMsg: ", currMsg, "prevMsg: ", prevMsg);
      if (currMsg !== null && currMsg === prevMsg) {
        console.log("Test: timeoutToSendMsg", timeoutToSendMsg);
        setTimeoutToSendMsg(timeoutToSendMsg - 1);
        if (timeoutToSendMsg === 0) {
          setMessage(currMsg);
          setCurrMsg("");
          setPrevMsg("");
          console.log("Test: handleSendMessage");
          handleSendMessage();
          setTimeoutToSendMsg(2);
        }
      } else {
        setTimeoutToSendMsg(2);
        setMessage(transcript.text);
      }
      if (transcript.text) {
        setMessage(transcript.text);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [
    transcript,
    transcript.text,
    setMessage,
    currMsg,
    prevMsg,
    timeoutToSendMsg,
    handleSendMessage,
  ]);

  // useEffect(() => {
  //   let readyToSend =
  //     !transcribing &&
  //     wasTranscribing &&
  //     transcript.text &&
  //     transcript.text.trim() !== "";

  //   if (readyToSend) {
  //     console.log("Test: transcript.text", transcript.text);
  //     handleSendMessage();
  //   } else {
  //     transcript.text = "";
  //   }
  //   setWasTranscribing(transcribing);
  // }, [transcribing, wasTranscribing, handleSendMessage, transcript]);

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
