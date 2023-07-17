import { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'openai';

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

      // Add the user message to the messages array.
      messages.push({
        role: 'user',
        content: req.body.transcript,
      });
      // Generate a response from OpenAI that contains the AI response
      openai
        .createChatCompletion({
          messages,
          model: OPENAI_API_MODEL as string,
          user: req.body.user as string,
        })
        .then((response) => {
          let responseContent = response?.data?.choices[0]?.message?.content;
          logger.info('Chat Completion Request Successful!', {
            reponse: responseContent,
          });
          res.status(200).json({ successful: true, message: responseContent });
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

// _id: new ObjectId("64a9d4816f5731537de0e396"),
// name: 'Athos Georgiou',
// email: 'athosg82@gmail.com',
// image: 'https://lh3.googleusercontent.com/a/AAcHTtcpH3YpcyJPBBL7V83_mjOoBlSeYAirpsyq8AoUhaZBVw=s96-c',
// emailVerified: null
// const getUsers = async () => {
//   const client = await clientPromise;
//   const db = client.db('myapp');
//   const users = await db.collection('users').find().toArray();
//   console.log(users);
// };
