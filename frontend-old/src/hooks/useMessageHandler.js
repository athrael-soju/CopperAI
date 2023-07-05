import { useState } from "react";
import env from "react-dotenv";

const useMessageHandler = (username, userdomain) => {
  // eslint-disable-next-line
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async (message) => {
    console.log(
      "User: " + username + ". User Domain: " + userdomain + ". Message: " + message
    );
    setLoading(true);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, userdomain, message }),
    };
    const response = await fetch(
      `${env.SERVER_ADDRESS}:${env.SERVER_PORT}${env.SERVER_MESSAGE_ENDPOINT}`,
      requestOptions
    );
    const data = await response.json();
    console.log("Response: " + data.message);
    setResponse(data.message);
    setLoading(false);

    return data.message;
  };

  return { sendMessage, loading };
};

export default useMessageHandler;
