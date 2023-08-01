import { useEffect, useState } from 'react';
import { Session } from 'next-auth';
import useTranscription from './useTranscription';
import useSendMessage from './useSendMessage';
import useTextToSpeech from './useTextToSpeech';

export const useProcessRecording = (
  recordingBlob: Blob | null,
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
  >('idle');
  const [transcript, setTranscript] = useState<string | null>(null);
  const [response, setResponse] = useState<string | null>(null);
  const [recordingProcessed, setRecordingProcessed] = useState(false);
  const [lastProcessedBlob, setLastProcessedBlob] = useState<Blob | null>(null);

  const sendAudioForTranscription = useTranscription();
  const sendTranscriptForProcessing = useSendMessage(session, namespace);
  const { generateAudio, startOngoingAudio, stopOngoingAudio } =
    useTextToSpeech();

  useEffect(() => {
    const processRecording = async () => {
      try {
        // If we have a recording and we haven't sent it yet, send it.
        if (
          recordingBlob &&
          recordingBlob !== lastProcessedBlob &&
          status === 'idle' &&
          transcript === null &&
          !recordingProcessed
        ) {
          setIsLoading(true);
          setStatus('transcribing');
          sendAudioForTranscription(recordingBlob).then((newTranscript) => {
            setTranscript(newTranscript);
            setStatus('transcribed');
            setLastProcessedBlob(recordingBlob);
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
        // If the response is ready and we haven't generated the audio yet, generate it.
        if (status === 'sent' && recordingProcessed && transcript === null) {
          setStatus('generating');
          generateAudio(response, namespace).then(() => {
            setIsLoading(false);
            setStatus('idle');
            setStatus('generated'); // set status to 'generated'
            //startOngoingAudio();
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
    recordingBlob,
    status,
    sendAudioForTranscription,
    sendTranscriptForProcessing,
    transcript,
    session,
    recordingProcessed,
    lastProcessedBlob,
    generateAudio, // Add generateAudio to the dependency array
    startOngoingAudio,
    stopOngoingAudio,
    response,
    setIsLoading,
    namespace,
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
