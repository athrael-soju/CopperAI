import textToSpeech from '@google-cloud/text-to-speech';
import { createServiceLogger } from '@/lib/winstonConfig';
const serviceLogger = createServiceLogger('lib/client/database.ts');

const client = new textToSpeech.TextToSpeechClient({
  credentials: {
    private_key: process.env.NEXT_PUBLIC_GOOGLE_CLOUD_TTS_API_KEY?.split(
      String.raw`\n`
    ).join('\n'),
    client_email: process.env.NEXT_PUBLIC_GOOGLE_CLOUD_TTS_CLIENT_EMAIL,
  },
});

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
    process.env.NEXT_PUBLIC_GOOGLE_CLOUD_TTS_ENCODING ?? 'MP3';

  if (!audioEncoding) {
    serviceLogger.error(
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
    const [response] = await client.synthesizeSpeech(request);
    return response.audioContent;
  } catch (error: any) {
    serviceLogger.error('Failed to get audio from Google Text-to-Speech', {
      error: error.message,
    });
    throw error;
  }
}
