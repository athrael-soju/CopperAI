import type { AppProps as NextAppProps } from 'next/app';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppHeader from '@/components/header/Header';
import '@/styles/globals.css';
import { useMemo, useState } from 'react';
import ChatTypeContext from '@/lib/context/ChatType';

type AppProps = NextAppProps & {
  session: Session;
};

function App({ Component, pageProps, session }: AppProps) {
  const queryClient = new QueryClient();
  const [chatType, setChatType] = useState<string | null>(null);
  const chat = useMemo(() => ({ chatType, setChatType }), [chatType]); // value is cached by useMemo
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <ChatTypeContext.Provider value={chat}>
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
