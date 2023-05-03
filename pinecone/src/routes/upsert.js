import express from "express";
import { createEmbedding } from "../utils/utils.js";
import { v4 as uuidv4 } from "uuid";
import { getIndex } from "../utils/utils.js";
const router = express.Router();

const upsertRoute = (pinecone) => {
  router.post("/", async (req, res) => {
    let index = await getIndex(pinecone);
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
      console.log("Upserted message:", upsertResponse);
      res.status(200).json(upsertResponse);
    } catch (error) {
      res.status(500).json({ message: "Error upserting data", error });
    }
  });
  return router;
};

export default upsertRoute;
