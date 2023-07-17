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
import { useSession } from 'next-auth/react';

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
  const [transcribing, setTranscribing] = useState<boolean>(false);

  const { data: session } = useSession();

  const silenceTimer = useRef<NodeJS.Timeout | null>(null);
  const isMicActive = useAudioSensitivity();

  const sendAudioForTranscription = async (recordingBlob: Blob) => {
    if (!recordingBlob) {
      console.warn('No audio file provided');
      return;
    }

    // if (session) {
    //   console.log(session.user); // Logs the user object to the console
    // }

    setTranscribing(true);
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
        setTranscribing(false);
      })
      .catch((error) => {
        console.error('Transcription error:', error);
      });
  };

  useEffect(() => {
    if (!recordingBlob) {
      return;
    }

    if (!transcript) {
      sendAudioForTranscription(recordingBlob);
    }

    if (transcript && !transcribing) {
      // Add logic for V2V speech.
      // fetch('/api/sendMessage', {
      //   method: 'POST',
      //   body: formData,
      // });
    }
  }, [recordingBlob, transcript, transcribing, session]);

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
