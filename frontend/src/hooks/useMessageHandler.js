import { useState } from "react";
import env from "react-dotenv";

const useMessageHandler = () => {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    setLoading(true);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    };
    const response = await fetch(
      `${env.SERVER_ADDRESS}:${env.SERVER_PORT}${env.SERVER_MESSAGE_ENDPOINT}`,
      requestOptions
    );
    const data = await response.json();

    setResponse(data.message);
    setLoading(false);

    return data.message;
  };

  return { message, setMessage, response, loading, sendMessage };
};

export default useMessageHandler;
