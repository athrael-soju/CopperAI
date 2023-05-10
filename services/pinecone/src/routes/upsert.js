import express from "express";
import { createEmbedding } from "../utils/utils.js";
import { v4 as uuidv4 } from "uuid";
import { getIndex } from "../utils/utils.js";
const router = express.Router();

const upsertRoute = async (pinecone) => {
  router.post("/", async (req, res) => {
    let index = await getIndex(pinecone);
    const { message, messageResponse } = req.body;
    console.log("Pinecone: upserting message:", message);
    let conversation = {
      message: message,
      messageResponse: messageResponse,
    };
    try {
      let messageEmbedding = await createEmbedding(message);
      console.log("Pinecone: embeddeding message");
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
      console.log("Pinecone: upserted message:", upsertResponse);
      res.status(200).json(upsertResponse);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Pinecone: Error upserting data", error });
    }
  });
  return router;
};

router.get("/", (req, res) => {
  res.status(200).json({
    message: `You've reached the /upsert Pinecone route, running on port ${process.env.PINECONE_ADDRESS}:${process.env.PINECONE_PORT}`,
  });
});

export default upsertRoute;
