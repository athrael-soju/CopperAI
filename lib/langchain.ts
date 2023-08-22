import { OpenAI } from 'langchain/llms/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { ConversationalRetrievalQAChain, LLMChain } from 'langchain/chains';
import { createServiceLogger } from '@/lib/winstonConfig';
import templates from './templates';
import { BaseLanguageModel } from 'langchain/dist/base_language';
import { PromptTemplate } from 'langchain/prompts';
import { VectorStoreRetrieverMemory } from 'langchain/memory';

const serviceLogger = createServiceLogger('lib/langchain.ts');
export const getChain = (
  vectorstore: PineconeStore,
  returnSourceDocuments: boolean,
  modelTemperature: number,
  namespace: string
): any => {
  console.time('time: getChain');
  try {
    const topK = Number(process.env.NEXT_PUBLIC_PINECONE_TOPK) || 5;
    const openAIApiModelName = process.env.NEXT_PUBLIC_OPENAI_API_MODEL;
    const openAIapiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY as string;

    if (!openAIApiModelName || !openAIapiKey) {
      serviceLogger.error(
        'Environment variables for OpenAI are missing or not properly configured.'
      );
      throw new Error('OpenAI configuration is missing or incomplete.');
    }

    const model = new OpenAI({
      temperature: modelTemperature,
      modelName: openAIApiModelName,
      openAIApiKey: openAIapiKey,
    });

    serviceLogger.info('Successfully created OpenAI model', {
      modelName: openAIApiModelName,
    });

    let chain =
      namespace === 'general'
        ? getGeneralChain(model, vectorstore, topK)
        : getDocumentChain(model, vectorstore, topK, returnSourceDocuments);
    console.time('time: getChain');
    return chain;
  } catch (error: any) {
    serviceLogger.error('Failed to initialize chain', {
      error: error.message,
      namespace,
    });
    throw error;
  }
};

const getGeneralChain = (
  model: OpenAI | BaseLanguageModel,
  vectorstore: PineconeStore,
  topK: number
) => {
  console.time('time: getGeneralChain');
  console.log('Using general chain');
  const vectorMemory = new VectorStoreRetrieverMemory({
    vectorStoreRetriever: vectorstore.asRetriever(topK),
    memoryKey: 'chat_history',
  });

  const prompt = PromptTemplate.fromTemplate(templates.general.general_prompt);
  const chain = new LLMChain({ llm: model, prompt, memory: vectorMemory });
  console.time('time: getGeneralChain');
  return chain;
};

const getDocumentChain = (
  model: OpenAI | BaseLanguageModel,
  vectorstore: PineconeStore,
  topK: number,
  returnSourceDocuments: boolean
) => {
  console.log('Using document chain');
  const prompt = PromptTemplate.fromTemplate(templates.document_qa.qa_prompt);
  const chain = ConversationalRetrievalQAChain.fromLLM(
    model,
    vectorstore.asRetriever(topK),
    {
      qaTemplate: templates.document_qa.qa_prompt,
      questionGeneratorChainOptions: {
        template: templates.document_qa.rephrase_prompt,
      },
      returnSourceDocuments,
    }
  );
  console.time('time: getDocumentChain');
  return chain;
};
