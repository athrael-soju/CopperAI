import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAudioRecorder } from 'react-audio-voice-recorder';
import {
  faMicrophone,
  faPause,
  faStop,
} from '@fortawesome/free-solid-svg-icons';
import useAudioSensitivity from '../hooks/useAudioSensitivity';
import { useSession } from 'next-auth/react';
import useTranscription from '../hooks/useTranscription';
import useSendMessage from '../hooks/useSendMessage';

const RecordButton: React.FC<{ isRecording: boolean; onClick: () => void }> = ({
  isRecording,
  onClick,
}) => (
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

  const [transcript, setTranscript] = useState<string | null>(null);
  const [transcribing, setTranscribing] = useState<boolean>(false);

  const sendAudioForTranscription = useTranscription();
  const sendTranscriptForProcessing = useSendMessage(session);

  useEffect(() => {
    const processRecording = async () => {
      if (!recordingBlob) {
        return;
      }

      const transcript = await sendAudioForTranscription(recordingBlob);
      setTranscript(transcript);
      if (transcript) {
        await sendTranscriptForProcessing(transcript);
        setTranscript(null);
      }
    };

    processRecording();
  }, [
    recordingBlob,
    sendAudioForTranscription,
    sendTranscriptForProcessing,
    session,
  ]);

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
        <RecordButton onClick={startRecording} isRecording={false} />
      )}
      {isRecording && (
        <PauseResumeButton isPaused={isPaused} onClick={togglePauseResume} />
      )}
      {isRecording && <StopButton onClick={stopRecording} />}
    </div>
  );
};

export default Recorder;
