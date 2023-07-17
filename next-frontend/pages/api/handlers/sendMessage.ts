import { NextApiRequest, NextApiResponse } from 'next';
import { Configuration, OpenAIApi } from 'openai';
import logger from '../../../lib/winstonConfig';

const configuration = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const sendMessage = async (req: NextApiRequest, res: NextApiResponse) => {
  // Get user data & message from request body
};

export default sendMessage;
