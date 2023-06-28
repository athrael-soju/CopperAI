import express from "express";
import { createEmbedding, getIndex } from "../utils/utils.js";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

const injestRoute = async (pinecone) => {
  router.post("/", async (req, res) => {
    let index = await getIndex(pinecone);
    let conversationList = JSON.parse(req.files.document.data.toString());
    let vectorList = [];
    console.log(`Pinecone - Injesting Conversation List...`);
    try {
      for (let conversation of conversationList) {
        let conversationEmbedding = await createEmbedding(
          `${conversation.message}. ${conversation.response}. ${conversation.date}`
        );
        vectorList.push({
          id: conversation.id,
          values: conversationEmbedding,
          metadata: {
            id: conversation.id,
            userName: conversation.username,
            userType: conversation.usertype,
          },
        });
      }
      const upsertConversationResponse = await index.upsert({
        upsertRequest: {
          vectors: vectorList,
          namespace: `default`,
        },
      });
      console.log(`Pinecone - Conversation List Injested Successfully`);
      res.status(200).json({
        message: `Pinecone - Conversation List Injest Successful for ${vectorList.length} Conversations:. Response: ${upsertConversationResponse}`,
      });
    } catch (error) {
      console.error(
        `Pinecone - Error Injesting Conversation List: ${error.message}`
      );
      res.status(500).json({
        message: `Pinecone - Error Injesting Conversation List: ${error.message}`,
      });
    }
  });
  return router;
};

router.get("/", (req, res) => {
  res.status(200).json({
    message: `You've reached the /injest Pinecone route, running on port ${process.env.PINECONE_ADDRESS}:${process.env.PINECONE_PORT}`,
  });
});

export default injestRoute;
