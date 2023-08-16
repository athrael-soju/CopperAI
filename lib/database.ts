import clientPromise from './client/mobgodb';
import logger from '../lib/winstonConfig';
import { Conversation } from '../types/Conversation';

const client = (await clientPromise) as any;

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
  try {
    const db = client.db('myapp');
    const result = await db
      .collection('Conversation')
      .insertOne(newConversation);
    logger.info('Inserted conversation into database', {
      conversationId: result.insertedId,
    });
    return result.insertedId.toString();
  } catch (error: any) {
    logger.error('Failed to insert conversation into database', {
      error: error,
    });
    throw error.message;
  }
};

export const getHistory = async (username: string, namespace: string) => {
  try {
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
    logger.info(`Retrieved ${history.length} conversations from database`, {
      username,
    });
    return formattedHistory;
  } catch (error: any) {
    logger.error('Failed to retrieve conversations from database', {
      username,
      error: error.message,
    });
    throw error;
  }
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
