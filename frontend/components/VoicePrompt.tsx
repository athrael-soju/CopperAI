import React from 'react';
import { Button, Card } from 'antd';
import { AudioOutlined, PauseOutlined, StopOutlined } from '@ant-design/icons';

const VoicePrompt = ({
  startRecording,
  pauseRecording,
  stopRecording,
  stopOngoingAudio,
  isRecording,
  setIsRecording,
  setIsPaused,
  activeButton,
  setActiveButton,
}: any) => {
  const handleStartRecording = () => {
    setActiveButton('start');
    stopOngoingAudio();
    setIsRecording(true);
    startRecording();
  };

  const handlePauseRecording = () => {
    if (isRecording) {
      setActiveButton('pause');
      setIsPaused(true);
      pauseRecording();
    }
  };

  const handleStopRecording = () => {
    setActiveButton('stop');
    setIsRecording(false);
    setIsPaused(false);
    stopRecording();
    stopOngoingAudio();
  };

  return (
    <Card>
      <Button onClick={handleStartRecording} icon={<AudioOutlined />} />
      <Button onClick={handlePauseRecording} icon={<PauseOutlined />} />
      <Button onClick={handleStopRecording} icon={<StopOutlined />} />
    </Card>
  );
};

export default VoicePrompt;
