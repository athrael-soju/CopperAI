// src/api/handlers/transcribe.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default async function transcribeHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let targetUrl = `${process.env.SERVER_ADDRESS}:${process.env.SERVER_PORT}${process.env.SERVER_WHISPER_ENDPOINT}`;

  let blob = req.body;
  //const audioBuffer = Buffer.from(blob, 'base64');
  

  //console.log('type of blob', typeof blob);
  const formData = new FormData();
  formData.append('file', blob, 'audio.wav');
  await fetch(targetUrl, {
    method: 'POST',
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Frontend - Received transcription from OpenAI Whisper API:');
      console.log(data);
      return data;
    })
    .catch((error) => {
      console.error('Error:', error);
      return error;
    });
}