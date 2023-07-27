import { NextApiRequest, NextApiResponse } from 'next';
import { getAudioFromTranscript } from '@/lib/client/googleTTS';
import multer from 'multer';
import logger from '../../../lib/winstonConfig';
const upload = multer();

import { Request, Response } from 'express';
type NextApiRequestWithExpress = NextApiRequest & Request;
type NextApiResponseWithExpress = NextApiResponse & Response;

const textToSpeechHandler = async (
  req: NextApiRequestWithExpress,
  res: NextApiResponseWithExpress
) => {
  return new Promise<void>((resolve, reject) => {
    logger.defaultMeta = { service: 'textToSpeech.ts' };
    upload.any()(req, res, async (err) => {
      if (err) {
        return reject(err);
      }

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
    // res.status(500).json({
    //   successful: false,
    //   message: 'Something went wrong',
    // });
    // return reject();
  });
};

export default textToSpeechHandler;
