import { NextApiRequest, NextApiResponse } from 'next';
import { getAudioFromTranscript } from '@/lib/client/googleTTS';
import multer from 'multer';
import logger from '../../../lib/winstonConfig';
const upload = multer();

const textToSpeechHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  return new Promise<void>((resolve, reject) => {
    upload.any()(req, res, async (err) => {
      if (err) {
        return reject(err);
      }

      logger.defaultMeta = { service: 'textToSpeech.ts' };
      const transcript = req.body.transcript;
      logger.info('Processing speech', { message: transcript });
      let audioContent = getAudioFromTranscript(transcript);

      audioContent.then((audio) => {
        logger.info('Sending audio', { audio: audio.name });
        res.setHeader('Content-Type', 'audio/mp3');
        res.setHeader('Content-Disposition', 'attachment; filename=audio.mp3');
        res.send(audio);
        return resolve();
      });
    });
  });
};

export default textToSpeechHandler;
