import { useEffect, useRef } from 'react';

const useTextToSpeech = (setStatus: any) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audio = audioRef.current;
  useEffect(() => {
    const handlePlay = () => {
      setStatus('playing');
    };

    const handleEnded = () => {
      setStatus('idle');
    };

    if (audio) {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('ended', handleEnded);

      audio.addEventListener('play', handlePlay);
      audio.addEventListener('ended', handleEnded);
    }

    return () => {
      if (audio) {
        audio.removeEventListener('play', handlePlay);
        audio.removeEventListener('ended', handleEnded);
      }
    };
  }, [setStatus, audio]);

  const generateAudio = async (
    transcript: string | null,
    namespace: string | null
  ) => {
    if (!transcript || !namespace) {
      console.warn('No transcript or namespace provided');
      return;
    }
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

    audioRef.current = new Audio(url);

    if (audioRef.current) {
      audioRef.current.addEventListener('play', () => {});
    }
  };

  const startOngoingAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const stopOngoingAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  return { generateAudio, startOngoingAudio, stopOngoingAudio, audioRef };
};

export default useTextToSpeech;
