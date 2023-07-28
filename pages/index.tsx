import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Recorder from '../components/Recorder';
import { useContext, useState } from 'react';
import ChatTypeContext from '../lib/context/ChatType';
import Spinner from '../components/Spinner';
import SyncButton from '../components/SyncButton';

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
  const [selectionMade, setSelectionMade] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const chooseChatType = (type: string) => {
    setChatType(type);
    setSelectionMade(true);
  };

  return (
    <main className="flex flex-col h-screen justify-center items-center p-24 pb-8">
      {session && isLoading && <Spinner />}
      {!session && (
        <h1 className="text-shadow-default text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-palette2564_1 via-palette2564_3 to-palette2564_5 mb-10">
          Welcome to Copper AI
          <span style={{ fontSize: 15 }}>Please login to continue</span>
        </h1>
      )}
      {!chatType && session && (
        <div className="h-4/5 w-full flex flex-col">
          <button
            className="w-full h-1/2 py-4 px-8 text-white rounded font-bold text-2xl transition-all duration-500 ease-in-out flex items-center justify-center transform hover:scale-105 hover:bg-opacity-70"
            style={{
              backgroundImage:
                'linear-gradient(to right, transparent, #b7b09b, transparent)',
            }}
            onClick={() => chooseChatType('generalChat')}
          >
            Chat with Iris (Casual)
          </button>
          <button
            className="w-full h-1/2 py-4 px-8 text-white rounded font-bold text-2xl transition-all duration-500 ease-in-out flex items-center justify-center transform hover:scale-105 hover:bg-opacity-70"
            style={{
              backgroundImage:
                'linear-gradient(to right, transparent, #e1bc9a, transparent)',
            }}
            onClick={() => chooseChatType('documentChat')}
          >
            Chat with Jude (Document)
          </button>
        </div>
      )}
      {chatType && session && (
        <div style={{ marginTop: 'auto' }}>
          <Recorder className="mb-10" setIsLoading={setIsLoading} />
        </div>
      )}
      {chatType && session && (
        <SyncButton
          resetSelection={() => {
            setChatType(null);
            setSelectionMade(false);
          }}
        />
      )}
    </main>
  );
}
