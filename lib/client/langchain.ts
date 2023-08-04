import { OpenAI } from 'langchain/llms/openai';
import { VectorStoreRetrieverMemory } from 'langchain/memory';
import { LLMChain } from 'langchain/chains';
import { PromptTemplate } from 'langchain/prompts';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { ConversationSummaryMemory } from 'langchain/memory';
import logger from '../../lib/winstonConfig';
const model = new OpenAI({
  temperature: 0.9,
  modelName: process.env.NEXT_PUBLIC_OPENAI_API_MODEL,
  openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export function getPromptTemplate(template: string, inputVariables: string[]) {
  return new PromptTemplate({
    template,
    inputVariables: inputVariables,
  });
}

export function getChain(template: PromptTemplate) {
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
) {
  return await llmChain.call({
    prompt: template,
    input,
    history,
  });
}
