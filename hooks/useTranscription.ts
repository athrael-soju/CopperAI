import { useCallback, SetStateAction, Dispatch } from 'react';

const useTranscription = () => {
  return useCallback(async (recordingBlob: Blob) => {
    if (!recordingBlob) {
      console.warn('No audio file provided');
      return null;
    }
    const formData = new FormData();
    formData.append('file', recordingBlob, 'audio.webm');

    const response = await fetch('/api/transcribe', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    console.log('Message Request:', `"${data.message}"`);
    return data.message;
  }, []);
};

export default useTranscription;
