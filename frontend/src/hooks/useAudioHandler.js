import { useRef } from "react";
import env from "react-dotenv";

const useAudioHandler = () => {
  const audioRef = useRef(null);

  const playResponse = async (text) => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    };

    try {
      const response = await fetch(
        `${env.SERVER_ADDRESS}:${env.SERVER_PORT}${env.SERVER_SPEAK_ENDPOINT}`,
        requestOptions
      );
      const blob = await response.blob();
      const audioUrl = URL.createObjectURL(blob);
      audioRef.current = new Audio(audioUrl);
      audioRef.current.play();
    } catch (error) {
      console.error("Error fetching audio response:", error);
    }
  };

  const stopOngoingAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  return { playResponse, stopOngoingAudio };
};

export default useAudioHandler;
