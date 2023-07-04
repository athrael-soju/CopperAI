import getConfig from 'next/config';
import { useState, useEffect, useRef } from 'react';
import { useWhisper } from '@chengsokdara/use-whisper';
import { useIsMounted } from 'usehooks-ts';

import useAudioSensitivity from './useAudioSensitivity';

const GRACE_PERIOD_DURATION = 3000;

const useRecordAudio = (
  sendMessage: any,
  playResponse: any,
  stopOngoingAudio: any,
  activeButton: any,
) => {
  const [recording, setRecording] = useState(false);
  const isMicActive = useAudioSensitivity();
  const gracePeriodTimeout = useRef<any>(null);
  const { publicRuntimeConfig } = getConfig();
  const apiKey = publicRuntimeConfig.OPENAI_API_KEY ?? '';
  const isMounted = useIsMounted();

  const {
    transcribing,
    pauseRecording,
    startRecording,
    transcript,
    stopRecording,
  } = useWhisper({
    apiKey,
  });

  useEffect(() => {
    if (isMounted()) {
      if (activeButton === 'start') {
        if (isMicActive && !recording) {
          stopOngoingAudio();
          startRecording();
          setRecording(true);
        } else if (!isMicActive && recording) {
          if (gracePeriodTimeout.current) {
            clearTimeout(gracePeriodTimeout.current);
          }
          gracePeriodTimeout.current = setTimeout(() => {
            stopRecording();
            setRecording(false);
          }, GRACE_PERIOD_DURATION);
        }
        return () => {
          if (gracePeriodTimeout.current) {
            clearTimeout(gracePeriodTimeout.current);
          }
        };
      }
    }
  }, [
    isMicActive,
    recording,
    startRecording,
    stopRecording,
    stopOngoingAudio,
    activeButton,
    isMounted,
  ]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (activeButton === 'start') {
        if (!recording && transcript.text && !transcribing) {
          let message = transcript.text;
          transcript.text = '';
          (async () => {
            const response = await sendMessage(message);
            playResponse(response);
          })();
        }
      }
    }
  }, [
    recording,
    transcript,
    sendMessage,
    playResponse,
    activeButton,
    transcribing,
  ]);

  return {
    transcribing,
    pauseRecording,
    startRecording,
    stopRecording,
  };
};

export default useRecordAudio;
