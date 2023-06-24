import React, { useState } from "react";
import env from "react-dotenv";
import { Button, Form, Input, Typography } from "antd";

const { Text } = Typography;

const Login = ({ setUser }) => {
  const [error, setError] = useState("");

  const onFinish = async (values) => {
    const { username, password } = values;
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
      setError("Invalid credentials");
    }
  };

  return (
    <div>
      <Form onFinish={onFinish}>
        {error && <Text type="danger">{error}</Text>}
        <Form.Item
          name="username"
          rules={[{ required: true, message: "Please enter your username" }]}
        >
          <Input placeholder="Username" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please enter your password" }]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
