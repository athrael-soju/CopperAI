import { useState } from 'react';

const useMessageHandler = ({
  username,
  userdomain,
}: {
  username: string;
  userdomain: string;
}) => {
  // eslint-disable-next-line
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async (message: string) => {
    console.log(
      'User: ' +
        username +
        '. User Domain: ' +
        userdomain +
        '. Message: ' +
        message,
    );
    setLoading(true);
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, userdomain, message }),
    };
    const response = await fetch(
      `${process.env.SERVER_ADDRESS}:${process.env.SERVER_PORT}${process.env.SERVER_MESSAGE_ENDPOINT}`,
      requestOptions,
    );
    const data = await response.json();
    console.log('Response: ' + data.message);
    setResponse(data.message);
    setLoading(false);

    return data.message;
  };

  return { sendMessage, loading };
};

export default useMessageHandler;
