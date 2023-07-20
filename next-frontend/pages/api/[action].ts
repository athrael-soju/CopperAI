// src/api/[action].ts
import { NextApiRequest, NextApiResponse } from 'next';
import transcribeHandler from './handlers/transcribeInput';
import sendMessageHandler from './handlers/sendMessage';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    // Only allow POST
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  const { action } = req.query;

  if (action === 'transcribe') {
    return transcribeHandler(req, res);
  } else if (action === 'sendMessage') {
    return sendMessageHandler(req, res);
  }
}
