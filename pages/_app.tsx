import type { AppProps as NextAppProps } from 'next/app';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppHeader from '@/components/header/Header';
import '@/styles/globals.css';
import { useState } from 'react';
import ChatTypeContext from '../lib/context/ChatType';

type AppProps = NextAppProps & {
  session: Session;
};

function App({ Component, pageProps, session }: AppProps) {
  const queryClient = new QueryClient();
  const [chatType, setChatType] = useState<string | null>(null);

  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <ChatTypeContext.Provider value={{ chatType, setChatType }}>
          <main>
            <AppHeader namespace={null} />
            <Component {...pageProps} />
          </main>
        </ChatTypeContext.Provider>
      </QueryClientProvider>
    </SessionProvider>
  );
}

export default App;
