import { useSession } from 'next-auth/react';

export default function VoicePrompt() {
  const { data } = useSession();

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
