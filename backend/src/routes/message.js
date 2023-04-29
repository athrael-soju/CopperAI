import express from "express";
import { Configuration, OpenAIApi } from "openai";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);

let messages = [];
let responseMessage;

export async function sendMessage(role, userName, message) {
  try {
    messages.push({ role: role, content: message });

    const response = await openai.createChatCompletion({
      messages,
      model: process.env.OPENAI_API_MODEL,
      user: userName,
    });

    const botMessage = response.data.choices[0].message;
    if (botMessage) {
      messages.push(botMessage);
      responseMessage = botMessage.content;
    } else {
      responseMessage = `No response, try asking again`;
    }
    return responseMessage;
  } catch (err) {
    console.log(`Error with Request: ${err}`);
  }
}

router.post("/", async (req, res) => {
  let role = "user";
  let responseMessage = await sendMessage(
    role,
    req.body.username,
    req.body.message
  );
  res.json({ message: responseMessage });
});

export default router;
