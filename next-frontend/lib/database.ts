import clientPromise from './client/mobgodb';
import { v4 as uuidv4 } from 'uuid';
import logger from '../lib/winstonConfig';
import { Conversation } from '../types/Conversation';

export const insertConversationToMongoDB = async (
  newConversation: Conversation
) => {
  const client = (await clientPromise) as any;
  const db = client.db('myapp');
  // Save the conversation to MongoDB
  if (process.env.NEXT_PUBLIC_MEMORY_TYPE === 'dynamic') {
    const insertResult = await db
      .collection('Conversation')
      .insertOne(newConversation);
    const insertedId = insertResult.insertedId;
    logger.info('Conversation saved to MongoDB', {
      insertedId: insertedId,
    });
    return insertedId;
  }
};

export const createConversationObject = (
  username: string,
  email: string,
  message: string,
  response: string
) => {
  return {
    id: uuidv4(),
    username: username,
    email: email,
    message: `${username} prompt: ${message}`,
    response: `AI response: ${response}`,
    date: `Date: ${new Date()}`,
  };
};
