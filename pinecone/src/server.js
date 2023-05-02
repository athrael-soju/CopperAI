import express from "express";
import cors from "cors";
import { PineconeClient } from "@pinecone-database/pinecone";
import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PINECONE_PORT;
const indexName = process.env.PINECONE_INDEX;
const redisClientUri = process.env.REDIS_URI;
let index, redisClient;

async function main() {
  try {
    redisClient = createClient({ url: redisClientUri });
    console.log("Connected to Redis");

    const pinecone = new PineconeClient();
    await pinecone.init({
      environment: process.env.PINECONE_ENVIRONMENT,
      apiKey: process.env.PINECONE_API_KEY,
    });
    console.log("Connected to Pinecone");

    if (!pinecone.Index(indexName)) {
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
    console.log("Error connecting to Redis or Pinecone", err);
  }
}
app.listen(port, async () => {
  await main();
  console.log(`Pinecone service listening at http://localhost:${port}`);
});

app.post("/upsert", async (req, res) => {
  const { id, data } = req.body;
  try {
    await index.upsert(id, data);
    await redisClient.set(id, JSON.stringify(data));
    res.status(200).json({ message: "Upsert successful" });
  } catch (error) {
    res.status(500).json({ message: "Error upserting data" });
  }
});

app.post("/delete", async (req, res) => {
  const { id } = req.body;
  try {
    await index.delete(id);
    await redisClient.del(id);
    res.status(200).json({ message: "Delete successful" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting data" });
  }
});

app.get("/fetch/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const cachedData = await redisClient.get(id);
    if (cachedData) {
      res.status(200).json(JSON.parse(cachedData));
    } else {
      const pineconeData = await index.fetch(id);
      await redisClient.set(id, JSON.stringify(pineconeData));
      res.status(200).json(pineconeData);
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching data" });
  }
});
