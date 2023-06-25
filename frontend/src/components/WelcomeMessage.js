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
          Welcome to whisperChat
        </Title>
        <Paragraph
          style={{
            color: blue?.[8],
          }}
        >
          This is a voice-enabled chat application. Please log in or register to
          start using it.
        </Paragraph>
      </div>
    </div>
  );
}

export default WelcomeMessage;
