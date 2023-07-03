import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/utils/mongoConnection';

import { Preference } from '@/models/Preference';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    const { activity, userEmail } = req.body;

    await connectDB();

    try {
      const newPreference = await Preference.findOneAndUpdate(
        { userEmail: { $eq: userEmail as string } },
        { activity: { $eq: activity as string } },
        { upsert: true, new: true },
      );

      res.status(201).json(newPreference);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create preference' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
