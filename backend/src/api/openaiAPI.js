import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);

const openaiAPI = {
  async generateResponseFromOpenAI(messages, userName) {
    console.log(`OpenAI - Sending messages: \n${JSON.stringify(messages)}`);
    try {
      let response = await openai.createChatCompletion({
        messages,
        model: process.env.OPENAI_API_MODEL,
        user: userName,
      });
      response = response.data.choices[0].message.content;
      console.log(`OpenAI - response generated: \n${response}`);
      return response;
    } catch (err) {
      console.error(
        `OpenAI - Error Generating Response. Status: ${err.response.status}. Error: ${err.response.statusText}`
      );
      return `OpenAI - Rrror Generating Response. Status: ${err.response.status}. Error: ${err.response.statusText}`;
    }
  },
};

export default openaiAPI;
