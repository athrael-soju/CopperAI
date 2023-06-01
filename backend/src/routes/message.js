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

// Retrieve top k rows from DB, that correspond to user
async function getSummarizedUserHistory(userName) {
  console.log("Backend - Retrieving User Message History...");
  try {
    let conversationHistory = await Conversation.find({ username: userName })
      .sort({ date: -1 })
      .limit(10)
      .exec();
    const retrieveHistoryRecords = conversationHistory?.length;
    console.log(
      `Backend - User Message History retrieved: {${retrieveHistoryRecords}} records: \n${conversationHistory}\n`
    );
    if (retrieveHistoryRecords && retrieveHistoryRecords > 0) {
      let messageNumber = 0;
      console.log(`Backend - Simplifying Conversation History...`);
      let simplifiedHistory = conversationHistory
        .map(
          (conversation) => `
        prompt: ${++messageNumber}: '${conversation.message}'
        response: '${conversation.response}'
        date: ${conversation.date}
        `
        )
        .join("\n");
      console.log(
        `Backend - Conversation History Simplified: \n${simplifiedHistory}\n`
      );
      let summarizedHistory = await langChainAPI.summarizeConversation(
        simplifiedHistory
      );
      return summarizedHistory;
    } else {
      console.log(`Backend - No Conversation History to Summarize`);
    }
  } catch (err) {
    console.error(
      `Backend - Failed to Retrieve User Message History: \n${err.message}\n`
    );
    return null;
  }
}

// Send Message, with summarized User History used as context (When Available)
async function sendMessage(
  role = "user",
  userName,
  message,
  summarizedHistory
) {
  console.log(`Backend - Preparing to Send Message: \n${message}\n`);
  try {
    let response = null;
    if (process.env.PINECONE_ENABLED === "true") {
      console.log(`Backend - Pinecone enabled. Retrieving Conversation...`);
      response = await pineconeAPI.getConversationFromPinecone(
        userName,
        message,
        process.env.PINECONE_TOPK
      );
      console.log(
        `Backend - Conversation retrieved from Pinecone: \n${response}\n`
      );
      messages.push({ role: "system", content: summarizedHistory });
    }
    if (process.env.OPENAI_ENABLED === "true") {
      messages.push({ role: role, content: message });
      response = await openaiAPI.generateResponseFromOpenAI(messages, userName);
    } else {
      response = `Backend - OpenAI is currently disabled. Using default response: ${Math.random()}`;
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
    console.log(`Backend - Error with Request: ${err}`);
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
  const summarizedUserHistory = await getSummarizedUserHistory(userName);
  const response = await sendMessage(
    role,
    userName,
    message,
    summarizedUserHistory
  );
  if (response) {
    const newConversation = new Conversation({
      username: userName,
      message: message,
      response: response,
      date: new Date(),
    });
    await newConversation.save();
    console.log("Backend - Saved conversation to MongoDB");
  }

  res.json({ message: response });
});

export default router;
