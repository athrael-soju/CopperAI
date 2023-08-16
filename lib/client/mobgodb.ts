import { MongoClient } from 'mongodb';
import logger from '../../lib/winstonConfig';

if (!process.env.MONGODB_URI) {
  logger.error('Missing environment variable: "MONGODB_URI"');
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient> | undefined;

if (process.env.NODE_ENV === 'development') {
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect().catch((err) => {
      logger.error('Failed to connect to MongoDB in development', {
        error: err.message,
      });
      throw err;
    });
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  try {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
    logger.info('Connected to MongoDB');
  } catch (error: any) {
    logger.error('Failed to connect to MongoDB', { error: error.message });
    throw error;
  }
}

export default clientPromise;
