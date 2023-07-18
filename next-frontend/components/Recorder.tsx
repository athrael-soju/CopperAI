import React, { useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAudioRecorder } from 'react-audio-voice-recorder';
import {
  faMicrophone,
  faPause,
  faStop,
} from '@fortawesome/free-solid-svg-icons';
import useAudioSensitivity from '../hooks/useAudioSensitivity';
import { useSession } from 'next-auth/react';
import useProcessRecording from '../hooks/useProcessRecording';

const RecordButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button onClick={onClick} className="text-5xl p-2 mx-2">
    <FontAwesomeIcon icon={faMicrophone} style={{ color: '#505050' }} />
  </button>
);

const PauseResumeButton: React.FC<{
  isPaused: boolean;
  onClick: () => void;
}> = ({ isPaused, onClick }) => (
  <button onClick={onClick} className="text-5xl p-2 mx-2">
    <FontAwesomeIcon
      icon={isPaused ? faMicrophone : faPause}
      style={{ color: '#505050' }}
    />
  </button>
);

const StopButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button onClick={onClick} className="text-5xl p-2 mx-2">
    <FontAwesomeIcon icon={faStop} style={{ color: '#505050' }} />
  </button>
);

const Recorder: React.FC = () => {
  const {
    startRecording,
    stopRecording,
    togglePauseResume,
    recordingBlob,
    isRecording,
    isPaused,
  } = useAudioRecorder();

  const { data: session } = useSession();

  const silenceTimer = useRef<NodeJS.Timeout | null>(null);
  const isMicActive = useAudioSensitivity();

  const { status, setStatus, setRecordingProcessed } = useProcessRecording(
    recordingBlob,
    session?.user
  );

  const startRecordingAndReset = () => {
    setRecordingProcessed(false);
    startRecording();
  };

  useEffect(() => {
    if (isMicActive) {
      if (silenceTimer.current) clearTimeout(silenceTimer.current);
    } else if (isRecording && !isPaused) {
      silenceTimer.current = setTimeout(stopRecording, 3000);
    }
  }, [isMicActive, isRecording, isPaused, stopRecording]);

  return (
    <div>
      {status === 'idle' && !isRecording && (
        <RecordButton onClick={startRecordingAndReset} />
      )}
      {isRecording && (
        <PauseResumeButton isPaused={isPaused} onClick={togglePauseResume} />
      )}
      {isRecording && <StopButton onClick={stopRecording} />}
    </div>
  );
};

export default Recorder;
