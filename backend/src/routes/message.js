import express from "express";
import pineconeAPI from "../api/pineconeAPI.js";
import openaiAPI from "../api/openaiAPI.js";

const router = express.Router();
export async function initDirective(role, username, directive) {
  await sendMessage(role, username, directive);
}

async function sendMessage(role = "user", userName, message) {
  console.log(`Sending message: ${message}`);
  try {
    const shouldPineconeBeUsed =
      process.env.PINECONE_ENABLED === "true" && userName !== "guest";
    let pineconeResponse = null;
    if (shouldPineconeBeUsed) {
      pineconeResponse = await pineconeAPI.getConversationFromPinecone(
        message,
        process.env.PINECONE_TOPK
      );
    }
    if (!pineconeResponse) {
      const messages = [{ role: role, content: message }];
      const response = await openaiAPI.generateResponseFromOpenAI(
        messages,
        userName
      );
      if (shouldPineconeBeUsed) {
        await pineconeAPI.storeConversationToPinecone(message, response);
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
  res.status(200).json({
    message: `You've reached the /message server route, running on port ${process.env.SERVER_PORT}`,
  });
});

router.post("/", async (req, res) => {
  let role = "user";
  let response = await sendMessage(role, req.body.username, req.body.message);
  res.json({ message: response });
});

export default router;
