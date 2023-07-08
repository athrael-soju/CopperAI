import type { AppProps as NextAppProps } from "next/app";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppHeader from "@/components/header/Header";
import "@/styles/globals.css";

type AppProps = NextAppProps & {
  session: Session;
};

function App({ Component, pageProps, session }: AppProps) {
  const queryClient = new QueryClient();
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <main>
          <AppHeader />
          <Component {...pageProps} />
        </main>
      </QueryClientProvider>
    </SessionProvider>
  );
}

export default App;
