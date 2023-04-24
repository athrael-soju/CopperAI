import express from "express";
import { Configuration, OpenAIApi } from "openai";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);

let messages = [];
let responseMessage;

router.post("/", async (req, res) => {
  try {
    let userInput = req.body.message;
    messages.push({ role: "user", content: userInput });

    const response = await openai.createChatCompletion({
      messages,
      model: process.env.OPENAI_API_MODEL,
    });

    const botMessage = response.data.choices[0].message;
    if (botMessage) {
      messages.push(botMessage);
      responseMessage = botMessage.content;
    } else {
      responseMessage = `No response, try asking again`;
    }

    res.json({ message: responseMessage });
  } catch (err) {
    console.log(`Error with Request: ${err}`);
  }
});

export default router;
