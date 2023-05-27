import dotenv from "dotenv";
import { LLMChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { templates } from "../templates/templates.js";

dotenv.config();

const llm = new OpenAI({ apiKey: process.env.OPEN_AI_KEY });

// Chunking function
const chunkSubstr = (str, size) => {
  const numChunks = Math.ceil(str.length / size);
  const chunks = new Array(numChunks);

  for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
    chunks[i] = str.substr(o, size);
  }

  return chunks;
};

/* 
  Description: This function will summarize a conversation.
  Parameters: conversationHistory: string
  Returns: summarizedConversation: string  
*/
const langChainAPI = {
  async summarizeConversation(conversationHistory) {
    console.log("LangChain: summarizing conversation:", conversationHistory);
    try {
      const promptTemplate = new PromptTemplate({
        template: templates.summarizer,
        inputVariables: ["message", "history"],
      });
      
      console.log("LangChain: prompt template:", promptTemplate);
      const chain = new LLMChain({
        llm,
        prompt: promptTemplate,
      });
      console.log("LangChain: chain:", chain);
      if (conversationHistory.length > 4000) {
        console.log("LangChain: conversation too long, chunking");
        const chunks = chunkSubstr(conversationHistory, 4000);
        let summarizedChunks = [];

        for (const chunk of chunks) {
          const result = await chain.call({
            message: promptTemplate,
            history: chunk,
          });
          summarizedChunks.push(result.text);
        }

        const finalSummary = summarizedChunks.join("\n");
        return finalSummary;
      } else {
        console.log("LangChain: conversation short enough, not chunking");
        const result = await chain.call({
          message: promptTemplate,
          history: conversationHistory,
        });
        console.log("LangChain: summarized conversation:", result.text);
        return result.text;
      }
    } catch (err) {
      console.log(`Error with Request: ${err}`);
      return `Error with Request: ${err}`;
    }
  },
};

export default langChainAPI;
