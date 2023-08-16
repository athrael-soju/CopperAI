import textToSpeech from '@google-cloud/text-to-speech';
import logger from '../../lib/winstonConfig';
const client = new textToSpeech.TextToSpeechClient();

interface TTSSettings {
  [key: string]: {
    languageCode: string;
    voiceName: string;
    gender: string;
  };
}

const TTS_CONFIGS: TTSSettings = {
  document: {
    languageCode: 'en-GB',
    voiceName: 'en-GB-News-L',
    gender: 'MALE',
  },
  general: {
    languageCode: 'en-US',
    voiceName: 'en-US-Wavenet-F',
    gender: 'FEMALE',
  },
};

export async function getAudioFromTranscript(
  transcript: string,
  namespace: string
) {
  const config = TTS_CONFIGS[namespace] || TTS_CONFIGS.general;
  const audioEncoding =
    process.env.NEXT_PUBLIC_GOOGLE_CLOUD_TTS_ENCODING || 'MP3';

  if (!audioEncoding) {
    logger.error(
      'Missing environment variable: "NEXT_PUBLIC_GOOGLE_CLOUD_TTS_ENCODING"'
    );
    throw new Error(
      'Invalid/Missing environment variable: "NEXT_PUBLIC_GOOGLE_CLOUD_TTS_ENCODING"'
    );
  }

  const request = {
    input: { text: transcript },
    voice: {
      languageCode: config.languageCode,
      name: config.voiceName,
      ssmlGender: config.gender,
    },
    audioConfig: {
      audioEncoding: audioEncoding,
    },
  };

  try {
    // @ts-ignore Argument of type '{ input: { text: string; }; voice: { languageCode: string | undefined; name: string | undefined; ssmlGender: string | undefined; }; audioConfig: { audioEncoding: string | undefined; }; }' is not assignable to parameter of type 'ISynthesizeSpeechRequest'.
    const responses = await client.synthesizeSpeech(request);
    // @ts-ignore Element implicitly has an 'any' type because expression of type '0' can't be used to index type 'Promise<[ISynthesizeSpeechResponse, ISynthesizeSpeechRequest | undefined, {} | undefined]> & void'.
    const response = responses[0];
    return response.audioContent;
  } catch (error: any) {
    logger.error('Failed to get audio from Google Text-to-Speech', {
      error: error.message,
    });
    throw error;
  }
}
