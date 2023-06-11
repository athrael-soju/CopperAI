import express from "express";
import { createEmbedding, getIndex } from "../utils/utils.js";

const router = express.Router();

const queryRoute = async (pinecone) => {
  router.post("/", async (req, res) => {
    const { userName, summarizedHistory, topK } = req.body;
    console.log(`Pinecone - Querying Message: \n${message}`);
    try {
      let index = await getIndex(pinecone);
      let vector = await createEmbedding(summarizedHistory);

      const queryResponse = await index.query({
        queryRequest: {
          namespace: process.env.PINECONE_NAMESPACE,
          topK: topK,
          // includeValues: true, Not needed, right?
          includeMetadata: true,
          vector: vector,
          filter: {
            userName: { $eq: userName },
          },
        },
      });

      if (queryResponse?.matches[0]) {
        console.log(
          `Pinecone: Top ${topK} Conversation Matches:`,
          queryResponse.matches
            .map(
              (match) => `
              metadata: ${match.metadata.summarizedHistory}
              score: ${match.score}`
            )
            .join("\n")
        );
        res.status(200).json(queryResponse);
      } else {
        console.log(``);
        res.status(200).json({ message: `` });
      }
    } catch (error) {
      console.error("Pinecone: Error Querying Data:", error);
      res.status(500).json({ message: "Pinecone: Error querying data", error });
    }
  });

  return router;
};

router.get("/", (req, res) => {
  res.status(200).json({
    message: `You've reached the /query Pinecone route, running on port ${process.env.PINECONE_ADDRESS}:${process.env.PINECONE_PORT}`,
  });
});

export default queryRoute;
