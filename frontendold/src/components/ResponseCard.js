import React from "react";
import ChatResponse from "./ChatResponse";

const ResponseCard = ({ response }) => {
  return <ChatResponse response={response} />;
};

export default React.memo(ResponseCard);
