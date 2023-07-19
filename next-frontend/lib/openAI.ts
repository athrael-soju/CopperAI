import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'openai';
import logger from '../lib/winstonConfig';

const configuration = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
const OPENAI_API_MODEL = process.env.NEXT_PUBLIC_OPENAI_API_MODEL;
export const createChatCompletion = async (
  messages: ChatCompletionRequestMessage[],
  user: string
) => {
  return await openai.createChatCompletion({
    messages,
    model: OPENAI_API_MODEL as string,
    user: user,
  });
};

export const createEmbedding = async (message: string) => {
  logger.info(`Creating Embedding for Message: \n${message}`);
  const response = await openai.createEmbedding({
    input: message,
    model: 'text-embedding-ada-002',
  });
  if (
    !response.data ||
    !response.data.data ||
    response.data.data.length === 0 ||
    !response.data.data[0].embedding
  ) {
    logger.info(`OpenAI - No Embedding Found`);
    return null;
  }
  logger.info(`OpenAI - Embedded Message`);
  return response.data.data[0].embedding;
};
