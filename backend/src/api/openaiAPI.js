import { Configuration, OpenAIApi } from "openai";
import dotenv from "dotenv";

dotenv.config();

const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);

export async function generateResponseFromOpenAI(messages, userName) {
  try {
    let response = await openai.createChatCompletion({
      messages,
      model: process.env.OPENAI_API_MODEL,
      user: userName,
    });
    response = response.data.choices[0].message.content;
    console.log("OpenAI: response generated: ", response);
    return response;
  } catch (err) {
    console.error("OpenAI: error generating response", err);
    return "No response, try asking again";
  }
}
