import dotenv from "dotenv";
import { LLMChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { templates } from "../templates/templates.js";

dotenv.config();

const llm = new OpenAI({
  concurrency: 10,
  temperature: 0,
  modelName: process.env.OPENAI_API_MODEL,
});

// Chunking function
const chunkSubstr = (str, size) => {
  const numChunks = Math.ceil(str.length / size);
  const chunks = new Array(numChunks);

  for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
    chunks[i] = str.substr(o, size);
  }

  return chunks;
};

const langChainAPI = {
  async summarizeConversation(conversationHistory) {
    console.log(`LangChain - Summarizing Conversation...`);
    try {
      const template = templates.summarize;
      const prompt = new PromptTemplate({
        template,
        inputVariables: ["history"],
      });

      const formattedHistory = await prompt.format({
        history: conversationHistory,
      });

      const chain = new LLMChain({
        llm,
        prompt: prompt,
      });
      console.log("LangChain - LLM Chain created");

      if (formattedHistory.length > 4000) {
        console.log(`LangChain -  Conversation too long, Chunking`);
        const chunks = chunkSubstr(formattedHistory, 4000);
        let summarizedChunks = [];

        for (const chunk of chunks) {
          const result = await chain.call({
            history: chunk,
          });
          summarizedChunks.push(result.text);
        }

        const chunkedSummary = summarizedChunks.join("\n");
        return chunkedSummary;
      } else {
        console.log(`LangChain - Conversation short enough, Not Chunking...`);
        const result = await chain.call({
          history: formattedHistory,
        });
        console.log(`LangChain - Summarized Conversation: \n${result.text}\n`);
        return result.text;
      }
    } catch (err) {
      console.error(`LangChain - Error with Request: ${err}`);
      return `LangChain - Error with Request: ${err}`;
    }
  },
};

export default langChainAPI;
