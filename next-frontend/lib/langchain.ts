import { LLMChain } from 'langchain/chains';
import { OpenAI } from 'langchain/llms/openai';
import { PromptTemplate } from 'langchain/prompts';

import logger from '../lib/winstonConfig';
import { templates } from './templates';

const llm = new OpenAI({
  concurrency: 10,
  temperature: 2,
  modelName: process.env.NEXT_PUBLIC_OPENAI_API_MODEL,
  openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});
export const summarizeConversation = async (
  message: string,
  conversationHistory: string
) => {
  logger.info(`Summarizing ConversationHistory...`);
  try {
    const template = templates.generic.summarization;
    logger.info(`Using Template: ${template}`);
    const prompt = new PromptTemplate({
      template,
      inputVariables: ['prompt', 'history'],
    });

    const formattedHistory = await prompt.format({
      prompt: message,
      history: conversationHistory,
    });
    logger.info(`Formatted History: ${formattedHistory}`);
    const chain = new LLMChain({
      llm,
      prompt: prompt,
    });
    logger.info('LLM Chain created');
    // TODO: Consider Introducing chunking to avoid OpenAI API limit
    const result = await chain.call({
      prompt: message,
      history: formattedHistory,
    });
    logger.info(`Summarized Conversation: ${result.text}`);
    return result.text;
  } catch (err) {
    logger.error(`Error with Request: ${err}`);
    return `Error with Request: ${err}`;
  }
};
