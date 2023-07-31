import { useRef } from 'react';

const useTextToSpeech = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startOngoingAudio = async (
    transcript: string | Blob,
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
    fetch('/api/textToSpeech', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.arrayBuffer())
      .then((data) => {
        // The variable "data" now contains the binary audio data.
        // You can convert it to a Blob and create an object URL to play it.
        const blob = new Blob([data], { type: 'audio/mpeg' });
        const url = URL.createObjectURL(blob);
        console.log('Sending audio: ', url);
        audioRef.current = new Audio(url);
        audioRef.current.play();
        // You can use the URL to set the src of an audio element, for example.
      });
  };
  const stopOngoingAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  return { startOngoingAudio, stopOngoingAudio };
};

export default useTextToSpeech;
