import { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import { Configuration, OpenAIApi } from 'openai';
import logger from '../../../lib/winstonConfig';

const configuration = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const upload = multer({ storage: multer.memoryStorage() });

const transcribeHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  return new Promise<void>((resolve, reject) => {
    // @ts-ignore - Argument of type 'NextApiRequest' is not assignable to parameter of type 'Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>'.
    upload.single('file')(req, {}, async function (err) {
      if (err) {
        logger.error('Upload failed', { error: err });
        res.status(500).json({ error: 'Upload failed' });
        return resolve();
      }
      // @ts-ignore - Property 'file' does not exist on type 'NextApiRequest'.
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
