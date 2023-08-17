import { PineconeClient } from '@pinecone-database/pinecone';
import { createServiceLogger } from '@/lib/winstonConfig';
const serviceLogger = createServiceLogger('lib/client/pinecone.ts');
const API_KEY = process.env.NEXT_PUBLIC_PINECONE_API_KEY as string;
const PINECONE_ENVIRONMENT = process.env
  .NEXT_PUBLIC_PINECONE_ENVIRONMENT as string;

if (!API_KEY || !PINECONE_ENVIRONMENT) {
  serviceLogger.error('Invalid/Missing Pinecone environment variables');
  throw new Error('Invalid/Missing Pinecone environment variables');
}

const startPinecone = async (): Promise<PineconeClient> => {
  try {
    const pinecone = new PineconeClient();
    await pinecone.init({
      apiKey: API_KEY,
      environment: PINECONE_ENVIRONMENT,
    });
    serviceLogger.info('Connected to Pinecone');
    return pinecone;
  } catch (error: any) {
    serviceLogger.error('Error connecting to Pinecone', {
      error: error.message,
    });
    throw error;
  }
};

const pineconeClient = await startPinecone();

export default pineconeClient;
