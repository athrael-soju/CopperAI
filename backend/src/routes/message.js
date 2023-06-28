import express from "express";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
dotenv.config();

import pineconeAPI from "../api/pineconeAPI.js";
import openaiAPI from "../api/openaiAPI.js";
import Conversation from "../models/Conversation.js";
import langChainAPI from "../api/langChainAPI.js";
import { templates } from "../templates/templates.js";

const router = express.Router();
async function getUserConversationHistory(pineconeResponse) {
  console.log("Backend - Retrieving User Message History...");
  let conversationHistory = "";
  // Retrieve Conversation History from MongoDB, from Pinecone response
  try {
    await Promise.all(
      pineconeResponse.map(async (conversation) => {
        const conversationTurn = await Conversation.findOne({
          id: conversation.id,
        }).exec();
        conversationHistory += `${conversationTurn.message}. ${conversationTurn.response}. ${conversationTurn.date}\n`;
      })
    );

    console.log(
      `Backend - User Message History Retrieved: \n${conversationHistory}`
    );
  } catch (err) {
    console.error(
      `Backend - Failed to Retrieve User Message History: \n${err.message}`
    );
  }
  return conversationHistory;
}

async function sendMessage(userName, userDomain, message, role = "user") {
  console.log(`Backend - Preparing to Send Message: \n${message}`);
  try {
    let messages = [],
      openaiResponse,
      pineconeResponse,
      newConversation,
      userConversationHistory = "";

    pineconeResponse = await pineconeAPI.getConversationFromPinecone(
      userName,
      userDomain,
      message,
      process.env.PINECONE_TOPK
    );
    // If a conversation is found in Pinecone, retrieve the conversation history from MongoDB
    if (pineconeResponse?.length > 0) {
      userConversationHistory = await getUserConversationHistory(
        pineconeResponse
      );
    }
    if (process.env.LANGCHAIN_ENABLED) {
      //  Summarize the conversation history using Langchain
      userConversationHistory = await langChainAPI.summarizeConversation(
        message,
        userConversationHistory,
        userDomain
      );
      // Adjust the AI response
      messages.push({
        role: "system",
        content: templates.generic.response,
      });
    }

    // Add the summarized history to the messages array.
    messages.push({
      role: "system",
      content: userConversationHistory,
    });

    // Add the user message to the messages array.
    messages.push({
      role: role,
      content: message,
    });

    // Generate a response from OpenAI
    openaiResponse = await openaiAPI.generateResponseFromOpenAI(
      messages,
      userName
    );

    /*
     * If the memory type is dynamic, save the conversation to MongoDB and Pinecone (More suitable for conversation).
     * If the memory type is static, only store the conversation to Pinecone (More suitable for Q&A).
     */
    if (process.env.MEMORY_TYPE === "dynamic") {
      // Save the conversation to MongoDB
      const id = uuidv4();
      newConversation = new Conversation({
        id: id,
        username: userName,
        userdomain: userDomain,
        message: `${userName} prompt: ${message}`,
        response: `AI response: ${openaiResponse}`,
        date: `Date: ${new Date()}`,
      });
      await newConversation.save();
      console.log("Backend - Saved conversation to MongoDB");
      // Store the conversation to Pinecone
      await pineconeAPI.storeConversationToPinecone(newConversation);
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
    userDomain = req.body.userdomain,
    message = req.body.message;

  const response = await sendMessage(userName, userDomain, message, role);
  res.json({ message: response });
});

export default router;
