import React from 'react';
import { useContext } from 'react';
import { signIn, useSession } from 'next-auth/react';

import ChatTypeContext from '../../lib/Context/ChatType'; // update the import path as needed
import UploadButton from './buttons/UploadButton';
import User from './buttons/User';
import SignInButton from './buttons/SignInButton';
import SignedOutIcon from './buttons/SignedOutIcon';

export default function Header() {
  const { data: session, status } = useSession();
  const chatTypeContext = useContext(ChatTypeContext);

  if (!chatTypeContext) {
    throw new Error('Header must be used within a ChatTypeContextProvider');
  }

  const { chatType } = chatTypeContext;

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
            <SignInButton signIn={signIn} />
            <SignedOutIcon />
          </div>
        )}
        {session?.user && (
          <div className="flex items-center gap-2">
            <UploadButton chatType={chatType} />
            <User session={session} />
          </div>
        )}
      </div>
    </header>
  );
}
