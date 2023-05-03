import { Configuration, OpenAIApi } from "openai";
import dotenv from "dotenv";

dotenv.config();

const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);

export async function generateResponse(messages, userName) {
  try {
    const response = await openai.createChatCompletion({
      messages,
      model: process.env.OPENAI_API_MODEL,
      user: userName,
    });
    return response;
  } catch (err) {
    console.error("Error generating response from OpenAI:", err);
    throw err;
  }
}
