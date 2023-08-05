import clientPromise from './client/mobgodb';
import logger from '../lib/winstonConfig';
// logger.defaultMeta = { service: 'lib/database.ts' };
import { Conversation } from '../types/Conversation';

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
    .limit(Number(process.env.NEXT_PUBLIC_PINECONE_TOPK))
    .toArray();

  const formattedHistory = history
    .map((conversation: Conversation) => {
      return `${username}: ${conversation.message} AI: ${conversation.response} Date: ${conversation.date}`;
    })
    .join('\n');
  return formattedHistory;
};

export const createConversationObject = (
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
