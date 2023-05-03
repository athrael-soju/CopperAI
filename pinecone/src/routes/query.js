import express from "express";
import { createEmbedding } from "../utils/utils.js";
import { getIndex } from "../utils/utils.js";

const router = express.Router();

const queryRoute = (pinecone) => {
  router.post("/", async (req, res) => {
    let index = await getIndex(pinecone);
    const { message, topK } = req.body;
    console.log("Querying message:", message);

    let vector = await createEmbedding(message);
    console.log("Embedded message:", vector);

    const queryResponse = await index.query({
      queryRequest: {
        namespace: process.env.PINECONE_NAMESPACE,
        topK: topK,
        includeValues: true,
        includeMetadata: true,
        vector: vector,
      },
    });
    console.log("Query response:", queryResponse);
    res.status(200).json(queryResponse);
  });
  return router;
};

export default queryRoute;
