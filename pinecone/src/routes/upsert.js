import express from "express";
import { createEmbedding, getIndex } from "../utils/utils.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

const upsertRoute = async (pinecone) => {
  router.post("/", async (req, res) => {
    let index = await getIndex(pinecone);
    const { userName, message, summarizedHistory } = req.body;
    console.log(`Pinecone - Upserting Message...`);
    try {
      let summarizedHistoryEmbedding = await createEmbedding(summarizedHistory);
      console.log(`Pinecone - Upserting Message...`);
      const upsertSummaryResponse = await index.upsert({
        upsertRequest: {
          vectors: [
            {
              id: uuidv4(),
              values: summarizedHistoryEmbedding,
              metadata: { userName: userName, message: message },
            },
          ],
          namespace: `default`,
        },
      });
      console.log(`Pinecone - Upserted Message`);
      res.status(200).json(upsertSummaryResponse);
    } catch (error) {
      console.error(`Pinecone - Error Upserting Data: \n${error.message}\n`);
      res.status(500).json({
        message: `Pinecone - Error Upserting Data: \n${error.message}\n`,
      });
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
