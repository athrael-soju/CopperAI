import { useState, useEffect } from 'react';
import getConfig from 'next/config';

type AudioContextType = AudioContext | undefined;
type AnalyserType = AnalyserNode | undefined;
type AudioStreamSourceType = MediaStreamAudioSourceNode | undefined;

const useAudioSensitivity = (): boolean => {
  const { publicRuntimeConfig } = getConfig();
  const [isMicActive, setIsMicActive] = useState<boolean>(false);

  useEffect(() => {
    let audioContext: AudioContextType;
    let analyser: AnalyserType;
    let audioStreamSource: AudioStreamSourceType;

    const checkAudioLevel = async (): Promise<void> => {
      try {
        const minDecibels = parseInt(publicRuntimeConfig.AUDIO_DB_SENSITIVITY);
        if (typeof window !== 'undefined') {
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
          });
          audioContext = new AudioContext();
          audioStreamSource = audioContext.createMediaStreamSource(stream);
          analyser = audioContext.createAnalyser();

          analyser.minDecibels = minDecibels;
          audioStreamSource.connect(analyser);

          const bufferLength = analyser.frequencyBinCount;
          const domainData = new Uint8Array(bufferLength);

          const detectSound = (): void => {
            let soundDetected = false;

            analyser?.getByteFrequencyData(domainData);

            for (let i = 0; i < bufferLength; i++) {
              if (domainData[i] > 0) {
                soundDetected = true;
              }
            }

            setIsMicActive(soundDetected);
            requestAnimationFrame(detectSound);
          };

          detectSound();
        }
      } catch (error) {
        console.error('Error accessing microphone:', error);
      }
    };

    checkAudioLevel();

    return () => {
      if (audioStreamSource) {
        audioStreamSource.disconnect();
      }
      if (audioContext) {
        audioContext.close();
      }
    };
  }, []);

  return isMicActive;
};

export default useAudioSensitivity;
