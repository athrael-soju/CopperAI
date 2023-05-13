import { useState, useEffect, useRef } from "react";
import { useWhisper } from "@chengsokdara/use-whisper";
import env from "react-dotenv";

const useRecordAudio = (sendMessage, playResponse, stopOngoingAudio) => {
  const {
    transcribing,
    pauseRecording,
    startRecording,
    transcript,
    stopRecording,
  } = useWhisper({
    apiKey: env.OPENAI_API_KEY,
    nonStop: true, 
    stopTimeout: 3000,
  });

  const [response, setResponse] = useState(null);
  const [lastTranscript, setLastTranscript] = useState("");
  const sendingMessage = useRef(false);

  useEffect(() => {
    const handleSendMessage = async () => {
      if (transcript.text !== lastTranscript && !sendingMessage.current) {
        sendingMessage.current = true;
        const response = await sendMessage(transcript.text);
        setLastTranscript(transcript.text);
        transcript.text = "";
        setResponse(response);
        sendingMessage.current = false;
      }
    };
    if (!transcribing && transcript.text && transcript.text.trim() !== "") {
      handleSendMessage();
    }
  }, [
    transcript,
    sendMessage,
    playResponse,
    stopOngoingAudio,
    stopRecording,
    transcribing,
    lastTranscript,
  ]);

  useEffect(() => {
    if (response) {
      playResponse(response);
      setResponse(null);
    }
  }, [response, playResponse]);

  return {
    transcribing,
    pauseRecording,
    startRecording,
    stopRecording,
  };
};

export default useRecordAudio;
