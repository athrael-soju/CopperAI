import textToSpeech from '@google-cloud/text-to-speech';
import logger from '../../lib/winstonConfig';
const client = new textToSpeech.TextToSpeechClient();

export async function getAudioFromTranscript(
  transcript: string,
  namespace: string
) {
  const languageCode = namespace === 'document' ? 'en-GB' : 'en-US';
  const voiceName =
    namespace === 'document' ? 'en-GB-News-L' : 'en-US-Wavenet-F';
  const gender = namespace === 'document' ? 'MALE' : 'FEMALE';
  const audioEncoding =
    process.env.NEXT_PUBLIC_GOOGLE_CLOUD_TTS_ENCODING || 'MP3';
  
    const request = {
    input: { text: transcript },
    voice: {
      languageCode: languageCode,
      name: voiceName,
      ssmlGender: gender,
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
  } catch (error) {
    console.error('Failed to generate speech', error);
    throw error;
  }
}
