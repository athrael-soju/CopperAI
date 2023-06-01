import express from "express";
import pineconeAPI from "../api/pineconeAPI.js";
import openaiAPI from "../api/openaiAPI.js";
import Conversation from "../models/Conversation.js";
import langChainAPI from "../api/langChainAPI.js";

const router = express.Router();
export async function initDirective(username, directive, role) {
  await sendMessage(username, directive, role);
}

async function getSummarizedUserHistory(userName) {
  console.log("Backend - Retrieving User Message History...");
  try {
    let conversationHistory = await Conversation.find({ username: userName })
      .sort({ date: -1 })
      .limit(10)
      .exec();
    const retrievedHistoryRecords = conversationHistory?.length;
    console.log(
      `Backend - User Message History retrieved: {${retrievedHistoryRecords}} records: \n${conversationHistory}\n`
    );
    if (retrievedHistoryRecords && retrievedHistoryRecords > 0) {
      let messageNumber = retrievedHistoryRecords;
      console.log(`Backend - Simplifying Conversation History...`);
      let simplifiedHistory = conversationHistory
        .map(
          (conversation) => `
        prompt ${messageNumber--}: '${conversation.message}'
        response: '${conversation.response}'
        date: ${conversation.date}
        `
        )
        .join("\n");
      console.log(
        `Backend - Conversation History Simplified: ${simplifiedHistory}`
      );
      let summarizedHistory = await langChainAPI.summarizeConversation(
        simplifiedHistory
      );
      return summarizedHistory;
    } else {
      console.log(`Backend - No Conversation History`);
      return "No Conversation History";
    }
  } catch (err) {
    console.error(
      `Backend - Failed to Retrieve User Message History: \n${err.message}\n`
    );
    return null;
  }
}

async function sendMessage(userName, message, role = "user") {
  console.log(`Backend - Preparing to Send Message: \n${message}\n`);
  try {
    let summarizedHistory = await getSummarizedUserHistory(userName);
    let openaiResponse = null;
    let messages = [];
    let pineconeResponse = "";
    if (process.env.PINECONE_ENABLED === "true") {
      console.log(`Backend - Pinecone enabled. Retrieving Conversation...`);
      pineconeResponse = await pineconeAPI.getConversationFromPinecone(
        userName,
        message,
        summarizedHistory,
        process.env.PINECONE_TOPK
      );
      const enhancedResponse = `Use the following summary of our past discussion as your knowledgebase: ${pineconeResponse}`;
      if (pineconeResponse) {
        messages.push({ role: "system", content: enhancedResponse });
      }
    }
    if (process.env.OPENAI_ENABLED === "true") {
      messages.push({
        role: role,
        content: message,
      });
      openaiResponse = await openaiAPI.generateResponseFromOpenAI(
        messages,
        userName
      );
    } else {
      openaiResponse = `Backend - OpenAI is currently disabled. Using default response: ${Math.random()}`;
    }

    if (openaiResponse) {
      const newConversation = new Conversation({
        username: userName,
        message: `${userName}: ${message}`,
        response: `AI: ${openaiResponse}`,
        date: new Date(),
      });
      await newConversation.save();

      console.log("Backend - Saved conversation to MongoDB");
    }

    summarizedHistory = await getSummarizedUserHistory(userName);

    if (process.env.PINECONE_ENABLED === "true") {
      await pineconeAPI.storeConversationToPinecone(
        userName,
        message,
        summarizedHistory
      );
    }

    return openaiResponse;
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
  const response = await sendMessage(userName, message, role);
  res.json({ message: response });
});

export default router;
