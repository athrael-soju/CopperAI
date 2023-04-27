import express from "express";
import { TextToSpeechClient } from "@google-cloud/text-to-speech";
import RateLimit from "express-rate-limit";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

const limiter = RateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
});
const router = express.Router();
router.use(limiter);

router.post("/", async (req, res) => {
  const { text } = req.body;
  const fileName = "response.wav";
  const filePath = `./${fileName}`;
  const client = new TextToSpeechClient();

  const request = {
    input: { text: text },
    voice: {
      languageCode: process.env.GOOGLE_CLOUD_TTS_LANGUAGE,
      name: process.env.GOOGLE_CLOUD_TTS_NAME,
      ssmlGender: process.env.GOOGLE_CLOUD_TTS_GENDER,
    },
    audioConfig: { audioEncoding: process.env.GOOGLE_CLOUD_TTS_ENCODING },
  };

  try {
    const [response] = await client.synthesizeSpeech(request);
    fs.writeFileSync(filePath, response.audioContent, "binary");
    res.download(filePath, fileName, (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: "Error sending audio file" });
      }
      fs.unlink(filePath, (err) => {
        if (err) console.error(err);
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error generating audio file" });
  }
});

export default router;
