import express from "express";
import { createEmbedding } from "../utils/utils.js";
import { getIndex } from "../utils/utils.js";

const router = express.Router();

const queryRoute = (pinecone, redisClient) => {
  router.post("/", async (req, res) => {
    const { message, topK } = req.body;

    let redisResponse = await redisClient.get(message);
    if (redisResponse) {
      redisResponse = JSON.parse(redisResponse);
      console.log(
        "Redis: cache hit. Returning Redis Response",
        redisResponse.matches[0]
      );
      return res.status(200).json(redisResponse);
    } else {
      let index = await getIndex(pinecone);
      let vector = await createEmbedding(message);

      console.log("Pinecone: querying message:", message);
      const queryResponse = await index.query({
        queryRequest: {
          namespace: process.env.PINECONE_NAMESPACE,
          topK: topK,
          includeValues: true,
          includeMetadata: true,
          vector: vector,
        },
      });
      console.log("Pinecone: query response:", queryResponse.matches[0]);
      await redisClient.set(message, JSON.stringify(queryResponse));
      console.log("Redis: response cached: ", queryResponse.matches[0]);
      res.status(200).json(queryResponse);
    }
  });
  return router;
};

export default queryRoute;
