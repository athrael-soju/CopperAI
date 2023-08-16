import React, { useContext } from 'react';
import { signIn, useSession } from 'next-auth/react';

import ChatTypeContext from '@/lib/context/ChatType';
import User from './buttons/User';
import SignInButton from './buttons/SignInButton';
import SignedOutIcon from './buttons/SignedOutIcon';
import FileUpload from '../FileUpload';

type HeaderProps = {
  namespace: string | null;
};

const Header: React.FC<HeaderProps> = ({ namespace }) => {
  const { data: session } = useSession();
  const context = useContext(ChatTypeContext);

  if (!context) {
    throw new Error('Header must be used within a ChatTypeContextProvider');
  }
  const user = session?.user ?? {};
  const username = user?.name ?? '';
  const { chatType } = context;
  namespace =
    chatType === 'documentChat'
      ? 'document'
      : chatType === 'generalChat'
      ? 'general'
      : '';
  return (
    <header className="fixed top-0 left-0 right-0 text-center text-white bg-copper-200 h-16 flex items-center justify-center px-5 shadow-md">
      <div className="flex justify-between w-full items-center">
        <nav>
          {session && (
            <ul className="flex gap-5 list-none m-0 items-center h-full">
              <li className="mr-auto">
                <a
                  className="text-shadow-default text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-palette2564_1 via-palette2564_3 to-palette2564_5"
                  href="https://github.com/athrael-soju/copperAI"
                  target="_blank"
                  rel="noreferrer"
                >
                  Copper AI
                </a>
              </li>
            </ul>
          )}
        </nav>
        {!session && (
          <div className="flex gap-5 items-center">
            <SignInButton signIn={signIn} />
            <SignedOutIcon />
          </div>
        )}

        {session?.user && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 2fr 1fr',
              alignItems: 'center',
            }}
          >
            {chatType === 'documentChat' && (
              <div style={{ gridColumn: 'span 2', position: 'relative' }}>
                <div
                  style={{
                    position: 'absolute',
                    top: -40, // Adjust this value
                    width: '100%', // Adjust this value
                    transform: 'scale(0.8)',
                  }}
                  className="fileUpload"
                >
                  <FileUpload username={username} namespace={namespace} />
                </div>
              </div>
            )}
            <div style={{ gridColumn: '3' }}>
              <User session={session} />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
