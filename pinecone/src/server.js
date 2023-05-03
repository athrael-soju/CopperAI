import express from "express";
import cors from "cors";
import { PineconeClient } from "@pinecone-database/pinecone";
import dotenv from "dotenv";
import queryRoute from "./routes/query.js";
import upsertRoute from "./routes/upsert.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PINECONE_PORT;

app.listen(port, async () => {
  try {
    let pinecone = new PineconeClient();
    await pinecone.init({
      environment: process.env.PINECONE_ENVIRONMENT,
      apiKey: process.env.PINECONE_API_KEY,
    });

    app.use("/query", queryRoute(pinecone));
    app.use("/upsert", upsertRoute(pinecone));

    console.log(`Pinecone service listening at http://localhost:${port}`);
  } catch (err) {
    console.log("Error connecting to Pinecone", err);
  }
});
