import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'openai';
import { createServiceLogger } from '@/lib/winstonConfig';
const serviceLogger = createServiceLogger('lib/openAI.ts');

const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
  serviceLogger.error(
    'OPENAI_API_KEY is not defined in environment variables.'
  );
  throw new Error('OPENAI_API_KEY is required.');
}

const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function createChatCompletion(
  messages: ChatCompletionRequestMessage[],
  user: string
): Promise<any> {
  try {
    const MODEL = process.env.NEXT_PUBLIC_OPENAI_API_MODEL;
    if (!MODEL) {
      serviceLogger.error(
        'OPENAI_MODEL is not defined in environment variables.'
      );
      throw new Error('OPENAI_MODEL is required.');
    }

    const response = await openai.createChatCompletion({
      messages,
      model: MODEL,
      user: user,
    });

    serviceLogger.info('OpenAI chat completion successful', {
      user: user,
      messages: messages.length,
    });
    return response;
  } catch (error: any) {
    serviceLogger.error('OpenAI chat completion failed', {
      user: user,
      messages: messages.length,
      error: error.message,
    });
    throw error;
  }
}

export async function createEmbedding(message: string): Promise<any> {
  console.time('time: createEmbedding');
  try {
    const response = await openai.createEmbedding({
      input: message,
      model: 'text-embedding-ada-002',
    });
    serviceLogger.info('OpenAI embedding creation successful', {
      message: message.length,
    });
    console.timeEnd('time: createEmbedding');
    return response.data.data[0].embedding;
  } catch (error: any) {
    serviceLogger.error('OpenAI embedding creation failed', {
      message: message,
      error: error.message,
    });
    throw error;
  }
}
