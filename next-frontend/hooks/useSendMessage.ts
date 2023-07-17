import { useCallback } from 'react';
import { Session } from 'next-auth'; // If you have types for next-auth

const useSendMessage = (session: Session | null) => {
  return useCallback(
    async (transcript: string) => {
      const formData = new FormData();
      formData.append('transcript', transcript);
      formData.append('user', session?.user?.email as string);
      formData.append('Content-Type', 'application/json');

      const response = await fetch('/api/sendMessage', {
        method: 'POST',
        body: formData,
      });
      console.log('Send Message Response:', response);
    },
    [session]
  );
};

export default useSendMessage;
