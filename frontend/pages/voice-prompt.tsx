import { useSession } from 'next-auth/react';
import VoicePromptCard from '../components/VoicePrompt';
import useMessageHandler from '../hooks/useMessageHandler';
import useAudioHandler from '../hooks/useAudioHandler';
import useRecordAudio from '../hooks/useRecordAudio';
import useButtonStates from '../hooks/useButtonStates';

export default function VoicePrompt() {
  const { data } = useSession();
  const user = data?.user;

  const { sendMessage, loading } = useMessageHandler(
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

  return (
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
  );
}
