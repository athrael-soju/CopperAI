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
        height: "calc(100vh - 64px)", // minus navbar height which is 64px
        textAlign: "center",
      }}
    >
      <div
        style={{
          background: "rgba(255, 255, 255, 0.7)",
          padding: 20,
          borderRadius: 10,
          maxWidth: 500,
          margin: "auto",
        }}
      >
        <Title
          style={{
            color: blue?.[8],
          }}
        >
          Welcome to WhisperChat AI
        </Title>
        <Title level={3}>Amplify possibilities with voice</Title>
        <Title level={4}>Please login or signup and turn on your volume</Title>
      </div>
    </div>
  );
}

export default WelcomeMessage;
