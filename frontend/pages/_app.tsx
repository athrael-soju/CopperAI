import type { AppProps as NextAppProps } from 'next/app';
import { Session } from 'next-auth';
import { Inter } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from 'antd';
import { gray } from '@ant-design/colors';
import AppHeader from '@/components/header/Header';

import '@/styles/base.css';
import 'antd/dist/reset.css';

type AppProps = NextAppProps & {
  session: Session;
};

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const { Content } = Layout;

const contentStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  textAlign: 'center',
  minHeight: 'calc(100vh - 64px)',
  lineHeight: '120px',
  color: '#fff',
  background: gray[7],
};

function App({ Component, pageProps, session }: AppProps) {
  const queryClient = new QueryClient();
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <main className={inter.variable}>
          <Layout>
            <AppHeader />
            <Content style={contentStyle}>
              <Component {...pageProps} />
            </Content>
          </Layout>
        </main>
      </QueryClientProvider>
    </SessionProvider>
  );
}

export default App;
