import { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import { ChatCompletionRequestMessage } from 'openai';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import clientPromise from '@/lib/client/mobgodb';
import { makeChain } from '@/lib/langchain';
import { getIndex } from '@/lib/pinecone';

import logger from '../../../lib/winstonConfig';
import { createChatCompletion } from '../../../lib/openAI';
import {
  createConversationObject,
  insertConversationToMongoDB,
  getUserConversationHistory,
} from '../../../lib/database';
import { Conversation } from '../../../types/Conversation';
import {
  upsertConversationToPinecone,
  queryMessageInPinecone,
} from '@/lib/pinecone';
import templates from '@/lib/templates';
import { summarizeConversation } from '@/lib/langchain';

// Initialize multer
const upload = multer({ storage: multer.memoryStorage() });
const openAIapiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY as string;

const sendMessageHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  return new Promise<void>((resolve, reject) => {
    logger.defaultMeta = { service: 'sendMessage.ts' };
    // @ts-ignore - Argument of type 'NextApiRequest' is not assignable to parameter of type 'Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>'.
    upload.any()(req, res, async (err) => {
      if (err) {
        logger.error('Upload failed', { error: err });
        res.status(500).json({ error: err.message });
        return resolve();
      }

      switch (req.body.namespace) {
        case 'document':
          await handleDocumentNamespace(req, res, resolve, reject);
          break;
        case 'general':
          await handleGeneralNamespace(req, res, resolve, reject);
          break;
        default:
          logger.error('Invalid namespace', { namespace: req.body.namespace });
          res.status(500).json({ error: 'Invalid namespace' });
          break;
      }
    });
  });
};

async function handleDocumentNamespace(
  req: NextApiRequest,
  res: NextApiResponse,
  resolve: () => void,
  reject: (reason?: any) => void
) {
  const username = req.body.username;
  const prompt = req.body.transcript;
  const namespace = req.body.namespace;
  const sanitizedPrompt = prompt.trim().replaceAll('\n', ' ');
  const index = await getIndex();
  const vectorStore = await PineconeStore.fromExistingIndex(
    new OpenAIEmbeddings({
      openAIApiKey: openAIapiKey as string,
    }),
    {
      pineconeIndex: index,
      textKey: 'pageContent',
      namespace: `${username}_${namespace}`,
    }
  );
  const chain = makeChain(
    vectorStore,
    false, // returnSourceDocuments
    0, // temperature. Anything other than 0 may cause issues right now.
    openAIapiKey as string
  );

  const history = await getHistory(username, namespace);
  console.log('history', history);
  const response = await chain.call({
    question: sanitizedPrompt,
    chat_history: JSON.stringify(history) || [],
  });
  let newId = await updateHistory(
    username,
    namespace,
    sanitizedPrompt,
    response.text
  );

  res.status(200).json({
    successful: true,
    prompt: sanitizedPrompt,
    response: response.text,
    conversationId: newId,
  });
  return resolve();
}

async function getHistory(username: string, namespace: string) {
  const client = (await clientPromise) as any;
  const db = client.db('myapp');
  logger.info('Retrieving User Message History...');
  return await db
    .collection('Conversation')
    .find({ username: username, namespace: namespace })
    .sort({ datetime: -1 })
    .limit(10)
    .toArray();
}

async function updateHistory(
  username: string,
  namespace: string,
  prompt: string,
  response: string
) {
  const newConversation: Conversation = createConversationObject(
    username,
    prompt,
    response,
    namespace,
    new Date().toLocaleString()
  );
  const client = (await clientPromise) as any;
  const db = client.db('myapp');
  const insertResult = await db
    .collection('Conversation')
    .insertOne(newConversation);
  const insertedId = insertResult.insertedId;
  logger.info('Conversation saved to MongoDB', {
    insertedId: insertedId,
  });
  return insertedId;
}

async function handleGeneralNamespace(
  req: NextApiRequest,
  res: NextApiResponse,
  resolve: () => void,
  reject: (reason?: any) => void
) {
  let messages: ChatCompletionRequestMessage[] = [];
  const { username, email, transcript, namespace } = req.body;
  const pineconeQueryResponse = await queryMessageInPinecone(
    username,
    transcript,
    namespace
  );
  let userConversationHistory = '';
  // If a conversation is found in Pinecone, retrieve the conversation history from MongoDB
  if (pineconeQueryResponse) {
    userConversationHistory = await getUserConversationHistory(
      pineconeQueryResponse
    );
    if (process.env.NEXT_PUBLIC_LANGCHAIN_ENABLED === 'true') {
      // Summarize the conversation history using Langchain
      userConversationHistory = await summarizeConversation(
        transcript,
        userConversationHistory
      );
    } else {
      // Add the simple template to the messages array.
      // messages.push({
      //   role: 'system',
      //   content: templates.simple.friendly,
      // });
    }
    // Add the conversation history to the messages array.
    messages.push({
      role: 'system',
      content: templates.generic.use_history + userConversationHistory,
    });
  }
  // Add the user message to the messages array.
  messages.push({
    role: 'user',
    content: transcript,
  });
  // Generate a response from OpenAI that contains the AI response
  createChatCompletion(messages, username)
    .then(async (response) => {
      const responseContent = response?.data?.choices[0]?.message
        ?.content as string;
      logger.info('Chat Completion Request Successful!', {
        response: responseContent,
      });
      // Add the response to a new conversation object
      const newConversation: Conversation = createConversationObject(
        username,
        transcript,
        responseContent,
        new Date().toLocaleString(),
        namespace
      );
      // Save the conversation to MongoDB
      const newId = await insertConversationToMongoDB(newConversation);
      // Save the conversation to Pinecone
      const pineconeUpsertResponse = await upsertConversationToPinecone(
        newConversation,
        newId,
        namespace
      );
      //console.log('pineconeUpsertResponse', pineconeUpsertResponse);

      res.status(200).json({
        successful: true,
        response: responseContent,
        conversation: newConversation,
      });
      return resolve();
    })
    .catch((err) => {
      logger.error('Chat Completion Request Unsuccessful', { error: err });
      res.status(500).json({ successful: false, message: err });
      return reject();
    });
}

export default sendMessageHandler;
