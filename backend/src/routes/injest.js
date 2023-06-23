import express from "express";
import dotenv from "dotenv";
import Conversation from "../models/Conversation.js";
dotenv.config();

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    let conversationList = JSON.parse(req.files.document.data.toString());
    console.log(`Backend - Injesting Conversation List...`, conversationList);

    for (let conversation of conversationList) {
      const newConversation = new Conversation({
        id: conversation.id,
        username: conversation.username,
        usertype: conversation.usertype,
        message: conversation.message,
        response: conversation.response,
        date: conversation.date,
      });
      await newConversation.save();
    }
    console.log(`Backend - Conversation List Injested Successfully`);
    res
      .status(200)
      .json({ message: "Backend - Conversation List Injested Successfully" });
  } catch (error) {
    console.error(`Backend - Error: ${error.message}`);
    res.status(500).json({
      message: `Backend - Error: ${error.message}`,
    });
  }
});

router.get("/", (req, res) => {
  res.status(200).json({
    message: `You've reached the /injest server route, running on port ${process.env.SERVER_PORT}`,
  });
});

export default router;
