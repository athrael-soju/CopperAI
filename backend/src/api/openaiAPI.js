import { Configuration, OpenAIApi } from "openai";
import dotenv from "dotenv";

dotenv.config();

const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);

const openaiAPI = {
  async generateResponseFromOpenAI(messages, userName) {
    console.log(`OpenAI - Sending messages: \n${JSON.stringify(messages)}\n`);
    try {
      let response = await openai.createChatCompletion({
        messages,
        model: process.env.OPENAI_API_MODEL,
        user: userName,
      });
      response = response.data.choices[0].message.content;
      console.log(`OpenAI - response generated: \n${response}\n`);
      return response;
    } catch (err) {
      console.error(
        `OpenAI - error generating response: \nStatus: ${err.response.status}\nError: ${err.response.statusText}\n`
      );
      return `OpenAI - error generating response: \nStatus: ${err.response.status}\nError: ${err.response.statusText}\n`;
    }
  },
};

export default openaiAPI;
