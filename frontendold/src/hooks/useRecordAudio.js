import { useState, useEffect, useRef } from "react";
import { useWhisper } from "@chengsokdara/use-whisper";
import env from "react-dotenv";

import useAudioSensitivity from "./useAudioSensitivity";

const GRACE_PERIOD_DURATION = 3000;

const useRecordAudio = (
  sendMessage,
  playResponse,
  stopOngoingAudio,
  activeButton
) => {
  const [recording, setRecording] = useState(false);
  const isMicActive = useAudioSensitivity();
  const gracePeriodTimeout = useRef(null);

  const {
    transcribing,
    pauseRecording,
    startRecording,
    transcript,
    stopRecording,
  } = useWhisper({
    apiKey: env.OPENAI_API_KEY,
  });

  useEffect(() => {
    if (activeButton === "start") {
      if (isMicActive && !recording) {
        stopOngoingAudio();
        startRecording();
        setRecording(true);
      } else if (!isMicActive && recording) {
        if (gracePeriodTimeout.current) {
          clearTimeout(gracePeriodTimeout.current);
        }
        gracePeriodTimeout.current = setTimeout(() => {
          stopRecording();
          setRecording(false);
        }, GRACE_PERIOD_DURATION);
      }
      return () => {
        if (gracePeriodTimeout.current) {
          clearTimeout(gracePeriodTimeout.current);
        }
      };
    }
  }, [
    isMicActive,
    recording,
    startRecording,
    stopRecording,
    stopOngoingAudio,
    activeButton,
  ]);

  useEffect(() => {
    if (activeButton === "start") {
      if (!recording && transcript.text && !transcribing) {
        let message = transcript.text;
        transcript.text = "";
        (async () => {
          const response = await sendMessage(message);
          playResponse(response);
        })();
      }
    }
  }, [
    recording,
    transcript,
    sendMessage,
    playResponse,
    activeButton,
    transcribing,
  ]);

  return {
    transcribing,
    pauseRecording,
    startRecording,
    stopRecording,
  };
};

export default useRecordAudio;
