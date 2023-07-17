import React from 'react';
import { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAudioRecorder } from 'react-audio-voice-recorder';
import {
  faMicrophone,
  faPause,
  faStop,
  faPlay,
} from '@fortawesome/free-solid-svg-icons';
import useAudioSensitivity from '../hooks/useAudioSensitivity';

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
  const [transcript, setTranscript] = useState<string | null>(null);

  const silenceTimer = useRef<NodeJS.Timeout | null>(null);
  const isMicActive = useAudioSensitivity();

  const sendAudioForTranscription = async (recordingBlob: Blob) => {
    if (!recordingBlob) {
      console.warn('No audio file provided');
      return;
    }
    const formData = new FormData();
    formData.append('file', recordingBlob, 'audio.webm');

    fetch('/api/transcribe', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Transcription response:', data.message);
        setTranscript(data.message);
      })
      .catch((error) => {
        console.error('Transcription error:', error);
      });
  };

  useEffect(() => {
    if (!recordingBlob) {
      return;
    }
    sendAudioForTranscription(recordingBlob);

    if (transcript) {
      // Add logic for V2V speech.
    }
  }, [recordingBlob, transcript]);

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
