import { useEffect, useState } from 'react';
import { Session } from 'next-auth'; 
import useTranscription from './useTranscription';
import useSendMessage from './useSendMessage';
import useTextToSpeech from './useTextToSpeech';

export const useProcessRecording = (
  recordingBlob: Blob | null,
  session: Session | null,
  setIsLoading: (loading: boolean) => void
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
  const [response, setResponse] = useState<string | null>(null);
  const [recordingProcessed, setRecordingProcessed] = useState(false);
  const [lastProcessedBlob, setLastProcessedBlob] = useState<Blob | null>(null);

  const sendAudioForTranscription = useTranscription();
  const sendTranscriptForProcessing = useSendMessage(session);
  const { startOngoingAudio, stopOngoingAudio } = useTextToSpeech();

  useEffect(() => {
    console.log(
      'state:',
      status,
      'recordingProcessed:',
      recordingProcessed,
      'transcript:',
      transcript
    );
    const processRecording = async () => {
      try {
        // If we have a recording and we haven't sent it yet, send it.
        if (
          recordingBlob &&
          recordingBlob !== lastProcessedBlob && // Add this condition
          status === 'idle' &&
          transcript === null &&
          !recordingProcessed
        ) {
          setIsLoading(true); // Set loading state to true when recording starts processing
          setStatus('transcribing');
          sendAudioForTranscription(recordingBlob).then((newTranscript) => {
            setTranscript(newTranscript);
            setStatus('transcribed');
            setLastProcessedBlob(recordingBlob); // Update lastProcessedBlob
          });
        }
        // If the transcript is ready and we haven't sent it yet, send it.
        if (transcript && status === 'transcribed') {
          setStatus('sending');
          sendTranscriptForProcessing(transcript).then((newResponse) => {
            setResponse(newResponse);
            setStatus('sent');
            setRecordingProcessed(true);
            setTranscript(null);
          });
        }
        // If the response is ready and we haven't played it yet, play it.
        if (status === 'sent' && recordingProcessed && transcript === null) {
          setIsLoading(false); // Set loading state to false when processing has finished
          setStatus('idle');
          if (response) {
            stopOngoingAudio();
            startOngoingAudio(response);
          } else {
            startOngoingAudio(
              'Sorry, I did not understand that. Please try again.'
            );
          }
        }
      } catch (error) {
        console.error('Error processing recording:', error);
        setStatus('error');
        setIsLoading(false); // Also set loading state to false in case of an error
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
    stopOngoingAudio,
    startOngoingAudio,
    response,
    setIsLoading, // Add setIsLoading to the dependencies array
  ]);

  return {
    transcript,
    response,
    status,
    setStatus,
    recordingProcessed,
    setRecordingProcessed,
    startOngoingAudio,
    stopOngoingAudio,
  };
};

export default useProcessRecording;
