import { useState } from 'react';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import getConfig from 'next/config';

const useMessageHandler = ({
  username,
  userdomain,
}: {
  username: string;
  userdomain: string;
}) => {
  const { publicRuntimeConfig } = getConfig();
  const URL = `${publicRuntimeConfig.SERVER_ADDRESS}:${publicRuntimeConfig.SERVER_PORT}${publicRuntimeConfig.SERVER_MESSAGE_ENDPOINT}`;

  const mutation: any = useMutation({
    mutationFn: (data) => {
      return axios.post(URL, data, {
        headers: { 'Content-Type': 'application/json' },
      });
    },
  });

  const sendMessage = async (message: string) => {
    console.log(
      'User: ' +
        username +
        '. User Domain: ' +
        userdomain +
        '. Message: ' +
        message,
    );

    const res = await mutation.mutateAsync(
      {
        variables: { username, userdomain, message },
      },
      {
        onSuccess: async (res: any) => {
          console.log('Response: ' + res);
        },
      },
    );

    return res;
  };

  return { sendMessage, loading: mutation.isLoading };
};

export default useMessageHandler;
