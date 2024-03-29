import { useEffect, useState } from 'react';
import { Session } from 'next-auth';
import useSendMessage from './useSendMessage';
import useTextToSpeech from './useTextToSpeech';

export const useProcessRecording = (
  newTranscript: string | null,
  session: Session | null,
  setIsLoading: (loading: boolean) => void,
  namespace: string | null
) => {
  const [status, setStatus] = useState<
    | 'idle'
    | 'transcribing'
    | 'transcribed'
    | 'sending'
    | 'sent'
    | 'generating'
    | 'generated'
    | 'error'
    | 'recording'
    | 'playing'
  >('idle');
  const [transcript, setTranscript] = useState<string | null>(null);
  const [response, setResponse] = useState<string | null>(null);
  const [recordingProcessed, setRecordingProcessed] = useState(false);
  const [lastProcessedTranscript, setLastProcessedTranscript] = useState<
    string | null
  >(null);

  const sendTranscriptForProcessing = useSendMessage(session, namespace);
  const { generateAudio, startOngoingAudio, stopOngoingAudio, audioRef } =
    useTextToSpeech(setStatus);

  useEffect(() => {
    const processRecording = () => {
      try {
        // If we have a transcript and we haven't saved it yet, save it
        if (
          newTranscript &&
          newTranscript !== lastProcessedTranscript &&
          status === 'idle' &&
          transcript === null &&
          !recordingProcessed
        ) {
          console.log('Message Prompt: ', newTranscript);
          setIsLoading(true);
          setStatus('transcribing');
          setTranscript(newTranscript);
          setStatus('transcribed');
          setLastProcessedTranscript(newTranscript);
        }
        // If the transcript is ready and we haven't sent it yet, send it
        if (transcript && status === 'transcribed') {
          setStatus('sending');
          sendTranscriptForProcessing(transcript).then((newResponse) => {
            if (!newResponse) {
              //Placeholder until a better error message system is implemented.
              setResponse(
                "Whoops! Something went wrong. Please try again. Gently. Before I get angry. You wouldn't like me when I'm angry"
              );
              setStatus('sent');
            } else {
              setResponse(newResponse);
              setStatus('sent');
            }
            setIsLoading(false);
            setRecordingProcessed(true);
            setTranscript(null);
          });
        }
        // If the response is ready and we haven't generated the audio yet, generate it.
        if (status === 'sent' && recordingProcessed && transcript === null) {
          setStatus('generating');
          generateAudio(response, namespace).then(() => {
            setIsLoading(false);
            setStatus('generated'); // set status to 'generated'
          });
        }
      } catch (error) {
        console.error('Error processing recording:', error);
        setStatus('error');
        setIsLoading(false);
      }
    };

    processRecording();
  }, [
    status,
    sendTranscriptForProcessing,
    transcript,
    session,
    recordingProcessed,
    generateAudio,
    startOngoingAudio,
    stopOngoingAudio,
    response,
    setIsLoading,
    namespace,
    newTranscript,
    lastProcessedTranscript,
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
    audioRef,
  };
};

export default useProcessRecording;
