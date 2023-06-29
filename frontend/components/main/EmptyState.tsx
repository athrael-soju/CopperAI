import React from 'react';
import { useSession } from 'next-auth/react';
import { Typography } from 'antd';

const { Title } = Typography;

function WelcomeMessage() {
  const session = useSession();

  if (session.status === 'authenticated') {
    return;
  }

  return (
    <div
      className="welcome-message"
      style={{
        display: 'flex',
        alignContent: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        // height: "calc(100vh - 64px)", // minus navbar height which is 64px
        textAlign: 'center',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        margin: 'auto',
        width: '600px',
        height: '200px',
        zIndex: 100,
      }}
    >
      <div
        style={{
          margin: 'auto',
        }}
      >
        <Title
          style={{
            color: 'white',
          }}
        >
          Welcome to WhisperChat AI
        </Title>
        <Title
          level={3}
          style={{
            color: 'white',
          }}
        >
          Amplify possibilities with voice
        </Title>
        <Title
          level={4}
          style={{
            color: 'white',
            marginBottom: '30px',
          }}
        >
          Please login or signup and turn on your volume
        </Title>
      </div>
    </div>
  );
}

export default WelcomeMessage;
