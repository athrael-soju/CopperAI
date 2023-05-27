import express from "express";
import pineconeAPI from "../api/pineconeAPI.js";
import openaiAPI from "../api/openaiAPI.js";
import Conversation from "../models/Conversation.js";
import langChainAPI from "../api/langChainAPI.js";

const router = express.Router();
export async function initDirective(role, username, directive) {
  await sendMessage(role, username, directive);
}

async function sendMessage(role = "user", userName, message) {
  console.log(`Sending message: ${message}`);
  try {
    const shouldPineconeBeUsed = process.env.PINECONE_ENABLED === "true";
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
  let role = "user",
    userName = req.body.username,
    message = req.body.message;

  const conversationHistory = await Conversation.find({ username: userName })
    .sort({ date: -1 })
    .limit(10)
    .exec();

  const simplifiedHistory = conversationHistory
    .map(
      (conversation) =>
        `message: ${conversation.message}\n
        response: ${conversation.response}\n
        date: ${conversation.date}\n
        ----------------------------------`
    )
    .join("\n");

  console.log("simplifiedHistory", simplifiedHistory);

  // Summarize the simplifiedHistory using LangChain
  let summarizedHistory = await langChainAPI.summarizeConversation(
    simplifiedHistory
  );

  if (process.env.PINECONE_ENABLED === "true") {
    await pineconeAPI.storeConversationToPinecone(message, summarizedHistory);
  }

  let response = await sendMessage(role, userName, message);
  if (response) {
    const newConversation = new Conversation({
      username: userName,
      message: message,
      response: response,
      date: new Date(),
    });
    await newConversation.save();
    console.log("Saved conversation to MongoDB");
  }

  res.json({ message: response });
});

export default router;
