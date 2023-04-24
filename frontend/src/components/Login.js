import React, { useState } from "react";
import env from "react-dotenv";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import SubmitButton from "./SubmitButton";
import styles from "../styles/Login.module.css";

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

  const registerUser = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${env.SERVER_ADDRESS}:${env.SERVER_PORT}${env.SERVER_REGISTER_ENDPOINT}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error registering user:", error);
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
    <div className={styles.loginContainer}>
      <LoginForm
        username={username}
        password={password}
        setUsername={setUsername}
        setPassword={setPassword}
        loginUser={loginUser}
      />
      <RegisterForm
        username={username}
        password={password}
        setUsername={setUsername}
        setPassword={setPassword}
        registerUser={registerUser}
      />
      <SubmitButton onClick={guestLogin}>Login as Guest</SubmitButton>
    </div>
  );
}

export default Login;
