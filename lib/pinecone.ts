import pineconeClient from './client/pinecone';
import { createEmbedding } from './openAI';
import logger from '../lib/winstonConfig';

import { Conversation } from '../types/Conversation';

const PINECONE_INDEX = process.env.NEXT_PUBLIC_PINECONE_INDEX as string;
const PINECONE_TOPK = process.env.NEXT_PUBLIC_PINECONE_TOPK as string;
const PINECONE_SIMILARITY_CUTOFF = process.env
  .NEXT_PUBLIC_PINECONE_SIMILARITY_CUTOFF as string;

export const upsertConversationToPinecone = async (
  username: string,
  prompt: string,
  response: string,
  namespace: string,
  newId: string
) => {
  let index = await getIndex();
  const conversation = `${username}: ${prompt} AI: ${response} Date: ${new Date()}`;
  let embedding = (await createEmbedding(conversation)) as number[];

  logger.info(`Upserting New Embedding for id: ${newId}...`);
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
  logger.info('Upserted Successfully:', {
    response: upsertResponse,
  });
  return upsertResponse;
};

export const queryMessageInPinecone = async (
  username: string,
  prompt: string,
  namespace: string
) => {
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
    logger.info('Conversation Matches:', {
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
    logger.info('No Conversation Matches', {
      response: queryResponse,
    });
    return null;
  }
};

export const getIndex = async () => {
  let index = pineconeClient.Index(PINECONE_INDEX);
  if (!index) {
    logger.info(`index ${PINECONE_INDEX} does not exist, creating...`);
    await pineconeClient.createIndex({
      createRequest: {
        name: PINECONE_INDEX,
        dimension: 1536,
        metric: 'cosine',
        podType: 'Starter',
      },
    });
    logger.info(`index ${PINECONE_INDEX} created.`);
  } else {
    index = pineconeClient.Index(PINECONE_INDEX);
    logger.info(`Using Existing Index ${PINECONE_INDEX}`);
  }
  return index;
};
