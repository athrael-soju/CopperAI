import textToSpeech from '@google-cloud/text-to-speech';
import logger from '../../lib/winstonConfig';

const client = new textToSpeech.TextToSpeechClient();

export async function getAudioFromTranscript(transcript: string) {
  const request = {
    input: { text: transcript },
    voice: {
      languageCode: process.env.NEXT_PUBLIC_GOOGLE_CLOUD_TTS_LANGUAGE,
      name: process.env.NEXT_PUBLIC_GOOGLE_CLOUD_TTS_NAME,
      ssmlGender: process.env.NEXT_PUBLIC_GOOGLE_CLOUD_TTS_GENDER,
    },
    audioConfig: { audioEncoding: process.env.NEXT_PUBLIC_GOOGLE_CLOUD_TTS_ENCODING },
  };

  const [response] = await client.synthesizeSpeech(request);
  return response.audioContent;
}
