'use client';

import { useSession } from 'next-auth/react';
import VoicePromptCard from '../components/VoicePrompt';
import LoadingAlerts from '../components/LoadingAlerts';

import useMessageHandler from '../hooks/useMessageHandler';
import useAudioHandler from '../hooks/useAudioHandler';
import useRecordAudio from '../hooks/useRecordAudio';
import useButtonStates from '../hooks/useButtonStates';

export default function VoicePrompt() {
  const { data } = useSession();
  const user = data?.user;

  const { sendMessage, loading: messageLoading } = useMessageHandler(
    user?.name ?? '',
    // user.userdomain ?? '', TODO: check if we need this
  );

  const { playResponse, stopOngoingAudio } = useAudioHandler();
  const {
    isRecording,
    setIsRecording,
    setIsPaused,
    activeButton,
    setActiveButton,
  } = useButtonStates();

  const { transcribing, pauseRecording, startRecording, stopRecording } =
    useRecordAudio(sendMessage, playResponse, stopOngoingAudio, activeButton);

  const getAlert = () => {
    if (!isRecording) {
      return null;
    }

    // if (messageLoading) {
    //   return {
    //     message: 'AI is thinking',
    //     type: 'info',
    //   };
    // }

    // if (speakLoading) {
    //   return {
    //     message: 'AI is speaking',
    //     type: 'info',
    //   };
    // }

    // if (isPaused) {
    //   return {
    //     message: 'Paused',
    //     type: 'warning',
    //   };
    // }

    return null;
  };

  return (
    <div
      style={{
        margin: 'auto',
      }}
    >
      <LoadingAlerts alert={getAlert()} />
      <VoicePromptCard
        startRecording={startRecording}
        pauseRecording={pauseRecording}
        stopRecording={stopRecording}
        stopOngoingAudio={stopOngoingAudio}
        isRecording={isRecording}
        setIsRecording={setIsRecording}
        setIsPaused={setIsPaused}
        activeButton={activeButton}
        setActiveButton={setActiveButton}
      />
    </div>
  );
}
