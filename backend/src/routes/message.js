import express from "express";
import pineconeAPI from "../api/pineconeAPI.js";
import openaiAPI from "../api/openaiAPI.js";
import Conversation from "../models/Conversation.js";
import langChainAPI from "../api/langChainAPI.js";

const router = express.Router();

export async function initDirective(username, directive, role) {
  await sendMessage(username, directive, role);
}

async function getUserConversationHistory(userName, numRows = 3) {
  console.log("Backend - Retrieving User Message History...");
  try {
    let conversationHistory = await Conversation.find({ username: userName })
      .sort({ date: -1 })
      .limit(numRows)
      .exec();
    const retrievedHistoryRecords = conversationHistory?.length;
    console.log(
      `Backend - User Message History retrieved: {${retrievedHistoryRecords}} records`
    );
    if (!retrievedHistoryRecords || retrievedHistoryRecords < 1) {
      conversationHistory = [];
    }

    let simplifiedHistory = conversationHistory
      .map(
        (conversation) => `
        prompt: ${conversation.message}'
        response: '${conversation.response}'
        date: ${conversation.date}
        `
      )
      .join("\n");

    return simplifiedHistory;
  } catch (err) {
    console.error(
      `Backend - Failed to Retrieve User Message History: \n${err.message}`
    );
    return null;
  }
}

async function sendMessage(userName, message, role = "user") {
  console.log(`Backend - Preparing to Send Message: \n${message}`);
  try {
    let simplifiedHistory = await getUserConversationHistory(userName);
    let openaiResponse = null;
    let messages = [];
    let pineconeResponse = "";
    let summarizedHistory = "";
    let newConversation = "";
    if (process.env.PINECONE_ENABLED === "true") {
      console.log(`Backend - Pinecone enabled. Retrieving Conversation...`);
      pineconeResponse = await pineconeAPI.getConversationFromPinecone(
        userName,
        message,
        simplifiedHistory,
        process.env.PINECONE_TOPK
      );

      if (pineconeResponse?.length > 0) {
        summarizedHistory = await langChainAPI.summarizeConversation(
          message,
          pineconeResponse
        );

        messages.push({
          role: "system",
          content: summarizedHistory,
        });
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
      newConversation = new Conversation({
        username: userName,
        message: `${userName}: ${message}`,
        response: `AI: ${openaiResponse}`,
        date: new Date(),
      });
      await newConversation.save();

      console.log("Backend - Saved conversation to MongoDB");
    }

    if (process.env.PINECONE_ENABLED === "true") {
      simplifiedHistory = await getUserConversationHistory(userName);
      console.log(
        "Backend - Storing conversation to Pinecone..." + simplifiedHistory
      );
      await pineconeAPI.storeConversationToPinecone(
        userName,
        simplifiedHistory
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
