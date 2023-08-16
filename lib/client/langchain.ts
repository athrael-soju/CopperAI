import { OpenAI } from 'langchain/llms/openai';
import { LLMChain } from 'langchain/chains';
import { PromptTemplate } from 'langchain/prompts';
import logger from '../../lib/winstonConfig';

const MODEL_NAME = process.env.NEXT_PUBLIC_OPENAI_API_MODEL as string;
const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY as string;

if (!MODEL_NAME || !OPENAI_API_KEY) {
  logger.error('Invalid/Missing OpenAI environment variables');
  throw new Error('Invalid/Missing OpenAI environment variables');
}

const model = new OpenAI({
  temperature: 0.9,
  modelName: MODEL_NAME,
  openAIApiKey: OPENAI_API_KEY,
});

export function getPromptTemplate(
  template: string,
  inputVariables: string[]
): PromptTemplate {
  return new PromptTemplate({
    template,
    inputVariables: inputVariables,
  });
}

export function getChain(template: PromptTemplate): LLMChain<string, OpenAI> {
  return new LLMChain({
    llm: model,
    prompt: template,
  });
}

export async function getResult(
  llmChain: LLMChain<string, OpenAI>,
  template: PromptTemplate,
  input: string,
  history: string
): Promise<any> {
  try {
    return await llmChain.call({
      prompt: template,
      input,
      history,
    });
  } catch (error: any) {
    logger.error('Failed to get result from Langchain', {
      error: error.message,
    });
    throw error;
  }
}
