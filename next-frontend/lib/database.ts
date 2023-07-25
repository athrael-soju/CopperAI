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

export const getUserConversationHistory = async (pineconeResponse: any) => {
  const client = (await clientPromise) as any;
  const db = client.db('myapp');
  console.log('Retrieving User Message History...');
  let conversationHistory = '';
  let recordsRetrieved = 0;
  // Retrieve Conversation History from MongoDB, from Pinecone response
  await Promise.all(
    pineconeResponse.map(async (conversation: { id: string }) => {
      const conversationTurn = await db.collection('Conversation').findOne({
        id: conversation.id,
      });
      if (conversationTurn) {
        conversationHistory += `${conversationTurn.message}. ${conversationTurn.response}. ${conversationTurn.date}\n`;
        recordsRetrieved++;
      }
    })
  );
  console.log(`User Message History Records Retrieved: ${recordsRetrieved}`);

  return conversationHistory;
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
    message: `${username}: ${message}`,
    response: `AI: ${response}`,
    date: `Date: ${new Date().toLocaleDateString}`,
  };
};
