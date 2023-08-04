import { OpenAI } from 'langchain/llms/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { ConversationalRetrievalQAChain, LLMChain } from 'langchain/chains';
import logger from '../lib/winstonConfig';
import templates from './templates';
import { BaseLanguageModel } from 'langchain/dist/base_language';
import { PromptTemplate } from 'langchain/prompts';
import {
  VectorStoreRetrieverMemory,
  BufferMemory,
  CombinedMemory,
} from 'langchain/memory';

export const getChain = (
  vectorstore: PineconeStore,
  returnSourceDocuments: boolean,
  modelTemperature: number,
  namespace: string
) => {
  const topK = Number(process.env.NEXT_PUBLIC_PINECONE_TOPK) || 5;
  const openAIApiModelName = process.env.NEXT_PUBLIC_OPENAI_API_MODEL;
  const openAIapiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY as string;

  const model = new OpenAI({
    temperature: modelTemperature,
    modelName: openAIApiModelName,
    openAIApiKey: openAIapiKey,
  });

  let chain =
    namespace === 'general'
      ? getGeneralChain(model, vectorstore, topK)
      : getDocumentChain(model, vectorstore, topK, returnSourceDocuments);
  return chain;
};

const getGeneralChain = (
  model: OpenAI | BaseLanguageModel,
  vectorstore: PineconeStore,
  topK: number
) => {
  const vectorMemory = new VectorStoreRetrieverMemory({
    vectorStoreRetriever: vectorstore.asRetriever(topK),
    memoryKey: 'chat_history',
  });

  const prompt = PromptTemplate.fromTemplate(templates.general.general_prompt);
  const chain = new LLMChain({ llm: model, prompt, memory: vectorMemory });
  return chain;
};

const getDocumentChain = (
  model: OpenAI | BaseLanguageModel,
  vectorstore: PineconeStore,
  topK: number,
  returnSourceDocuments: boolean
) => {
  const vectorMemory = new VectorStoreRetrieverMemory({
    vectorStoreRetriever: vectorstore.asRetriever(topK),
    memoryKey: 'chat_history',
  });

  const chain = ConversationalRetrievalQAChain.fromLLM(
    model,
    vectorstore.asRetriever(topK),
    {
      memory: vectorMemory,
      questionGeneratorChainOptions: {
        template: templates.document_qa.qa_prompt,
      },
      qaTemplate: templates.document_qa.rephrase_prompt,
      returnSourceDocuments,
    }
  );
  return chain;
};
