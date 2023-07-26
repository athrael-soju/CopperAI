import React, { useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';

interface FileUploaderProps {
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ handleFileUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        style={{ display: 'none' }}
      />
      <button
        className="text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 transform hover:scale-105 hover:bg-palette419_3 border border-palette419_5"
        onClick={handleButtonClick}
        title="Upload File"
      >
        <FontAwesomeIcon icon={faUpload} />
      </button>
    </>
  );
};

export default FileUploader;
