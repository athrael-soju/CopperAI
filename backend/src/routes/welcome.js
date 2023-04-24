import express from "express";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: process.env.OPENAI_API_WELCOME_MSG,
  });
});

export default router;
