import { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'openai';
import { v4 as uuidv4 } from 'uuid';
import logger from '../../../lib/winstonConfig';
import clientPromise from '../../../lib/mongodb/client';
const configuration = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
const OPENAI_API_MODEL = process.env.NEXT_PUBLIC_OPENAI_API_MODEL;
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
      // TODO:
      // - Summarize the conversation history using Langchain
      // - Adjust the AI response
      // - Add the summarized history to the messages array.
      const { username, email, transcript } = req.body;

      // Add the user message to the messages array.
      messages.push({
        role: 'user',
        content: transcript,
      });
      // Generate a response from OpenAI that contains the AI response
      openai
        .createChatCompletion({
          messages,
          model: OPENAI_API_MODEL as string,
          user: req.body.user as string,
        })
        .then((response) => {
          const responseContent = response?.data?.choices[0]?.message?.content;
          logger.info('Chat Completion Request Successful!', {
            response: responseContent,
          });
          insertConversationToDB(username, email, transcript, responseContent);
          res.status(200).json({ successful: true, message: responseContent });
          return resolve();
        })
        .catch((err) => {
          logger.error('Chat Completion Request Unsuccessful', { error: err });
          res.status(500).json({ successful: false, message: err });
        });
    });
  });

  /*
   * If the memory type is dynamic, save the conversation to MongoDB and Pinecone (More suitable for conversation).
   * If the memory type is static, only store the conversation to Pinecone (More suitable for Q&A).
   */
  async function insertConversationToDB(
    username: string,
    email: string,
    message: string,
    response: string | undefined
  ) {
    const client = (await clientPromise) as any;
    const db = client.db('myapp');

    // Save the conversation to MongoDB
    if (process.env.NEXT_PUBLIC_MEMORY_TYPE === 'dynamic') {
      const id = uuidv4();
      const newConversation = {
        id: id,
        username: username,
        email: email,
        message: `${username} prompt: ${message}`,
        response: `AI response: ${response}`,
        date: `Date: ${new Date()}`,
      };
      await db.collection('Conversation').insertOne(newConversation);
      const conversation = await db
        .collection('Conversation')
        .findOne({ id: id });
      logger.info('Conversation saved to MongoDB', {
        insertedId: conversation,
      });
    }
  }
};

export default sendMessageHandler;
