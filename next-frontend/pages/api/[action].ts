// src/api/[action].ts
import { NextApiRequest, NextApiResponse } from 'next';
import transcribeHandler from './handlers/transcribe';

export const config = {
  api: {
    bodyParser: false,
  },
}

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
  }
  
  // Handle unrecognized actions
  res.status(404).end(`Action ${action} not found`);
}
