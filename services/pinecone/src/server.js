import dotenv from "dotenv";
import { PineconeClient } from "@pinecone-database/pinecone";
import app, { initRoutes } from "./app.js";

dotenv.config();

const startPinecone = async () => {
  try {
    const pinecone = new PineconeClient();
    await pinecone.init({
      environment: process.env.PINECONE_ENVIRONMENT,
      apiKey: process.env.PINECONE_API_KEY,
    });
    console.log("Connected to Pinecone");
    return pinecone;
  } catch (err) {
    console.log("Error connecting to Pinecone", err);
    process.exit();
  }
};

const pinecone = await startPinecone();

app.listen(process.env.PINECONE_PORT, async () => {
  console.log(
    `Pinecone service listening at http://localhost:${process.env.PINECONE_PORT}`
  );
  await initRoutes(pinecone);
});
