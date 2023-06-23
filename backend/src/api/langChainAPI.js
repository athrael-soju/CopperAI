import { LLMChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { templates } from "../templates/templates.js";

const llm = new OpenAI({
  concurrency: 10,
  temperature: 0,
  modelName: process.env.OPENAI_API_MODEL,
});

const langChainAPI = {
  async summarizeConversation(message, conversationHistory, userType, level) {
    console.log(`LangChain - Summarizing Conversation: ${conversationHistory}`);
    try {
      const template = templates.generic.summarization;
      const prompt = new PromptTemplate({
        template,
        inputVariables: ["prompt", "history", "usertype", "level"],
      });

      const formattedHistory = await prompt.format({
        prompt: message,
        history: conversationHistory,
        usertype: userType,
        level: level,
      });
      const chain = new LLMChain({
        llm,
        prompt: prompt,
      });
      console.log("LangChain - LLM Chain created");
      // TODO: Consider Introducing chunking to avoid OpenAI API limit
      const result = await chain.call({
        prompt: message,
        history: formattedHistory,
        usertype: userType,
        level: level,
      });
      console.log(`LangChain - Summarized Conversation: ${result.text}`);
      return result.text;
    } catch (err) {
      console.error(`LangChain - Error with Request: ${err}`);
      return `LangChain - Error with Request: ${err}`;
    }
  },
};

export default langChainAPI;
