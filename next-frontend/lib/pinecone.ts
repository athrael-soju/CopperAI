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
  console.log(`Pinecone - Upserting...`);
  const response = await index.upsert({
    upsertRequest: {
      vectors: [
        {
          id: newConversation.id,
          values: newConversationEmbedding,
          metadata: {
            id: newConversation.id,
            userName: newConversation.username,
          },
        },
      ],
      // This has to be customizable to the user's domain/organization/conversation type
      namespace: `default`,
    },
  });
  console.log(`Pinecone - Upserted Successfully: `, response);
  return response;
};

export const queryMessageInPinecone = async (newConversation: Conversation) => {
  let index = await getIndex();
  let userPromptEmbedding = (await createEmbedding(
    newConversation.message
  )) as number[];

  const queryResponse = await index.query({
    queryRequest: {
      namespace: PINECONE_NAMESPACE,
      topK: parseInt(PINECONE_TOPK),
      includeMetadata: true,
      vector: userPromptEmbedding,
      filter: {
        $or: [
          { userName: { $eq: newConversation.username } },
          //{ userDomain: { $eq: userDomain } },
        ],
        //$and: [{score: {$gte: parseInt(PINECONE_SIMILARITY_CUTOFF),},},],
      },
    },
  });

  const queryLength = queryResponse?.matches?.length as number;
  if (queryLength > 0) {
    logger.info(
      `Pinecone: Top ${PINECONE_TOPK} Conversation Matches:`,
      queryResponse.matches
        .map(
          (match) => `
              metadata: ${match.metadata.id}
              score: ${match.score}`
        )
        .join('\n')
    );
    return queryResponse.matches;
  } else {
    logger.info(`Pinecone: No Conversation Matches.`);
  }
};

const getIndex = async () => {
  let index = await pineconeClient.Index(PINECONE_INDEX);
  if (!index) {
    logger.info(
      `Pinecone - index ${PINECONE_INDEX} does not exist, creating...`
    );
    await pineconeClient.createIndex({
      createRequest: {
        name: PINECONE_INDEX,
        dimension: 1536,
        metric: 'cosine',
        podType: 'Starter',
      },
    });
    logger.info(`Pinecone - index ${PINECONE_INDEX} created.`);
  } else {
    index = pineconeClient.Index(PINECONE_INDEX);
    logger.info(`Pinecone - index ${PINECONE_INDEX} exists.`);
  }
  return index;
};
