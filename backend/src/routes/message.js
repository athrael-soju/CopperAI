import express from "express";
import {
  getConversationFromPinecone,
  storeConversationToPinecone,
} from "../api/pineconeAPI.js";
import { generateResponseFromOpenAI } from "../api/openaiAPI.js";

const router = express.Router();
export async function initDirective(role, username, directive) {
  await sendMessage(role, username, directive);
}

async function sendMessage(role = "user", userName, message) {
  try {
    console.log(`role: ${role}, userName: ${userName}: message: ${message}`);
    const shouldPineconeBeUsed =
      process.env.PINECONE_ENABLED === "true" && userName !== "guest";
    let pineconeResponse = null;
    if (shouldPineconeBeUsed) {
      pineconeResponse = await getConversationFromPinecone(
        message,
        process.env.PINECONE_TOPK
      );
    }
    if (!pineconeResponse) {
      const messages = [{ role: role, content: message }];
      const response = await generateResponseFromOpenAI(messages, userName);
      if (shouldPineconeBeUsed) {
        await storeConversationToPinecone(message, response);
      }
      return response;
    } else {
      return pineconeResponse;
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
