import express from "express";
import { createEmbedding, getIndex } from "../utils/utils.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

const upsertRoute = async (pinecone) => {
  router.post("/", async (req, res) => {
    let index = await getIndex(pinecone);
    const { message, summarizedHistory } = req.body;
    console.log("Pinecone: upserting message:", message);

    try {
      let summarizedHistoryEmbedding = await createEmbedding(summarizedHistory);
      console.log("Pinecone: embeddeding message");
      const upsertSummaryResponse = await index.upsert({
        upsertRequest: {
          vectors: [
            {
              id: uuidv4(),
              values: summarizedHistoryEmbedding,
              metadata: message,
            },
          ],
          namespace: "default",
        },
      });
      console.log("Pinecone: upserted message:", upsertSummaryResponse);
      res.status(200).json(upsertSummaryResponse);
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
