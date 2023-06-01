import express from "express";
import { createEmbedding } from "../utils/utils.js";
import { getIndex } from "../utils/utils.js";

const router = express.Router();

const queryRoute = async (pinecone) => {
  router.post("/", async (req, res) => {
    const { userName, message, topK } = req.body;
    console.log(`Pinecone - Querying Message: \n${message}\n`);
    try {
      let index = await getIndex(pinecone);
      let vector = await createEmbedding(message);

      const queryResponse = await index.query({
        queryRequest: {
          namespace: process.env.PINECONE_NAMESPACE,
          topK: topK,
          includeValues: true,
          includeMetadata: true,
          vector: vector,
          filters: {
            userName: userName,
          },
        },
      });
      console.log(`Pinecone - Querying Message: \n${message}\n`);
      if (queryResponse && queryResponse.matches.length[0] > 0) {
        console.log(
          `Pinecone: Top ${topK} conversation matches:`,
          queryResponse.data.matches
            .map(
              (match) => `
      metadata: ${JSON.stringify(match.metadata)}
      score: ${match.score}`
            )
            .join("\n")
        );
      }
      res.status(200).json(queryResponse);
    } catch (error) {
      console.error("Pinecone: error querying data:", error);
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
