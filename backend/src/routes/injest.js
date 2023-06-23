import express from "express";
import dotenv from "dotenv";
import Conversation from "../models/Conversation.js";
dotenv.config();

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { conversationList } = req.body;
    console.log(`Backend - Conversation List Received: ${conversationList}`);

    res.status(200).json({ message: "MongoDB Data Injest Successful" });
  } catch (error) {
    console.error(`Backend - Error:\n${error.message}`);
    res.status(500).json({
      message: `Backend - Error:\n${error.message}`,
    });
  }
});

router.get("/", (req, res) => {
  res.status(200).json({
    message: `You've reached the /injest server route, running on port ${process.env.SERVER_PORT}`,
  });
});

export default router;
