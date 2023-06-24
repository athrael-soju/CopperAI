import React from "react";
import { Typography } from "antd";
import { blue } from "@ant-design/colors";

const { Paragraph, Title } = Typography;

function WelcomeMessage() {
  return (
    <div
      style={{
        display: "flex",
        alignContent: "center",
        justifyContent: "center",
        flexDirection: "column",
        padding: 50,
        height: "80vh",
        textAlign: "center",
      }}
    >
      <Title
        style={{
          color: blue?.[0],
        }}
      >
        Welcome to whisperChat
      </Title>
      <Paragraph
        style={{
          color: blue?.[0],
        }}
      >
        This is a voice-enabled chat application. Please log in or register to
        start using it.
      </Paragraph>
    </div>
  );
}

export default WelcomeMessage;
