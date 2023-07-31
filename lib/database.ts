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
};

export const getHistory = async (username: string, namespace: string) => {
  const client = (await clientPromise) as any;
  const db = client.db('myapp');
  logger.info('Retrieving User Message History...');
  return await db
    .collection('Conversation')
    .find({ username: username, namespace: namespace })
    .sort({ datetime: -1 })
    .limit(10)
    .toArray();
};

const createConversationObject = (
  username: string,
  message: string,
  response: string,
  namespace: string,
  date: string
) => {
  return {
    username: username,
    message: message,
    response: response,
    date: date,
    namespace: namespace,
  };
};
