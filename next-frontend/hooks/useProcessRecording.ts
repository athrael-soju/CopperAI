// hooks/useProcessRecording.ts
import { useEffect, useState } from 'react';
import { Session } from 'next-auth'; // If you have types for next-auth
import useTranscription from './useTranscription';
import useSendMessage from './useSendMessage';
import useTextToSpeech from './useTextToSpeech';

export const useProcessRecording = (
  recordingBlob: Blob | null,
  session: Session | null
) => {
  const [status, setStatus] = useState<
    | 'idle'
    | 'transcribing'
    | 'transcribed'
    | 'sending'
    | 'sent'
    | 'error'
    | 'recording'
  >('idle');
  const [transcript, setTranscript] = useState<string | null>(null);
  const [recordingProcessed, setRecordingProcessed] = useState(false);
  const [lastProcessedBlob, setLastProcessedBlob] = useState<Blob | null>(null); // New state

  const sendAudioForTranscription = useTranscription();
  const sendTranscriptForProcessing = useSendMessage(session);
  const sendResponseAndGetAudio = useTextToSpeech();

  useEffect(() => {
    // console.log(
    //   'state:',
    //   status,
    //   'recordingProcessed:',
    //   recordingProcessed,
    //   'transcript:',
    //   transcript
    // );
    const processRecording = async () => {
      try {
        if (
          recordingBlob &&
          recordingBlob !== lastProcessedBlob && // Add this condition
          status === 'idle' &&
          transcript === null &&
          !recordingProcessed
        ) {
          setStatus('transcribing');
          sendAudioForTranscription(recordingBlob).then((newTranscript) => {
            setTranscript(newTranscript);
            setStatus('transcribed');
            setLastProcessedBlob(recordingBlob); // Update lastProcessedBlob
          });
        }

        if (transcript && status === 'transcribed') {
          setStatus('sending');
          sendTranscriptForProcessing(transcript).then((message) => {
            // Send the message to Google Cloud TTS
            sendResponseAndGetAudio(message).then((audio) => {
              audio.play();
            });

            setStatus('sent');
            setRecordingProcessed(true);
            setTranscript(null);
          });
        }

        if (status === 'sent' && recordingProcessed && transcript === null) {
          setStatus('idle');
        }
      } catch (error) {
        console.error('Error processing recording:', error);
        setStatus('error');
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
    lastProcessedBlob,
    sendResponseAndGetAudio,
  ]);

  return { status, setStatus, setRecordingProcessed };
};

export default useProcessRecording;
