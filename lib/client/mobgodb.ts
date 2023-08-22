import { MongoClient } from 'mongodb';
import { createServiceLogger } from '@/lib/winstonConfig';
const serviceLogger = createServiceLogger('lib/client/mongodb.ts');
if (!process.env.MONGODB_URI) {
  serviceLogger.error('Missing environment variable: "MONGODB_URI"');
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;

const getClientPromise = async (): Promise<MongoClient> => {
  console.time('time: startMongoDB');
  let clientPromise: Promise<MongoClient>;
  if (process.env.NODE_ENV === 'development') {
    let globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>;
    };

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, options);
      globalWithMongo._mongoClientPromise = client.connect().catch((err) => {
        serviceLogger.error('Failed to connect to MongoDB in development', {
          error: err.message,
        });
        throw err;
      });
    }
    clientPromise = globalWithMongo._mongoClientPromise;
  } else {
    try {
      client = new MongoClient(uri, options);
      serviceLogger.info('Connected to MongoDB');
      clientPromise = client.connect();
    } catch (error: any) {
      serviceLogger.error('Failed to connect to MongoDB', {
        error: error.message,
      });
      throw error;
    }
  }
  console.timeEnd('time: startMongoDB');
  return clientPromise;
};
const clientPromise = getClientPromise();

export default clientPromise;
