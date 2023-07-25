import pineconeClient from './client/pinecone';
import { createEmbedding } from './openAI';
import logger from '../lib/winstonConfig';
import { Conversation } from '../types/Conversation';

const PINECONE_INDEX = process.env.NEXT_PUBLIC_PINECONE_INDEX as string;
const PINECONE_NAMESPACE = process.env.NEXT_PUBLIC_PINECONE_NAMESPACE as string;
const PINECONE_TOPK = process.env.NEXT_PUBLIC_PINECONE_TOPK as string;
const PINECONE_SIMILARITY_CUTOFF = process.env
  .NEXT_PUBLIC_PINECONE_SIMILARITY_CUTOFF as string;

export const upsertConversationToPinecone = async (
  newConversation: Conversation
) => {
  let index = await getIndex();
  let newConversationEmbedding = (await createEmbedding(
    `${newConversation.message}. ${newConversation.response}. ${newConversation.date}.`
  )) as number[];
  logger.info(`Upserting...`);
  const response = await index.upsert({
    upsertRequest: {
      vectors: [
        {
          id: newConversation.id,
          values: newConversationEmbedding,
          metadata: {
            id: newConversation.id,
            username: newConversation.username,
          },
        },
      ],
      // This has to be customizable to the user's domain/organization/conversation type
      namespace: `default`,
    },
  });
  logger.info('Upserted Successfully:', {
    response: response,
  });
  return response;
};

export const queryMessageInPinecone = async (
  username: string,
  transcript: string
) => {
  let index = await getIndex();
  let userPromptEmbedding = (await createEmbedding(transcript)) as number[];

  const queryResponse = await index.query({
    queryRequest: {
      namespace: PINECONE_NAMESPACE,
      topK: parseInt(PINECONE_TOPK),
      includeMetadata: true,
      vector: userPromptEmbedding,
      filter: {
        username: { $eq: username },
        //$and: [{ score: { $gte: parseInt(PINECONE_SIMILARITY_CUTOFF) } }],
      },
    },
  });

  const queryLength = queryResponse?.matches?.length as number;
  if (queryLength > 0) {
    logger.info('Conversation Matches:', {
      response: queryResponse.matches?.length,
    });
    return queryResponse.matches;
  } else {
    logger.info('No Conversation Matches', {
      response: queryResponse,
    });
    return null;
  }
};

const getIndex = async () => {
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
    logger.info(`index ${PINECONE_INDEX} exists.`);
  }
  return index;
};
