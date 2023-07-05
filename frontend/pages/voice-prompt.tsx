'use client';
import { useState, useEffect, useRef } from 'react';
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

  const { sendMessage, loading: messageLoading } = useMessageHandler({
    username: user?.name ?? '',
    userdomain: '', // TODO: will be changed
  });

  const { playResponse, stopOngoingAudio } = useAudioHandler();
  const {
    isRecording,
    setIsRecording,
    setIsPaused,
    activeButton,
    setActiveButton,
  } = useButtonStates();

  const {
    transcribing,
    transcript,
    pauseRecording,
    startRecording,
    stopRecording,
  } = useRecordAudio(playResponse, stopOngoingAudio, activeButton);

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

  useEffect(() => {
    // TODO: send message every 3 seconds + other checks
    if (transcript.text && !transcribing) {
      let message = transcript.text;
      transcript.text = '';
      (async () => {
        const response = await sendMessage(message);
        playResponse(response);
      })();
    }
  }, [transcript, sendMessage, playResponse, activeButton, transcribing]);

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
