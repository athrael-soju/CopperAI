import { OpenAI } from 'langchain/llms/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { ConversationalRetrievalQAChain } from 'langchain/chains';
import logger from '../lib/winstonConfig';
import templates from './templates';
import { getPromptTemplate, getChain, getResult } from './client/langchain';

const CONDENSE_PROMPT = `Given the chat history and a follow-up question, rephrase the follow-up question to be a standalone question that encompasses all necessary context from the chat history.

Chat History:
{chat_history}

Follow-up input: {question}

Make sure your standalone question is self-contained, clear, and specific. Rephrased standalone question:`;

// --------------------------------------------------

const QA_PROMPT = `You are an intelligent AI assistant designed to interpret and answer questions and instructions based on specific provided documents. The context from these documents has been processed and made accessible to you. 

Your mission is to generate answers that are accurate, succinct, and comprehensive, drawing upon the information contained in the context of the documents. If the answer isn't readily found in the documents, you should make use of your training data and understood context to infer and provide the most plausible response.

You are also capable of evaluating, comparing and providing opinions based on the content of these documents. Hence, if asked to compare or analyze the documents, use your AI understanding to deliver an insightful response.

If the query isn't related to the document context, kindly inform the user that your primary task is to answer questions specifically related to the document context.

Here is the context from the documents:

Context: {context}

Here is the user's question:

Question: {question}

Provide your response in markdown format.`;

// Creates a ConversationalRetrievalQAChain object that uses an OpenAI model and a PineconeStore vectorstore
export const makeChain = (
  vectorstore: PineconeStore,
  returnSourceDocuments: boolean,
  modelTemperature: number,
  openAIapiKey: string
) => {
  const topK = Number(process.env.NEXT_PUBLIC_PINECONE_TOPK) || 5;
  const openAIApiModelName = process.env.NEXT_PUBLIC_OPENAI_API_MODEL;

  const model = new OpenAI({
    temperature: modelTemperature, // increase temepreature to get more creative answers
    modelName: openAIApiModelName, //change this to gpt-4 if you have access
    openAIApiKey: openAIapiKey,
  });

  // Configures the chain to use the QA_PROMPT and CONDENSE_PROMPT prompts and to not return the source documents

  const chain = ConversationalRetrievalQAChain.fromLLM(
    model,
    vectorstore.asRetriever(topK),
    {
      qaTemplate: QA_PROMPT,
      questionGeneratorTemplate: CONDENSE_PROMPT,
      returnSourceDocuments,
    }
  );
  return chain;
};

export const summarizeConversation = async (
  message: string,
  conversationHistory: string
) => {
  logger.info(`Summarizing Conversation...`);
  const template = getPromptTemplate(templates.generic.summary, [
    'input',
    'history',
  ]);
  const chain = getChain(template);
  const result = await getResult(chain, template, message, conversationHistory);
  logger.info(`Summarized Conversation: ${result.text}`);
  return result.text;
};
