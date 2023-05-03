import express from "express";
import { getConversation, storeConversation } from "../api/pineconeAPI.js";
import { generateResponse } from "../api/openaiAPI.js";

const router = express.Router();

export async function initDirective(role, username, directive) {
  const directiveResponse = await sendMessage(role, username, directive);
  console.log("Directive message sent:", directive);
  if (directiveResponse) {
    console.log("Directive response received: ", directiveResponse);
  } else {
    console.log("No response, try asking again");
  }
}

async function sendMessage(role = "user", userName, message) {
  try {
    let queryMessage, messageResponse;
    console.log("Sending message:", message);
    if (process.env.PINECONE_ENABLED === "true") {
      queryMessage = await getConversation(message, 1);
    }
    if (!queryMessage) {
      const messages = [{ role: role, content: message }];
      const response = await generateResponse(messages, userName);
      console.log("OpenAI response:", response.data);
      messageResponse = response.data.choices[0].message;

      if (messageResponse) {
        console.log("OpenAI response:", messageResponse);
        messageResponse = messageResponse.content;
      } else {
        console.log("No response, try asking again");
        messageResponse = `No response, try asking again`;
      }
      if (process.env.PINECONE_ENABLED === "true") {
        await storeConversation(message, messageResponse);
      }
      return messageResponse;
    } else {
      return queryMessage;
    }
  } catch (err) {
    console.log(`Error with Request: ${err}`);
  }
}

router.post("/", async (req, res) => {
  let role = "user";
  let response = await sendMessage(role, req.body.username, req.body.message);
  res.json({ message: response });
});

export default router;
