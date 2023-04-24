import { useState, useEffect } from "react";
import env from "react-dotenv";

const useFetchWelcomeMessage = () => {
  const [response, setResponse] = useState("");

  useEffect(() => {
    const fetchWelcomeMessage = async () => {
      const response = await fetch(
        `${env.SERVER_ADDRESS}:${env.SERVER_PORT}${env.SERVER_WELCOME_ENDPOINT}`
      );
      const data = await response.json();
      setResponse(data.message);
    };

    fetchWelcomeMessage();
  }, []);

  return response;
};

export default useFetchWelcomeMessage;
