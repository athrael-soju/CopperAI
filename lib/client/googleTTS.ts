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
    audioConfig: {
      audioEncoding: process.env.NEXT_PUBLIC_GOOGLE_CLOUD_TTS_ENCODING,
    },
  };

  try {
    // @ts-ignore Argument of type '{ input: { text: string; }; voice: { languageCode: string | undefined; name: string | undefined; ssmlGender: string | undefined; }; audioConfig: { audioEncoding: string | undefined; }; }' is not assignable to parameter of type 'ISynthesizeSpeechRequest'.
    const responses = await client.synthesizeSpeech(request);
    // @ts-ignore Element implicitly has an 'any' type because expression of type '0' can't be used to index type 'Promise<[ISynthesizeSpeechResponse, ISynthesizeSpeechRequest | undefined, {} | undefined]> & void'.
    const response = responses[0];
    return response.audioContent;
  } catch (error) {
    console.error('Failed to generate speech', error);
    throw error;
  }
}
