import express from "express";
import { getConversation, storeConversation } from "../api/pineconeAPI.js";
import { generateResponse } from "../api/openaiAPI.js";

const router = express.Router();

export async function initDirective(role, username, directive) {
  await sendMessage(role, username, directive);
}

async function sendMessage(role = "user", userName, message) {
  try {
    let queryMessage, messageResponse;
    if (process.env.PINECONE_ENABLED === "true") {
      queryMessage = await getConversation(message, 1);
    }
    if (!queryMessage) {
      const messages = [{ role: role, content: message }];
      const response = await generateResponse(messages, userName);
      messageResponse = response.data.choices[0].message;

      if (messageResponse) {
        messageResponse = messageResponse.content;
      } else {
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

router.get("/", (req, res) => {
  res
    .status(200)
    .send(
      `You've reached the /message server route, running on port ${process.env.SERVER_PORT}`
    );
});

router.post("/", async (req, res) => {
  let role = "user";
  let response = await sendMessage(role, req.body.username, req.body.message);
  res.json({ message: response });
});

export default router;
