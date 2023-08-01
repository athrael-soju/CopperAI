import { useRef } from 'react';

const useTextToSpeech = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const generateAudio = async (
    transcript: string | null,
    namespace: string | null
  ) => {
    if (!transcript || !namespace) {
      console.warn('No transcript or namespace provided');
      return;
    }
    console.log('Sending message to text to speech', transcript);
    const formData = new FormData();
    formData.append('transcript', transcript);
    formData.append('namespace', namespace);
    const response = await fetch('/api/textToSpeech', {
      method: 'POST',
      body: formData,
    });
    const data = await response.arrayBuffer();
    const blob = new Blob([data], { type: 'audio/mpeg' });
    const url = URL.createObjectURL(blob);
    console.log('Generated audio: ', url);
    audioRef.current = new Audio(url);
  };

  const startOngoingAudio = () => {
    audioRef.current && audioRef.current.play();
  };

  const stopOngoingAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  return { generateAudio, startOngoingAudio, stopOngoingAudio };
};

export default useTextToSpeech;
