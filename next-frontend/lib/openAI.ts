import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'openai';

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
  console.log(`OpenAI - Creating Embedding for Message: \n${message}`);
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
    console.log(`OpenAI - No Embedding Found`);
    return null;
  }
  console.log(`OpenAI - Embedded Message`);
  return response.data.data[0].embedding;
};
