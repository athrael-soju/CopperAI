import React from 'react';
import { useContext, useRef } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSignInAlt,
  faSignOutAlt,
  faUpload,
} from '@fortawesome/free-solid-svg-icons';

import ChatTypeContext from '../../lib/Context/ChatType'; // update the import path as needed

export default function Header() {
  const fileInputRef = useRef<HTMLInputElement>(null); // specify the type here
  const { data: session, status } = useSession();
  const chatTypeContext = useContext(ChatTypeContext);

  if (!chatTypeContext) {
    throw new Error('Header must be used within a ChatTypeContextProvider');
  }

  const { chatType } = chatTypeContext;

  const handleButtonClick = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    // check if the ref is attached to a DOM element before calling click
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      console.log('File Uploaded: ', file); // Handle the file as needed
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 text-center text-white bg-copper-200 h-16 flex items-center justify-center px-20 shadow-md">
      <div className="flex justify-between w-full items-center">
        <nav>
          <ul className="flex gap-5 list-none m-0 items-center h-full">
            <li className="mr-auto">
              <a
                className="text-shadow-default text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-palette2564_1 via-palette2564_3 to-palette2564_5"
                href="https://github.com/athrael-soju/whisperChat"
                target="_blank"
                rel="noreferrer"
              >
                Copper AI
              </a>
            </li>
          </ul>
        </nav>
        {!session && (
          <div className="flex gap-5 items-center">
            <button
              className="text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 transform hover:scale-105 hover:bg-palette419_3 border border-palette419_5"
              onClick={(e) => {
                e.preventDefault();
                signIn();
              }}
              title="Sign in"
            >
              <FontAwesomeIcon icon={faSignInAlt} />
            </button>
            <span
              className="w-10 h-10 bg-cover rounded-full"
              style={{ backgroundColor: 'lightgray' }}
              title="Signed Out"
            />
          </div>
        )}
        {session?.user && (
          <div className="flex items-center gap-2">
            {chatType === 'documentChat' && (
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
            )}
            <button
              className="text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 transform hover:scale-105 hover:bg-palette419_3 border border-palette419_5"
              onClick={(e) => {
                e.preventDefault();
                signOut();
              }}
              title="Sign out"
            >
              <FontAwesomeIcon icon={faSignOutAlt} />
            </button>
            <span
              className="w-10 h-10 bg-cover rounded-full"
              style={{
                backgroundImage: session.user.image
                  ? `url('${session.user.image}')`
                  : 'lightgray',
              }}
              title={
                session.user.email ?? session.user.name ?? 'No name provided'
              }
            />
          </div>
        )}
      </div>
    </header>
  );
}
