import { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import { Configuration, OpenAIApi } from 'openai';
import Winston from 'winston';

const configuration = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const logger = Winston.createLogger({
  level: 'info',
  format: Winston.format.json(),
  defaultMeta: { service: 'transcription-service' },
  transports: [
    new Winston.transports.Console(),
    new Winston.transports.File({ filename: 'error.log', level: 'error' }),
    new Winston.transports.File({ filename: 'combined.log' }),
  ],
});

const upload = multer({ storage: multer.memoryStorage() });

const transcribeHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  return new Promise<void>((resolve, reject) => {
    upload.single('file')(req, {}, async function (err) {
      if (err) {
        logger.error('Upload failed', { error: err });
        res.status(500).json({ error: 'Upload failed' });
        return resolve();
      }
      const fileStream = req.file.buffer;
      fileStream.path = 'audio.webm';
      await openai
        .createTranscription(fileStream, 'whisper-1')
        .then((response) => {
          logger.info('Transcription successful', {
            transcript: response.data.text,
          });
          res
            .status(200)
            .json({ successful: true, message: response.data.text });
          return resolve();
        })
        .catch((error) => {
          logger.error('Transcription failed', { error: error });
          res.status(500).json({ successful: false, message: error });
          return resolve();
        });
    });
  });
};

export default transcribeHandler;
