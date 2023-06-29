import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/utils/mongoConnection';

import { Preference } from '@/models/Preference';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    const { userEmail } = req.query;

    await connectDB();

    try {
      const preference = await Preference.findOne({ userEmail });

      res.status(200).json(preference);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch preference' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
