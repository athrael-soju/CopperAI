import { NextApiRequest, NextApiResponse } from 'next';
import { Configuration, OpenAIApi } from 'openai';
import logger from '../../../lib/winstonConfig';
import clientPromise from '../../../lib/mongodb/client';

const configuration = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const sendMessageHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  // Get user data & message from request body

  // _id: new ObjectId("64a9d4816f5731537de0e396"),
  // name: 'Athos Georgiou',
  // email: 'athosg82@gmail.com',
  // image: 'https://lh3.googleusercontent.com/a/AAcHTtcpH3YpcyJPBBL7V83_mjOoBlSeYAirpsyq8AoUhaZBVw=s96-c',
  // emailVerified: null

  const getUsers = async () => {
    const client = await clientPromise;
    const db = client.db('myapp');
    const users = await db.collection('users').find().toArray();
    console.log(users);
  };
  getUsers();
};

export default sendMessageHandler;
