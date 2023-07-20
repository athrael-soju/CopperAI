import { useCallback } from 'react';

const useTextToSpeech = () => {
  return useCallback(async (transcript: string) => {
    console.log('Sending message to text to speech', transcript);
    const formData = new FormData();
    formData.append('transcript', transcript);
    return fetch('/api/textToSpeech', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.arrayBuffer())
      .then((data) => {
        // The variable "data" now contains the binary audio data.
        // You can convert it to a Blob and create an object URL to play it.
        const blob = new Blob([data], { type: 'audio/mpeg' });
        const url = URL.createObjectURL(blob);
        console.log('Sending audio', { audio: url });
        return new Audio(url);
        // You can use the URL to set the src of an audio element, for example.
      });
  }, []);
};

export default useTextToSpeech;
