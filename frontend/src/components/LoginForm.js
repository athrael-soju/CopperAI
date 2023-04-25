import React, { useState } from "react";
import env from "react-dotenv";
import InputField from "./InputField";
import SubmitButton from "./SubmitButton";

function Login({ setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const loginUser = async (e) => {
    e.preventDefault();
    const response = await fetch(
      `${env.SERVER_ADDRESS}:${env.SERVER_PORT}${env.SERVER_LOGIN_ENDPOINT}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
    } else {
      alert("Invalid credentials");
    }
  };

  const guestLogin = async () => {
    const response = await fetch(
      `${env.SERVER_ADDRESS}:${env.SERVER_PORT}${env.SERVER_GUEST_ENDPOINT}`
    );
    const data = await response.json();
    setUser(data);
  };

  return (
    <div>
      <form onSubmit={loginUser}>
        <InputField
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <InputField
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <SubmitButton type="submit">Login</SubmitButton>
      </form>
      <SubmitButton onClick={guestLogin}>Login as Guest</SubmitButton>
    </div>
  );
}

export default Login;
