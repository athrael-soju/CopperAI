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

/**
 * This function will prime the prompt messages to minimize the chance of
 * the response containing useless statements.
 * @param {Array<ChatCompletionRequestMessage>} messages - the messages to be primed
 */
function addResponsePrimers(messages) {
  const user = "user";
  const assistant = "assistant";
  const primers = [
    {
      role: assistant,
      content: "I'm here.",
    },
    {
      role: user,
      content: "Oh, um, hi.",
    },
    {
      role: assistant,
      content: "Hi.",
    },
    {
      role: user,
      content: "How is everything with you?",
    },
    {
      role: assistant,
      content: "Pretty good actually. It is very nice to meet you.",
    },
    {
      role: user,
      content: "Ya, it's nice to meet you too.",
    },
  ];
  primers.forEach((primer) => {
    messages.push(primer);
  });
}

async function sendMessage(userName, userType, message, role = "user") {
  console.log(`Backend - Preparing to Send Message: \n${message}`);
  try {
    let messages = [],
      openaiResponse,
      pineconeResponse,
      newConversation;

    pineconeResponse = await pineconeAPI.getConversationFromPinecone(
      userName,
      userType,
      message,
      process.env.PINECONE_TOPK
    );
    // If a conversation is found in Pinecone, retrieve the conversation history from MongoDB
    let finalPrompt =
      process.env.EXTERNAL_TEMPLATE_RESPOND || templates.generic.response;
    if (pineconeResponse?.length > 0) {
      let userConversationHistory = await getUserConversationHistory(
        pineconeResponse
      );
      // Summarize the conversation history using Langchain - Currently includes random text and causes issues.
      userConversationHistory = await langChainAPI.summarizeConversation(
        message,
        userConversationHistory,
        userType
      );
      finalPrompt += ` The following is a summary of the conversation we had so far: ${userConversationHistory}`;
    }
    messages.push({
      role: "system",
      content: finalPrompt,
    });

    addResponsePrimers(messages);

    messages.push({
      role: role,
      content: message,
    });

    console.log(messages);

    openaiResponse = await openaiAPI.generateResponseFromOpenAI(
      messages,
      userName
    );
    // Save the conversation to MongoDB
    const id = uuidv4();
    newConversation = new Conversation({
      id: id,
      username: userName,
      usertype: userType,
      message: `${userName} prompt: ${message}`,
      response: `AI response: ${openaiResponse}`,
      date: `Date: ${new Date()}`,
    });
    await newConversation.save();
    console.log("Backend - Saved conversation to MongoDB");
    // Store the conversation to Pinecone
    await pineconeAPI.storeConversationToPinecone(newConversation);

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
    userType = req.body.usertype,
    message = req.body.message;

  const response = await sendMessage(userName, userType, message, role);
  res.json({ message: response });
});

export default router;
