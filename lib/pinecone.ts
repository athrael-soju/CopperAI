import pineconeClient from './client/pinecone';
import { createEmbedding } from './openAI';
import { createServiceLogger } from '@/lib/winstonConfig';
const serviceLogger = createServiceLogger('lib/pinecone.ts');
const PINECONE_INDEX = process.env.NEXT_PUBLIC_PINECONE_INDEX;
const PINECONE_TOPK = process.env.NEXT_PUBLIC_PINECONE_TOPK;
const PINECONE_SIMILARITY_CUTOFF =
  process.env.NEXT_PUBLIC_PINECONE_SIMILARITY_CUTOFF;

if (!PINECONE_INDEX || !PINECONE_TOPK || !PINECONE_SIMILARITY_CUTOFF) {
  serviceLogger.error('Invalid/Missing Pinecone environment variables');
  throw new Error('Invalid/Missing Pinecone environment variables');
}

export const upsertConversationToPinecone = async (
  username: string,
  prompt: string,
  response: string,
  namespace: string,
  newId: string
): Promise<any> => {
  try {
    console.time('time: upsertConversationToPinecone');
    const conversation = `${username}: ${prompt} AI: ${response} Date: ${new Date()}`;
    const embedding = (await createEmbedding(conversation)) as number[];
    serviceLogger.info(`Upserting New Embedding for id: ${newId}...`);
    const index = await getIndex();
    const upsertResponse = await index.upsert({
      upsertRequest: {
        vectors: [
          {
            id: newId,
            values: embedding,
            metadata: {
              id: newId,
              conversation: conversation,
            },
          },
        ],
        namespace: `${username}_${namespace}`,
      },
    });
    console.timeEnd('time: upsertConversationToPinecone');
    return upsertResponse;
  } catch (error: any) {
    serviceLogger.error('Failed to upsert conversation to Pinecone', {
      error: error.message,
      username,
      prompt,
      response,
      namespace,
      newId,
    });
    throw error;
  }
};

export const queryMessageInPinecone = async (
  username: string,
  prompt: string,
  namespace: string
) => {
  console.time('time: queryMessageInPinecone');
  let index = await getIndex();
  let userPromptEmbedding = (await createEmbedding(prompt)) as number[];

  const queryResponse = await index.query({
    queryRequest: {
      namespace: `${username}_${namespace}`,
      topK: parseInt(PINECONE_TOPK),
      includeMetadata: true,
      vector: userPromptEmbedding,
    },
  });

  const queryLength = queryResponse?.matches?.length as number;
  if (queryLength > 0) {
    serviceLogger.info('Conversation Matches:', {
      response: queryResponse.matches?.length,
    });
    const namespaceMappings: {
      document: string;
      general: string;
    } = {
      document: 'pageContent',
      general: 'conversation',
    };

    if (namespace in namespaceMappings) {
      console.timeEnd('time: queryMessageInPinecone');
      return queryResponse?.matches
        ?.map(
          (match: any) =>
            match.metadata[
              namespaceMappings[namespace as keyof typeof namespaceMappings]
            ]
        )
        .join('\n');
    }
  } else {
    serviceLogger.info('No Conversation Matches', {
      response: queryResponse,
    });
    return null;
  }
};

export const getIndex = async () => {
  console.time('time: getIndex');
  let index = pineconeClient.Index(PINECONE_INDEX);
  if (!index) {
    serviceLogger.info(`index ${PINECONE_INDEX} does not exist, creating...`);
    await pineconeClient.createIndex({
      createRequest: {
        name: PINECONE_INDEX,
        dimension: 1536,
        metric: 'cosine',
        podType: 'Starter',
      },
    });
    serviceLogger.info(`index ${PINECONE_INDEX} created.`);
  } else {
    index = pineconeClient.Index(PINECONE_INDEX);
    serviceLogger.info(`Using Existing Index ${PINECONE_INDEX}`);
  }
  console.timeEnd('time: getIndex');
  return index;
};
