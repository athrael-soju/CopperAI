import React, { useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';

interface UploadButtonProps {
  chatType: string | null;
}

const UploadButton: React.FC<UploadButtonProps> = ({ chatType }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      console.log('File Uploaded: ', file);
    }
  };

  return (
    chatType === 'documentChat' ? (
      <>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          style={{ display: 'none' }} // Hide the input element
        />
        <button
          className="text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 transform hover:scale-105 hover:bg-palette419_3 border border-palette419_5"
          onClick={handleButtonClick}
          title="Upload File"
        >
          <FontAwesomeIcon icon={faUpload} />
        </button>
      </>
    ) : null
  );
};

export default UploadButton;
