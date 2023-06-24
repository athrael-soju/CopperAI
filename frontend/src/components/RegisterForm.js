import React, { useState } from "react";
import { Form, Input, Button, Typography } from "antd";
import env from "react-dotenv";

const { Text } = Typography;

const RegisterForm = ({ setUser }) => {
  const [error, setError] = useState("");

  const onFinish = async (values) => {
    const { username, usertype, password, email, birthdate, confirmPassword } =
      values;

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
            usertype,
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
    <Form onFinish={onFinish}>
      {error && <Text type="danger">{error}</Text>}
      <Form.Item
        name="username"
        rules={[{ required: true, message: "Please enter your username" }]}
      >
        <Input placeholder="Username" />
      </Form.Item>
      <Form.Item
        name="usertype"
        rules={[{ required: true, message: "Please enter your usertype" }]}
      >
        <Input placeholder="Usertype" />
      </Form.Item>
      <Form.Item
        name="email"
        rules={[
          { required: true, message: "Please enter your email" },
          { type: "email", message: "Please enter a valid email" },
        ]}
      >
        <Input placeholder="Email" />
      </Form.Item>
      <Form.Item
        name="birthdate"
        rules={[{ required: true, message: "Please enter your birthdate" }]}
      >
        <Input type="date" placeholder="Birthdate" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: "Please enter your password" }]}
      >
        <Input.Password placeholder="Password" />
      </Form.Item>
      <Form.Item
        name="confirmPassword"
        rules={[
          { required: true, message: "Please confirm your password" },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }
              return Promise.reject("Passwords do not match");
            },
          }),
        ]}
      >
        <Input.Password placeholder="Confirm Password" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Register
        </Button>
      </Form.Item>
    </Form>
  );
};

export default RegisterForm;
