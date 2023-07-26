import { useRouter } from 'next/router';

import { useSession } from 'next-auth/react';
import Recorder from '../components/Recorder';
import { useContext } from 'react';
import ChatTypeContext from '../lib/Context/ChatType'; // update the import path as needed
export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated: () => {},
  });

  const chatTypeContext = useContext(ChatTypeContext);

  if (!chatTypeContext) {
    throw new Error('Home must be used within a ChatTypeContextProvider');
  }

  const { chatType, setChatType } = chatTypeContext;

  const chooseChatType = (type: string) => {
    setChatType(type);
  };

  return (
    <main className="flex flex-col min-h-screen justify-center items-center p-24">
      {!chatType && session && (
        <div className="space-y-8 w-full">
          <button
            className="w-full py-4 px-8 text-white rounded font-bold text-2xl transition-transform duration-200 transform hover:scale-105"
            style={{ backgroundColor: '#b7b09b' }}
            onClick={() => chooseChatType('generalChat')}
          >
            General Chat
          </button>
          <button
            className="w-full py-4 px-8 text-white rounded font-bold text-2xl transition-transform duration-200 transform hover:scale-105"
            style={{ backgroundColor: '#e1bc9a' }}
            onClick={() => chooseChatType('documentChat')}
          >
            Document Chat
          </button>
        </div>
      )}
      {chatType && session && <Recorder className="mb-10" />}
    </main>
  );
}
