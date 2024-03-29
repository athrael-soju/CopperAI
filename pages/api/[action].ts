import { NextApiRequest, NextApiResponse } from 'next';
import { Request, Response } from 'express';

import sendMessageHandler from './handlers/sendMessage';
import textToSpeechHandler from './handlers/textToSpeech';
import processUploadHandler from './handlers/processUpload';
import processIngestHandler from './handlers/processIngest';

type NextApiRequestWithExpress = NextApiRequest & Request;
type NextApiResponseWithExpress = NextApiResponse & Response;

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(
  req: NextApiRequestWithExpress,
  res: NextApiResponseWithExpress
) {
  if (req.method !== 'POST') {
    // Only allow POST
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  const { action } = req.query;

  if (action === 'sendMessage') {
    return sendMessageHandler(req, res);
  } else if (action === 'textToSpeech') {
    return textToSpeechHandler(req, res);
  } else if (action === 'processUpload') {
    return processUploadHandler(req, res);
  } else if (action === 'processIngest') {
    return processIngestHandler(req, res);
  }
}
