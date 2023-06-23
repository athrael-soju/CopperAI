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
  async summarizeConversation(message, conversationHistory, userType) {
    console.log(`LangChain - Summarizing Conversation, using Template: ${conversationHistory}`);
    try {
      const template =
        process.env.EXTERNAL_TEMPLATE_SUMMARIZE ||
        process.env.EXTERNAL_TEMPLATE_EXPLAIN ||
        templates.generic.summarization;
      console.log(`LangChain - Using Template: ${template}`);
      const prompt = new PromptTemplate({
        template,
        inputVariables: ["prompt", "history", "usertype"],
      });

      const formattedHistory = await prompt.format({
        prompt: message,
        history: conversationHistory,
        usertype: userType,
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
