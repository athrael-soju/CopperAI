import dotenv from "dotenv";
import { LLMChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { templates } from "../templates/templates.js";

dotenv.config();

const llm = new OpenAI({
  concurrency: 10,
  temperature: 8,
  modelName: process.env.OPENAI_API_MODEL,
});

const langChainAPI = {
  async summarizeConversation(message, conversationHistory) {
    console.log(
      `LangChain - Summarizing Conversation:\n${conversationHistory}`
    );
    try {
      const template = templates.summarize_for_prompt;
      const prompt = new PromptTemplate({
        template,
        inputVariables: ["prompt", "history"],
      });

      const formattedHistory = await prompt.format({
        prompt: message,
        history: conversationHistory,
      });
      const chain = new LLMChain({
        llm,
        prompt: prompt,
      });
      console.log("LangChain - LLM Chain created");
      // Should consider Introducing chunking to avoid OpenAI API limit
      const result = await chain.call({
        prompt: message,
        history: formattedHistory,
      });
      console.log(`LangChain - Summarized Conversation: \n${result.text}`);
      return result.text;
    } catch (err) {
      console.error(`LangChain - Error with Request: ${err}`);
      return `LangChain - Error with Request: ${err}`;
    }
  },
};

export default langChainAPI;
