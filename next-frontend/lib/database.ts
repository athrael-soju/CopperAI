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
  // Retrieve Conversation History from MongoDB, from Pinecone response
  try {
    await Promise.all(
      pineconeResponse.map(async (conversation: { id: string }) => {
        const conversationTurn = await db
          .collection('Conversation')
          .findOne({
            id: conversation.id,
          });
        conversationHistory += `${conversationTurn.message}. ${conversationTurn.response}. ${conversationTurn.date}\n`;
      })
    );

    console.log(`User Message History Retrieved: \n${conversationHistory}`);
  } catch (err) {
    console.error(`Failed to Retrieve User Message History: \n${err?.message}`);
  }
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
    message: `${username} prompt: ${message}`,
    response: `AI response: ${response}`,
    date: `Date: ${new Date()}`,
  };
};
