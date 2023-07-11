import { useState, useEffect } from 'react';

const useAudioSensitivity = (): boolean => {
  const [isMicActive, setIsMicActive] = useState<boolean>(false);

  useEffect(() => {
    let audioContext: AudioContext,
      analyser: AnalyserNode,
      audioStreamSource: MediaStreamAudioSourceNode;

    const checkAudioLevel = async () => {
      let stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContext = new AudioContext();
      audioStreamSource = audioContext.createMediaStreamSource(stream);
      analyser = audioContext.createAnalyser();

      // set to env var AUDIO_DB_SENSITIVITY
      const sensitivity = parseInt(
        process.env.NEXT_PUBLIC_AUDIO_DB_SENSITIVITY || '-55'
      );
      analyser.minDecibels = sensitivity;
      audioStreamSource.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const domainData = new Uint8Array(bufferLength);

      const detectSound = () => {
        let soundDetected = false;

        analyser.getByteFrequencyData(domainData);

        for (let i = 0; i < bufferLength; i++) {
          if (domainData[i] > 0) {
            soundDetected = true;
          }
        }

        setIsMicActive(soundDetected);
        requestAnimationFrame(detectSound);
      };
      detectSound();
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
