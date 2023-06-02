import { Configuration, OpenAIApi } from "openai";
import dotenv from "dotenv";
dotenv.config();

const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);

const indexName = process.env.PINECONE_INDEX;

export const createEmbedding = async (summarizedHistory) => {
  console.log(
    `OpenAI - Creating Embedding for SummarizedHistory: \n${summarizedHistory}`
  );
  const response = await openai.createEmbedding({
    input: summarizedHistory,
    model: "text-embedding-ada-002",
  });
  if (
    !response.data ||
    !response.data.data ||
    response.data.data.length === 0 ||
    !response.data.data[0].embedding
  ) {
    console.log(`OpenAI - No Embedding Found`);
    return null;
  }
  console.log(`OpenAI - Embedded summarizedHistory`);
  return response.data.data[0].embedding;
};

export const getIndex = async (pinecone) => {
  let index = await pinecone.Index(indexName);
  if (!index) {
    console.log(`Pinecone - index ${indexName} does not exist, creating...`);
    await pinecone.createIndex({
      createRequest: {
        name: indexName,
        dimension: 1536,
        metric: "cosine",
        pod_type: "Starter",
      },
    });
    console.log(`Pinecone - index ${indexName} created`);
  } else {
    index = pinecone.Index(indexName);
    console.log(`Pinecone - using existing index ${indexName}...`);
  }
  return index;
};
