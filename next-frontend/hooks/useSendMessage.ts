import { useCallback } from 'react';
import { Session } from 'next-auth'; // If you have types for next-auth

const useSendMessage = (session: Session | null) => {
  return useCallback(
    async (transcript: string) => {
      const formData = new FormData();
      formData.append('transcript', transcript);
      formData.append('username', session?.user?.name as string);
      formData.append('email', session?.user?.email as string);
      formData.append('Content-Type', 'application/json');

      const response = await fetch('/api/sendMessage', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      console.log('Send Message Response:', data.message);
      return data;
    },
    [session]
  );
};

export default useSendMessage;
