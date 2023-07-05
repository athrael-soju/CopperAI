import { useState, useEffect, useRef } from 'react';
import getConfig from 'next/config';
import { useWhisper } from '@chengsokdara/use-whisper';

import useAudioSensitivity from './useAudioSensitivity';

const GRACE_PERIOD_DURATION = 3000;

const useRecordAudio = (
  playResponse: any,
  stopOngoingAudio: any,
  activeButton: any,
) => {
  const [recording, setRecording] = useState(false);
  const isMicActive = useAudioSensitivity();
  const gracePeriodTimeout = useRef<any>(null);
  const { publicRuntimeConfig } = getConfig();
  const apiKey = publicRuntimeConfig.OPENAI_API_KEY ?? '';

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
  }, [
    isMicActive,
    recording,
    startRecording,
    stopRecording,
    stopOngoingAudio,
    activeButton,
  ]);

  return {
    transcribing,
    transcript,
    pauseRecording,
    startRecording,
    stopRecording,
  };
};

export default useRecordAudio;
