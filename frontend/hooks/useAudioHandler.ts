import { useRef } from 'react';

type AudioRefType = HTMLAudioElement | null;

const useAudioHandler = () => {
  const audioRef = useRef<AudioRefType>(null);

  const playResponse = async (text: string) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    };

    try {
      const response = await fetch(
        `http://localhost:5001/speak`,
        // ${process.env.SERVER_ADDRESS}:${process.env.SERVER_PORT}${process.env.SERVER_SPEAK_ENDPOINT}
        requestOptions,
      );
      const blob = await response.blob();
      const audioUrl = URL.createObjectURL(blob);
      audioRef.current = new Audio(audioUrl);
      audioRef.current.play();
    } catch (error) {
      console.error('Error fetching audio response:', error);
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
