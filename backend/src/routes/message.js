import express from "express";
import { Configuration, OpenAIApi } from "openai";
import dotenv from "dotenv";
import axios from "axios";
dotenv.config();

const router = express.Router();
const pineconeServiceUrl = `${process.env.PINECONE_ADDRESS}:${process.env.PINECONE_PORT}`;
const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);

let messages = [];
let queryMessage, messageResponse;

async function getConversation(message, topK = 5) {
  console.log("Getting conversation for message:", `'${message}'`);
  const response = await axios.post(`${pineconeServiceUrl}/query`, {
    message: message,
    topK: topK,
  });
  console.log("Conversation response:", response.data);
  if (
    response.data.matches.length === 0 ||
    response.data.matches[0]["score"] < 0.95
  ) {
    console.log("No conversation found");
    return null;
  }
  console.log("Conversation found:", response.data.matches[0]);
  return response.data.matches[0]["metadata"]["messageResponse"];
}

async function storeConversation(message, messageResponse) {
  console.log("Storing conversation for message:", message);
  await axios.post(`${pineconeServiceUrl}/upsert`, {
    message,
    messageResponse,
  });
  console.log("Conversation stored");
}

export async function initDirective(role, username, directive) {
  const directiveResponse = await sendMessage(role, username, directive);
  console.log("Directive message sent:", directive);
  if (directiveResponse) {
    console.log("Directive response received: ", directiveResponse);
  } else {
    console.log("No response, try asking again");
  }
}

async function sendMessage(role = "user", userName, message) {
  try {
    console.log("Sending message:", message);
    if (process.env.PINECONE_ENABLED === "true") {
      queryMessage = await getConversation(message, 1);
    }
    if (!queryMessage) {
      messages = [];
      messages.push({ role: role, content: message });

      const response = await openai.createChatCompletion({
        messages,
        model: process.env.OPENAI_API_MODEL,
        user: userName,
      });
      console.log("OpenAI response:", response.data);
      messageResponse = response.data.choices[0].message;
      if (messageResponse) {
        console.log("OpenAI response:", messageResponse);
        messages.push(messageResponse);
        messageResponse = messageResponse.content;
      } else {
        console.log("No response, try asking again");
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

router.post("/", async (req, res) => {
  let role = "user";
  let response = await sendMessage(role, req.body.username, req.body.message);
  res.json({ message: response });
});

export default router;
