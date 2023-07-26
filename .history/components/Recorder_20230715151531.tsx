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

import WhisperApi from '../pages/api/backend/WhisperApi';

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

  useEffect(() => {
    if (!recordingBlob) return;
    WhisperApi.transcribeAudio(recordingBlob)
      .then((transcription: string) => {
        console.log(transcription);
      })
      .catch((error: Error) => {
        console.error('Error:', error);
      });
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
