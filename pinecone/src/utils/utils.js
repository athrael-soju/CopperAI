import { Configuration, OpenAIApi } from "openai";
import dotenv from "dotenv";
dotenv.config();

const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);

const indexName = process.env.PINECONE_INDEX;

export const createEmbedding = async (message) => {
  console.log("Creating embedding for message:", message);
  const response = await openai.createEmbedding({
    input: message,
    model: "text-embedding-ada-002",
  });
  console.log("Embedding response:", response.data);
  if (
    !response.data ||
    !response.data.data ||
    response.data.data.length === 0 ||
    !response.data.data[0].embedding
  ) {
    console.log("No embedding found");
    return null;
  }
  return response.data.data[0].embedding;
};

export const getIndex = async (pinecone) => {
  let index = pinecone.Index(indexName);
  if (!index) {
    console.log(`Index ${indexName} does not exist, creating...`);
    await pinecone.createIndex({
      createRequest: {
        name: indexName,
        dimension: 1536,
        metric: "cosine",
        pod_type: "Starter",
      },
    });
    console.log(`Index ${indexName} created`);
  } else {
    index = pinecone.Index(indexName);
    console.log(`Index ${indexName} exists. Using existing index.`);
  }
  return index;
};
