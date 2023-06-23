import express from "express";
import { createEmbedding, getIndex } from "../utils/utils.js";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

const injestRoute = async (pinecone) => {
  router.post("/", async (req, res) => {
    let index = await getIndex(pinecone);
    let conversationList = JSON.parse(req.files.document.data.toString());
    console.log(`Pinecone - Injesting Conversation List...`);
    try {
      let responseList = [];
      for (let conversation of conversationList) {
        let conversationEmbedding = await createEmbedding(
          `${conversation.message}. ${conversation.response}. ${conversation.date}`
        );
        const upsertConversationResponse = await index.upsert({
          upsertRequest: {
            vectors: [
              {
                id: conversation.id,
                values: conversationEmbedding,
                metadata: {
                  id: conversation.id,
                  userName: conversation.username,
                },
              },
            ],
            namespace: `default`,
          },
        });
        responseList.push(upsertConversationResponse);
        console.log(`Pinecone - Conversation Injested Successfully`);
      }
      console.log(`Pinecone - Conversation List Injested Successfully`);
      res.status(200).json({
        message: `Pinecone - Conversation List Injest Successful for ${responseList.length} Conversations`,
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
