import express from "express";
import cors from "cors";
import { PineconeClient } from "@pinecone-database/pinecone";
import dotenv from "dotenv";
import { Configuration, OpenAIApi } from "openai";
import { v4 as uuidv4 } from "uuid";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PINECONE_PORT;
const indexName = process.env.PINECONE_INDEX;
const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);
let index,
  vectorNum = 0;

async function createEmbedding(message) {
  const response = await openai.createEmbedding({
    input: message,
    model: "text-embedding-ada-002",
  });
  console.log("createEmbedding response: ", response.data);
  if (
    !response.data ||
    !response.data.data ||
    response.data.data.length === 0 ||
    !response.data.data[0].embedding
  ) {
    throw new Error("Error creating embedding for message: " + message);
  }

  return response.data.data[0].embedding;
}

async function main() {
  try {
    const pinecone = new PineconeClient();
    await pinecone.init({
      environment: process.env.PINECONE_ENVIRONMENT,
      apiKey: process.env.PINECONE_API_KEY,
    });
    console.log("Connected to Pinecone");
    index = pinecone.Index(indexName);
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
      console.log(`Index ${indexName} exists`);
    }
  } catch (err) {
    console.log("Error connecting to Pinecone", err);
  }
}
app.listen(port, async () => {
  await main();
  console.log(`Pinecone service listening at http://localhost:${port}`);
});

app.post("/query", async (req, res) => {
  const { message, topK } = req.body;
  console.log("Querying message:", message);
  try {
    let vector = await createEmbedding(message);
    console.log("Embedded message:", vector);

    const queryResponse = await index.query({
      queryRequest: {
        namespace: process.env.PINECONE_NAMESPACE,
        topK: topK,
        includeValues: true,
        includeMetadata: true,
        vector: vector,
      },
    });
    console.log("Query result:", queryResponse);
    res.status(200).json(queryResponse);
  } catch (error) {
    console.log("Error querying data", error.data);
    res.status(500).json({ message: "Error querying data", error });
  }
});

app.post("/upsert", async (req, res) => {
  const { message, messageResponse } = req.body;
  console.log("Upserting message:", message);
  let conversation = {
    message: message,
    messageResponse: messageResponse,
  };
  try {
    let messageEmbedding = await createEmbedding(message);
    console.log("Embedded message:", messageEmbedding);
    const upsertResponse = await index.upsert({
      upsertRequest: {
        vectors: [
          {
            id: uuidv4(),
            values: messageEmbedding,
            metadata: conversation,
          },
        ],
        namespace: "default",
      },
    });

    console.log("Upsert result:", upsertResponse);
    res.status(200).json(upsertResponse);
  } catch (error) {
    res.status(500).json({ message: "Error upserting data", error });
  }
});
