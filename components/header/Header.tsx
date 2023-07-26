import React from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useContext } from 'react';
import ChatTypeContext from '../../lib/Context/ChatType'; // update the import path as needed

export default function Header() {
  const { data: session, status } = useSession();
  const chatTypeContext = useContext(ChatTypeContext);

  if (!chatTypeContext) {
    throw new Error('Header must be used within a ChatTypeContextProvider');
  }

  const { chatType } = chatTypeContext;

  const handleFileUpload = (event: { target: { files: any[] } }) => {
    const file = event.target.files[0];
    console.log(file); // Handle the file as needed
  };

  return (
    <header className="fixed top-0 left-0 right-0 text-center text-white bg-copper-200 h-16 flex items-center justify-center px-20 shadow-md">
      <div className="flex justify-between w-full items-center">
        <nav>
          <ul className="flex gap-5 list-none m-0">
            <li>
              <a
                className="text-white underline hover:text-gray-300"
                href="https://github.com/athrael-soju/whisperChat"
                target="_blank"
                rel="noreferrer"
              >
                whisperChat
              </a>
            </li>
            <li>
              {chatType === 'documentChat' && (
                <button
                  className="text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 transform hover:scale-105 hover:bg-palette419_3 border border-palette419_5"
                  onClick={handleFileUpload}
                >
                  Upload File
                </button>
              )}
            </li>
          </ul>
        </nav>
        {!session && (
          <div className="flex gap-5 items-center">
            <span>You are not signed in</span>
            <button
              className="text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 transform hover:scale-105 hover:bg-palette419_3 border border-palette419_5"
              onClick={(e) => {
                e.preventDefault();
                signIn();
              }}
            >
              Sign in
            </button>
          </div>
        )}
        {session?.user && (
          <div className="flex items-center gap-2">
            {session.user.image && (
              <span
                className="w-10 h-10 bg-cover rounded-full"
                style={{ backgroundImage: `url('${session.user.image}')` }}
              />
            )}
            <span className="mr-2 text-gray-800">
              <strong>{session.user.email ?? session.user.name}</strong>
            </span>
            <button
              className="text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 transform hover:scale-105 hover:bg-palette419_3 border border-palette419_5"
              onClick={(e) => {
                e.preventDefault();
                signOut();
              }}
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
