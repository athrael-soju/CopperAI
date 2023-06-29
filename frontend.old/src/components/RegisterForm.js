import React, { useState } from "react";
import InputField from "./InputField";
import SubmitButton from "./SubmitButton";

import env from "react-dotenv";

function RegisterForm({ setUser }) {
  const [username, setUsername] = useState("");
  const [userdomain, setUserdomain] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const registerUser = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(
        `${env.SERVER_ADDRESS}:${env.SERVER_PORT}${env.SERVER_REGISTER_ENDPOINT}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            userdomain,
            password,
            email,
            birthdate,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  return (
    <form onSubmit={registerUser}>
      {error && <p className="text-danger">{error}</p>}
      <InputField
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <InputField
        type="text"
        placeholder="Userdomain"
        value={userdomain}
        onChange={(e) => setUserdomain(e.target.value)}
        required
      />
      <InputField
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <InputField
        type="date"
        placeholder="Birthdate"
        value={birthdate}
        onChange={(e) => setBirthdate(e.target.value)}
        required
      />
      <InputField
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <InputField
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />
      <SubmitButton type="submit">Register</SubmitButton>
    </form>
  );
}

export default RegisterForm;
