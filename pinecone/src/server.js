import express from "express";
import cors from "cors";
import { PineconeClient } from "@pinecone-database/pinecone";
import dotenv from "dotenv";
import queryRoute from "./routes/query.js";
import upsertRoute from "./routes/upsert.js";
import { createClient } from "redis";
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PINECONE_PORT;
let pinecone, redisClient;

app.listen(port, async () => {
  try {
    pinecone = new PineconeClient();
    await pinecone.init({
      environment: process.env.PINECONE_ENVIRONMENT,
      apiKey: process.env.PINECONE_API_KEY,
    });

    redisClient = createClient({ url: process.env.REDIS_URI });
    redisClient.on("error", (err) => console.log("Redis Client Error", err));
    await redisClient.connect();
    console.log("Connected to Redis");

    app.use("/query", queryRoute(pinecone, redisClient));
    app.use("/upsert", upsertRoute(pinecone));

    console.log(`Pinecone service listening at http://localhost:${port}`);
  } catch (err) {
    console.log("Error connecting to Pinecone", err);
    redisClient.disconnect();
    process.exit();
  }
});
