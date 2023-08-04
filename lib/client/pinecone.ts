import { PineconeClient } from '@pinecone-database/pinecone';
import logger from '../../lib/winstonConfig';

const API_KEY = process.env.NEXT_PUBLIC_PINECONE_API_KEY as string;
const PINECONE_ENVIRONMENT = process.env
  .NEXT_PUBLIC_PINECONE_ENVIRONMENT as string;

const startPinecone = async () => {
  try {
    const pinecone = new PineconeClient();
    await pinecone.init({
      apiKey: API_KEY,
      environment: PINECONE_ENVIRONMENT,
    });
    logger.info('Connected to Pinecone');
    return pinecone;
  } catch (err) {
    logger.error('Error connecting to Pinecone', err);
    process.exit();
  }
};

const pineconeClient = await startPinecone();

export default pineconeClient;
