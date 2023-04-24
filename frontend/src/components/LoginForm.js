import React from "react";
import InputField from "./InputField";
import SubmitButton from "./SubmitButton";

function LoginForm({
  username,
  password,
  setUsername,
  setPassword,
  loginUser,
}) {
  return (
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
  );
}

export default LoginForm;
