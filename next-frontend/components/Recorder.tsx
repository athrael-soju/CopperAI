import { useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAudioRecorder } from 'react-audio-voice-recorder';
import {
  faMicrophone,
  faPause,
  faStop,
  faPlay,
} from '@fortawesome/free-solid-svg-icons';
import useAudioSensitivity from '../hooks/useAudioSensitivity';

const targetUrl = `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}:${process.env.NEXT_PUBLIC_SERVER_PORT}${process.env.NEXT_PUBLIC_SERVER_TRANSCRIBE_ENDPOINT}`;

const Recorder = () => {
  const {
    startRecording,
    stopRecording,
    togglePauseResume,
    recordingBlob,
    isRecording,
    isPaused,
    recordingTime,
    mediaRecorder,
  } = useAudioRecorder();

  const silenceTimer = useRef<NodeJS.Timeout | null>(null);
  const isMicActive = useAudioSensitivity();

  // Refactor to use Next.js routes to send audio to backend
  // return fetch('/api/transcribe', {
  //   method: 'POST',
  //   body: recordingBlob,
  // });
  const sendAudio = async (recordingBlob: Blob) => {
    if (!recordingBlob) {
      console.warn('No audio file provided');
      return;
    }
    const formData = new FormData();

    formData.append('file', recordingBlob, 'audio.mp3');
    fetch(targetUrl, {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.info('Success: ', data.transcription);
      })
      .catch((error) => {
        console.error('Error: ', error);
      });
  };
  
  useEffect(() => {
    if (!recordingBlob) {
      return;
    }

    sendAudio(recordingBlob);
  }, [recordingBlob]);

  useEffect(() => {
    if (isMicActive) {
      if (silenceTimer.current) clearTimeout(silenceTimer.current);
    } else if (isRecording && !isPaused) {
      silenceTimer.current = setTimeout(stopRecording, 3000);
    }
  }, [isMicActive, isRecording, isPaused, stopRecording]);

  return (
    <div>
      {!isRecording && (
        <button onClick={startRecording} className="text-5xl p-2 mx-2">
          <FontAwesomeIcon icon={faMicrophone} style={{ color: '#505050' }} />
        </button>
      )}
      {isRecording && (
        <button onClick={togglePauseResume} className="text-5xl p-2 mx-2">
          <FontAwesomeIcon
            icon={isPaused ? faMicrophone : faPause}
            style={{ color: '#505050' }}
          />
        </button>
      )}
      {isRecording && (
        <button onClick={stopRecording} className="text-5xl p-2 mx-2">
          <FontAwesomeIcon icon={faStop} style={{ color: '#505050' }} />
        </button>
      )}
    </div>
  );
};

export default Recorder;
