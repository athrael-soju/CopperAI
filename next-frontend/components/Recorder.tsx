import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAudioRecorder } from 'react-audio-voice-recorder';
import {
  faMicrophone,
  faPause,
  faStop,
} from '@fortawesome/free-solid-svg-icons';
import useAudioSensitivity from '../hooks/useAudioSensitivity';
import useProcessRecording from '../hooks/useProcessRecording';
import { useSession } from 'next-auth/react';

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
  const GRACE_PERIOD_DURATION = 3000;
  const {
    transcript,
    response,
    status,
    setStatus,
    recordingProcessed,
    setRecordingProcessed,
    startOngoingAudio,
    stopOngoingAudio,
  } = useProcessRecording(recordingBlob, session);
  const isMicActive = useAudioSensitivity();
  const [activeButton, setActiveButton] = useState('');
  const recordButtonEvent = useCallback(() => {
    setActiveButton('record');
    stopOngoingAudio();
    setStatus('recording');
    setRecordingProcessed(false);
    setHasDetectedSound(false); // Reset this state when the user starts recording.
    startRecording();
  }, [stopOngoingAudio, setStatus, setRecordingProcessed, startRecording]);

  const stopButtonEvent = useCallback(() => {
    setActiveButton('stop');
    stopRecording();
    setStatus('idle'); // Set status to 'idle' when recording stops
  }, [stopRecording, setStatus]);
  const pauseButtonEvent = useCallback(() => {
    setActiveButton('pause');
    togglePauseResume();
  }, [togglePauseResume]);
  const gracePeriodTimeout = useRef(null);
  const [hasDetectedSound, setHasDetectedSound] = useState(false);

  useEffect(() => {
    console.log(
      'status: ',
      status,
      'isRecording: ',
      isRecording,
      'recordingProcessed: ',
      recordingProcessed,
      'transcript: ',
      transcript,
      'activeButton: ',
      activeButton,
      'isMicActive: ',
      isMicActive
    );
    if (activeButton === 'record' && isRecording) {
      if (isMicActive) {
        setHasDetectedSound(true); // Set this state to true when the microphone detects sound.
        if (gracePeriodTimeout.current) {
          clearTimeout(gracePeriodTimeout.current);
          gracePeriodTimeout.current = null;
        }
      } else {
        if (hasDetectedSound && !gracePeriodTimeout.current) {
          // The timeout should only start if this state is true.
          gracePeriodTimeout.current = setTimeout(() => {
            stopRecording();
            setStatus('idle');
          }, GRACE_PERIOD_DURATION);
        }
      }
    }
  }, [isMicActive, isRecording, activeButton, recordButtonEvent, stopButtonEvent, stopRecording, setStatus, hasDetectedSound, status, recordingProcessed, transcript]);

  return (
    <div>
      {status === 'idle' && !isRecording && (
        <RecordButton onClick={recordButtonEvent} />
      )}
      {isRecording && (
        <PauseResumeButton isPaused={isPaused} onClick={pauseButtonEvent} />
      )}
      {isRecording && <StopButton onClick={stopButtonEvent} />}
    </div>
  );
};

export default Recorder;
