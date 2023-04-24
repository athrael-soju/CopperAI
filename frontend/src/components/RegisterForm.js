import React from "react";
import InputField from "./InputField";
import SubmitButton from "./SubmitButton";

function RegisterForm({
  username,
  password,
  setUsername,
  setPassword,
  registerUser,
}) {
  return (
    <form onSubmit={registerUser}>
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
      <SubmitButton type="submit">Register</SubmitButton>
    </form>
  );
}

export default RegisterForm;
