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
import { set } from 'mongoose';

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

  const [status, setStatus] = useState<
    'idle' | 'transcribing' | 'sending' | 'sent'
  >('idle');

  const sendAudioForTranscription = useTranscription();
  const sendTranscriptForProcessing = useSendMessage(session);

  useEffect(() => {
    const processRecording = async () => {
      try {
        if (recordingBlob && status === 'idle') {
          setStatus('transcribing');
          const transcript = await sendAudioForTranscription(recordingBlob);

          if (transcript) {
            setStatus('sending');
            await sendTranscriptForProcessing(transcript);
            setStatus('sent');
          }
        }

        if (status === 'sent') {
          setStatus('idle');
        }
      } catch (error) {
        console.error('Error processing recording:', error);
        setStatus('idle');
      }
    };

    processRecording();
  }, [
    recordingBlob,
    status,
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
      {status === 'idle' && !isRecording && (
        <RecordButton onClick={startRecording} />
      )}
      {isRecording && (
        <PauseResumeButton isPaused={isPaused} onClick={togglePauseResume} />
      )}
      {isRecording && <StopButton onClick={stopRecording} />}
    </div>
  );
};

export default Recorder;
