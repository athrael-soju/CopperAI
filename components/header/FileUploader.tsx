import React, { useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';

const FileUploader = ({ handleFileUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null); // specify the type here

  const handleButtonClick = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    // check if the ref is attached to a DOM element before calling click
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
        style={{ display: 'none' }} // Hide the input element
      />
      <button
        className="text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 transform hover:scale-105 hover:bg-palette419_3 border border-palette419_5"
        onClick={handleButtonClick} // use handleButtonClick here
        title="Upload File"
      >
        <FontAwesomeIcon icon={faUpload} />
      </button>
    </>
  );
};

export default FileUploader;
