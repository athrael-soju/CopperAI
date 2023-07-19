import { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import { ChatCompletionRequestMessage } from 'openai';
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

import { summarizeConversation } from '@/lib/langchain';
import { templates } from '@/lib/templates';
// Initialize multer
const upload = multer({ storage: multer.memoryStorage() });

export const config = {
  // This tells Next.js to not automatically parse the request body, so we can do it ourselves with multer
  api: {
    bodyParser: false,
  },
};

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
      let messages: ChatCompletionRequestMessage[] = [];
      const { username, email, transcript } = req.body;
      const pineconeQueryResponse = await queryMessageInPinecone(
        username,
        transcript
      );
      // If a conversation is found in Pinecone, retrieve the conversation history from MongoDB
      if (pineconeQueryResponse) {
        let userConversationHistory = await getUserConversationHistory(
          pineconeQueryResponse
        );
        // FIX IT
        if (process.env.NEXT_PUBLIC_LANGCHAIN_ENABLED === 'true') {
          // Summarize the conversation history using Langchain
          userConversationHistory = await summarizeConversation(
            transcript,
            userConversationHistory
          );
          console.log('userConversationHistory', userConversationHistory, typeof userConversationHistory);
        }

        // Add the conversation history to the messages array.
        messages.push({
          role: 'system',
          content: userConversationHistory,
        });
      }

      // Add the generic response to the messages array.
      messages.push({
        role: 'system',
        content: templates.generic.response,
      });

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
            email,
            transcript,
            responseContent
          );
          // Save the conversation to MongoDB
          const insertedId = await insertConversationToMongoDB(newConversation);
          //console.log('insertedId', insertedId);

          // Save the conversation to Pinecone
          const pineconeUpsertResponse = await upsertConversationToPinecone(
            newConversation
          );
          //console.log('pineconeUpsertResponse', pineconeUpsertResponse);

          res.status(200).json({
            successful: true,
            conversation: newConversation,
          });
          return resolve();
        })
        .catch((err) => {
          logger.error('Chat Completion Request Unsuccessful', { error: err });
          res.status(500).json({ successful: false, message: err });
        });
    });
  });
};

export default sendMessageHandler;
