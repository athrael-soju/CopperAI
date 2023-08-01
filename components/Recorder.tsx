import { useEffect } from 'react';
import { useMachine } from '@xstate/react';
import { createMachine } from 'xstate';
import { useAudioRecorder } from 'react-audio-voice-recorder';
import { useSession } from 'next-auth/react';
import useAudioSensitivity from '../hooks/useAudioSensitivity';
import useProcessRecording from '../hooks/useProcessRecording';
import { RecordButton, PauseResumeButton, StopButton } from './Buttons';
import { useCallback } from 'react';

type RecorderProps = {
  className?: string;
  setIsLoading: (loading: boolean) => void;
  namespace: string | null;
};

const recorderMachine = createMachine({
  id: 'recorder',
  initial: 'idle',
  states: {
    idle: {
      on: { START: 'recording' },
    },
    recording: {
      on: { STOP: 'idle', PAUSE: 'paused' },
    },
    paused: {
      on: { RESUME: 'recording', STOP: 'idle' },
    },
  },
  predictableActionArguments: true,
});

const Recorder: React.FC<RecorderProps> = ({
  className,
  setIsLoading,
  namespace,
}) => {
  const [current, send] = useMachine(recorderMachine);
  const {
    startRecording,
    stopRecording,
    togglePauseResume,
    recordingBlob,
    isRecording,
    isPaused,
  } = useAudioRecorder();
  const { data: session } = useSession();
  const {
    transcript,
    response,
    status,
    setStatus,
    recordingProcessed,
    setRecordingProcessed,
    startOngoingAudio,
    stopOngoingAudio,
  } = useProcessRecording(
    recordingBlob || null,
    session,
    setIsLoading,
    namespace
  );
  const isMicActive = useAudioSensitivity();

  const recordButtonEvent = useCallback(() => {
    stopOngoingAudio();
    setStatus('recording');
    setRecordingProcessed(false);
    startRecording();
    send('START');
  }, [
    stopOngoingAudio,
    setStatus,
    setRecordingProcessed,
    startRecording,
    send,
  ]);

  const stopButtonEvent = useCallback(() => {
    stopRecording();
    setStatus('idle'); // Set status to 'idle' when recording stops
    send('STOP');
  }, [stopRecording, setStatus, send]);

  const pauseButtonEvent = useCallback(() => {
    togglePauseResume();
    if (current.matches('recording')) {
      send('PAUSE');
    } else {
      send('RESUME');
    }
  }, [togglePauseResume, current, send]);

  useEffect(() => {
    console.log('status', status);
    if (status === 'generated') {
      startOngoingAudio();
      setStatus('idle');
    }
  }, [status, startOngoingAudio, setStatus]);

  return (
    <div className={className}>
      {current.matches('idle') && <RecordButton onClick={recordButtonEvent} />}
      {current.matches('recording') && (
        <PauseResumeButton isPaused={false} onClick={pauseButtonEvent} />
      )}
      {current.matches('paused') && (
        <PauseResumeButton isPaused={true} onClick={pauseButtonEvent} />
      )}
      {(current.matches('recording') || current.matches('paused')) && (
        <StopButton onClick={stopButtonEvent} />
      )}
    </div>
  );
};

export default Recorder;
