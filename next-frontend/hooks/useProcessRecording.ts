// hooks/useProcessRecording.ts
import { useEffect, useState } from 'react';
import { Session } from 'next-auth'; // If you have types for next-auth
import useTranscription from './useTranscription';
import useSendMessage from './useSendMessage';

export const useProcessRecording = (
  recordingBlob: Blob | null,
  session: Session | null
) => {
  const [status, setStatus] = useState<
    'idle' | 'transcribing' | 'transcribed' | 'sending' | 'sent'
  >('idle');
  const [transcript, setTranscript] = useState<string | null>(null);
  const [recordingProcessed, setRecordingProcessed] = useState(false);

  const sendAudioForTranscription = useTranscription();
  const sendTranscriptForProcessing = useSendMessage(session);

  useEffect(() => {
    //console.log('state:', status, 'recordingProcessed:', recordingProcessed);
    const processRecording = async () => {
      try {
        if (
          recordingBlob &&
          status === 'idle' &&
          transcript === null &&
          !recordingProcessed
        ) {
          setStatus('transcribing');
          const newTranscript = await sendAudioForTranscription(recordingBlob);
          setTranscript(newTranscript);
          setStatus('transcribed');
        }

        if (transcript && status === 'transcribed') {
          setStatus('sending');
          await sendTranscriptForProcessing(transcript);
          setStatus('sent');
          setRecordingProcessed(true);
          setTranscript(null);
        }

        if (status === 'sent' && recordingProcessed) {
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
    transcript,
    session,
    recordingProcessed,
  ]);

  return { status, setStatus, setRecordingProcessed };
};

export default useProcessRecording;
