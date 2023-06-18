import express from "express";
import { createEmbedding, getIndex } from "../utils/utils.js";

const router = express.Router();

const upsertRoute = async (pinecone) => {
  router.post("/", async (req, res) => {
    let index = await getIndex(pinecone);
    const { newConversation } = req.body;
    try {
      let newConversationEmbedding = await createEmbedding(
        `${newConversation.message}\n${newConversation.response}\n${newConversation.date}\n`
      );
      console.log(`Pinecone - Upserting summarizedHistory...`);
      const upsertSummaryResponse = await index.upsert({
        upsertRequest: {
          vectors: [
            {
              id: newConversation.id,
              values: newConversationEmbedding,
              metadata: {
                id: newConversation.id,
                userName: newConversation.username,
              },
            },
          ],
          namespace: `default`,
        },
      });
      console.log(`Pinecone - Upserted summarizedHistory`);
      res.status(200).json(upsertSummaryResponse);
    } catch (error) {
      console.error(`Pinecone - Error Upserting Data: \n${error.message}`);
      res.status(500).json({
        message: `Pinecone - Error Upserting Data: \n${error.message}`,
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
