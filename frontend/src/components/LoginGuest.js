import React from "react";
import env from "react-dotenv";
import { Button } from "antd";

const LoginGuest = ({ setUser }) => {
  const guestLogin = async () => {
    const response = await fetch(
      `${env.SERVER_ADDRESS}:${env.SERVER_PORT}${env.SERVER_GUEST_ENDPOINT}`
    );
    const data = await response.json();
    setUser(data);
  };

  return <Button onClick={guestLogin}>Login as Guest</Button>;
};

export default LoginGuest;
