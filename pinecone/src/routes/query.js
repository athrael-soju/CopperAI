import express from "express";
import { createEmbedding, getIndex } from "../utils/utils.js";

const router = express.Router();

const queryRoute = async (pinecone) => {
  router.post("/", async (req, res) => {
    const { userName, message, topK } = req.body;
    console.log(`Pinecone - Querying Message: \n${message}`);
    try {
      let index = await getIndex(pinecone);
      // Create embedding for user prompt, but can return null, which needs to be handled
      let userPromptEmbedding = await createEmbedding(message);

      const queryResponse = await index.query({
        queryRequest: {
          namespace: process.env.PINECONE_NAMESPACE,
          topK: topK,
          //includeValues: true,
          includeMetadata: true,
          vector: userPromptEmbedding,
          filter: {
            userName: { $eq: userName },
          },
        },
      });

      if (queryResponse?.matches?.length > 0) {
        console.log(
          `Pinecone: Top ${topK} Conversation Matches:`,
          queryResponse.matches
            .map(
              (match) => `
              metadata: ${match.metadata.id}
              score: ${match.score}`
            )
            .join("\n")
        );
      } else {
        console.log(`Pinecone: No Conversation Matches.`);
      }
      res.status(200).json(queryResponse.matches);
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
