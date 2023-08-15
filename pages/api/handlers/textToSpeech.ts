import { NextApiRequest, NextApiResponse } from 'next';
import { getAudioFromTranscript } from '@/lib/client/googleTTS';
import axios from 'axios';
import multer from 'multer';
import logger from '../../../lib/winstonConfig';
const upload = multer();

import { Request, Response } from 'express';
type NextApiRequestWithExpress = NextApiRequest & Request;
type NextApiResponseWithExpress = NextApiResponse & Response;
const ttsProvider = process.env.NEXT_PUBLIC_TTS_PROVIDER;

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

      const { transcript, namespace } = req.body;

      if (ttsProvider === 'google') {
        logger.info('Processing speech', { message: transcript });
        let audioContent = getAudioFromTranscript(transcript, namespace);

        audioContent.then((audio) => {
          logger.info('Sending audio', { audio: audio.name });
          res.setHeader('Content-Type', 'audio/mp3');
          res.setHeader(
            'Content-Disposition',
            'attachment; filename=audio.mp3'
          );
          res.status(200).send(audio);
          return resolve();
        });
      } else if (ttsProvider === 'elevenlabs') {
        const apiKey = process.env.NEXT_PUBLIC_ELEVENLABS_TTS_API_KEY,
          irisVoiceId = process.env.NEXT_PUBLIC_ELEVENLABS_TTS_VOICE_ID_IRIS,
          judeVoiceId = process.env.NEXT_PUBLIC_ELEVENLABS_TTS_VOICE_ID_JUDE;

        const voiceId =
          namespace === 'general'
            ? irisVoiceId
            : namespace === 'document'
            ? judeVoiceId
            : null;

        const options = {
          method: 'POST',
          url: `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
          headers: {
            accept: 'audio/mpeg', // Set the expected response type to audio/mpeg.
            'content-type': 'application/json', // Set the content type to application/json.
            'xi-api-key': `${apiKey}`, // Set the API key in the headers.
          },
          data: {
            text: transcript, // Pass in the inputText as the text to be converted to speech.
          },
          responseType: 'arraybuffer' as const, // Specify the type explicitly
        };
        const speechDetails = await axios.request(options);
        res.status(200).send(speechDetails.data);
        return resolve();
      }
    });
  });
};

export default textToSpeechHandler;
