import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMicrophone,
  faPause,
  faStop,
} from '@fortawesome/free-solid-svg-icons';

export const RecordButton: React.FC<{ onClick: () => void }> = ({
  onClick,
}) => (
  <button onClick={onClick} className="text-5xl p-2 mx-2">
    <FontAwesomeIcon icon={faMicrophone} style={{ color: '#505050' }} />
  </button>
);

export const PauseResumeButton: React.FC<{
  isPaused: boolean;
  onClick: () => void;
}> = ({ isPaused, onClick }) => (
  <button onClick={onClick} className="text-5xl p-2 mx-2">
    <FontAwesomeIcon
      icon={isPaused ? faMicrophone : faPause}
      style={{ color: '#505050' }}
    />
  </button>
);

export const StopButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button onClick={onClick} className="text-5xl p-2 mx-2">
    <FontAwesomeIcon icon={faStop} style={{ color: '#505050' }} />
  </button>
);
