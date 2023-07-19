// pineconeClient.js
import { PineconeClient } from '@pinecone-database/pinecone';

const API_KEY = process.env.NEXT_PUBLIC_PINECONE_API_KEY as string;
const PINECONE_ENVIRONMENT = process.env
  .NEXT_PUBLIC_PINECONE_ENVIRONMENT as string;

const startPinecone = async () => {
  try {
    const pinecone = new PineconeClient();
    await pinecone.init({
      environment: PINECONE_ENVIRONMENT,
      apiKey: API_KEY,
    });
    console.log('Connected to Pinecone');
    return pinecone;
  } catch (err) {
    console.log('Error connecting to Pinecone', err);
    process.exit();
  }
};

const pineconeClient = await startPinecone();

export default pineconeClient;
