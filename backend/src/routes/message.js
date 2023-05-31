import express from "express";
import pineconeAPI from "../api/pineconeAPI.js";
import openaiAPI from "../api/openaiAPI.js";
import Conversation from "../models/Conversation.js";
import langChainAPI from "../api/langChainAPI.js";

const router = express.Router();
let messages = [];
export async function initDirective(role, username, directive) {
  await sendMessage(role, username, directive);
}

async function sendMessage(role = "user", userName, message) {
  console.log(`Sending message: ${message}`);
  try {
    let conversationHistory = null,
      summarizedHistory = null,
      simplifiedHistory = null,
      response = null;

    conversationHistory = await Conversation.find({ username: userName })
      .sort({ date: -1 })
      .limit(10)
      .exec();
    if (conversationHistory.length > 0) {
      let messageNumber = 0;
      simplifiedHistory = conversationHistory
        .map(
          (conversation) => `
  prompt: ${++messageNumber}: '${conversation.message}'
  response: '${conversation.response}'
  date: ${conversation.date}`
        )
        .join("\n");
      // summarizedHistory is sometimes null, which causes an error
      summarizedHistory = await langChainAPI.summarizeConversation(
        simplifiedHistory
      );
    }
    if (process.env.PINECONE_ENABLED === "true") {
      response = await pineconeAPI.getConversationFromPinecone(
        userName,
        message,
        process.env.PINECONE_TOPK
      );
      messages.push({ role: "system", content: summarizedHistory });
    }
    if (process.env.OPENAI_ENABLED === "true") {
      messages.push({ role: role, content: message });
      response = await openaiAPI.generateResponseFromOpenAI(messages, userName);
    } else {
      response = `OpenAI is currently disabled. Using default response: ${Math.random()}`;
    }

    if (process.env.PINECONE_ENABLED === "true") {
      await pineconeAPI.storeConversationToPinecone(
        userName,
        message,
        summarizedHistory
      );
    }
    return response;
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
  console.log("userName", userName);
  const response = await sendMessage(role, userName, message);
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
