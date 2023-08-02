import clientPromise from './client/mobgodb';
import logger from '../lib/winstonConfig';
// logger.defaultMeta = { service: 'lib/database.ts' };
import { Conversation } from '../types/Conversation';
import { ChatMessage } from 'langchain/schema';

export const updateHistory = async (
  username: string,
  namespace: string,
  prompt: string,
  response: string
) => {
  const newConversation: Conversation = createConversationObject(
    username,
    prompt,
    response,
    namespace,
    new Date()
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
};

export const getHistory = async (username: string, namespace: string) => {
  const client = (await clientPromise) as any;
  const db = client.db('myapp');
  logger.info('Retrieving User Message History...');
  let history = await db
    .collection('Conversation')
    .find({ username: username, namespace: namespace })
    .sort({ date: -1 })
    .limit(10)
    .toArray();

  let langchainFormattedHistory: ChatMessage[] = [];
  await history.forEach((conversation: Conversation) => {
    langchainFormattedHistory.push(
      new ChatMessage(conversation.message, 'user')
    );
    langchainFormattedHistory.push(
      new ChatMessage(conversation.response, 'system')
    );
  });
  return langchainFormattedHistory;
};

const createConversationObject = (
  username: string,
  message: string,
  response: string,
  namespace: string,
  date: Date
) => {
  return {
    username: username,
    message: message,
    response: response,
    date: date,
    namespace: namespace,
  };
};
