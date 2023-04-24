import express from "express";
import { Configuration, OpenAIApi } from "openai";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);

router.get("/", async (req, res) => {
  try {
    const response = await openai.createImage({
      prompt: process.env.DALLE_API_PROMPT,
      n: parseInt(process.env.DALLE_API_N),
      size: process.env.DALLE_API_SIZE,
    });

    if (!response.data) {
      throw new Error("Unable to get image");
    }

    res.json({ imageUrl: response.data.data[0].url });
  } catch (error) {
    console.error(
      "Error fetching wallpaper from Dall-E:",
      error.response.data.error.message
    );
    res.status(500).json({ error: "Failed to fetch image from Dall-E" });
  }
});

export default router;
