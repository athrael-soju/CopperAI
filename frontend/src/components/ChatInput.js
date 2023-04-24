import React from "react";
import { Button, Card, Form, InputGroup } from "react-bootstrap";

const ChatInput = ({
  message,
  setMessage,
  sendMessage,
  transcribing,
  playResponse,
  stopOngoingAudio,
}) => {
  const handleListenToAudio = () => {
    stopOngoingAudio();
    playResponse();
  };

  return (
    <Card>
      <Card.Body>
        <Form>
          <InputGroup>
            <Button onClick={sendMessage} variant="outline-success">
              Send Message
            </Button>
            <Button onClick={handleListenToAudio} variant="outline-light">
              Listen
            </Button>
          </InputGroup>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default ChatInput;
