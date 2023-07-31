import clientPromise from './client/mobgodb';
import { v4 as uuidv4 } from 'uuid';
import logger from '../lib/winstonConfig';
// logger.defaultMeta = { service: 'lib/database.ts' };

import { Conversation } from '../types/Conversation';
import { ObjectId } from 'mongodb';

export const insertConversationToMongoDB = async (
  newConversation: Conversation
) => {
  const client = (await clientPromise) as any;
  const db = client.db('myapp');
  // Save the conversation to MongoDB
  const insertResult = await db
    .collection('Conversation')
    .insertOne(newConversation);
  const insertedId = insertResult.insertedId;
  logger.info('Conversation saved to MongoDB', {
    insertedId: insertedId,
  });
  return insertedId;
};

export const getUserConversationHistory = async (pineconeResponse: any) => {
  const client = (await clientPromise) as any;
  const db = client.db('myapp');
  logger.info('Retrieving User Message History...');
  let conversationHistory = '';
  let recordsRetrieved = 0;
  // Retrieve Conversation History from MongoDB, from Pinecone response
  await Promise.all(
    pineconeResponse.map(async (conversation: { id: string }) => {
      const conversationTurn = await db
        .collection('Conversation')
        .findOne({ _id: new ObjectId(conversation.id) });
      if (conversationTurn) {
        conversationHistory += `${conversationTurn.message}. ${conversationTurn.response}. ${conversationTurn.date}\n`;
        recordsRetrieved++;
      }
    })
  );
  console.log('conversationTurn', conversationHistory);
  logger.info(`User Message History Records Retrieved: ${recordsRetrieved}`);

  return conversationHistory;
};

export const createConversationObject = (
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
