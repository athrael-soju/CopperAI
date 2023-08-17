import { NextApiRequest, NextApiResponse } from 'next';
import { getAudioFromTranscript } from '@/lib/client/googleTTS';
import axios from 'axios';
import multer from 'multer';
import { createServiceLogger } from '@/lib/winstonConfig';

const upload = multer();

import { Request, Response } from 'express';
type NextApiRequestWithExpress = NextApiRequest & Request;
type NextApiResponseWithExpress = NextApiResponse & Response;

const ttsProvider = process.env.NEXT_PUBLIC_TTS_PROVIDER;

const serviceLogger = createServiceLogger('pages/api/handlers/textToSpeech.ts');

const textToSpeechHandler = async (
  req: NextApiRequestWithExpress,
  res: NextApiResponseWithExpress
) => {
  return new Promise<void>((resolve, reject) => {
    const uploadedFiles: string[] = [];
    upload.any()(req, res, async (err) => {
      if (err) {
        serviceLogger.error('Upload Error: ', err.message);
        res.status(500).json({
          successful: false,
          response: 'Internal Server Error',
        });
        return reject(err);
      }

      const { transcript, namespace } = req.body;

      if (ttsProvider === 'google') {
        serviceLogger.info('Processing speech', { message: transcript });
        let audioContent = getAudioFromTranscript(transcript, namespace);

        audioContent.then((audio) => {
          serviceLogger.info('Sending audio', { audio: audio.name });
          res.setHeader('Content-Type', 'audio/mp3');
          res.setHeader(
            'Content-Disposition',
            'attachment; filename=audio.mp3'
          );
          res.status(200).send(audio);
          return resolve();
        });
      } else if (ttsProvider === 'elevenlabs') {
        const apiKey = process.env.NEXT_PUBLIC_ELEVENLABS_TTS_API_KEY;
        const irisVoiceId =
          process.env.NEXT_PUBLIC_ELEVENLABS_TTS_VOICE_ID_IRIS;
        const judeVoiceId =
          process.env.NEXT_PUBLIC_ELEVENLABS_TTS_VOICE_ID_JUDE;

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
            accept: 'audio/mpeg',
            'content-type': 'application/json',
            'xi-api-key': `${apiKey}`,
          },
          data: {
            text: transcript,
          },
          responseType: 'arraybuffer' as const,
        };
        const speechDetails = await axios.request(options);
        res.status(200).send(speechDetails.data);
        return resolve();
      }
    });
  });
};

export default textToSpeechHandler;
