import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import { Configuration, OpenAIApi } from 'openai';
import Readable from 'readable-stream';
import winston from 'winston';

dotenv.config();

const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);

const router = express.Router();

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'transcribe-service' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

async function transcribe(recordingBlob) {
  try {
    const audioReadStream = Readable.from(recordingBlob.file.data);
    audioReadStream.path = 'conversation.wav';
    const {
      data: { text },
    } = await openai.createTranscription(audioReadStream, 'whisper-1');
    return text;
  } catch (error) {
    throw new Error(error.data.error.message);
  }
}

router.get('/', (req, res) => {
  logger.info('GET request to /transcribe');
  res.status(200).json({
    message: `You've reached the /transcribe backend route, running on port ${process.env.SERVER_PORT}`,
  });
});

router.post('/', async function (req, res, next) {
  logger.info('POST request to /transcribe');
  if (!req.files) {
    logger.warn('No audio file provided');
    return res
      .status(400)
      .json({ success: false, message: 'No audio file provided' });
  }
  transcribe(req.files)
    .then((transcribedText) => {
      logger.info(`Transcribed text: '${transcribedText}'`);
      res.status(200).json({ success: true, transcription: transcribedText });
    })
    .catch((error) => {
      logger.error(`Error transcribing audio: ${error}`);
      res
        .status(500)
        .json({
          success: false,
          message: `Error transcribing audio: ${error}`,
        });
    });
});

export default router;
