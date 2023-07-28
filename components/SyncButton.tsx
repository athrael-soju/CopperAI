import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync } from '@fortawesome/free-solid-svg-icons';

interface SyncButtonProps {
  resetSelection: () => void;
}

const SyncButton: React.FC<SyncButtonProps> = ({ resetSelection }) => (
  <button
    className="text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 transform hover:scale-100 hover:bg-palette419_3 fixed bottom-4 right-4"
    onClick={(e) => {
      e.preventDefault();
      resetSelection();
    }}
    title="Select another activity"
  >
    <FontAwesomeIcon icon={faSync} />
  </button>
);

export default SyncButton;
