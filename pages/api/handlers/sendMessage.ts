import { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import { sendViaChatCompletion, sendViaLangChain } from '@/lib/utils';
import { createServiceLogger } from '@/lib/winstonConfig';

const upload = multer({ storage: multer.memoryStorage() });
const docTemperature = Number(process.env.NEXT_PUBLIC_USE_DOC_TEMPERATURE);
const chatTemperature = Number(process.env.NEXT_PUBLIC_USE_CHAT_TEMPERATURE);
const useLanchgain = process.env.NEXT_PUBLIC_LANGCHAIN_ENABLED === 'true';
const returnSourceDocuments =
  process.env.NEXT_PUBLIC_RETURN_SOURCE_DOCS === 'true';

import { Request, Response } from 'express';
type NextApiRequestWithExpress = NextApiRequest & Request;
type NextApiResponseWithExpress = NextApiResponse & Response;

const serviceLogger = createServiceLogger('pages/api/handlers/sendMessage.ts');

const sendMessageHandler = async (
  req: NextApiRequestWithExpress,
  res: NextApiResponseWithExpress
) => {
  return new Promise<void>((resolve, reject) => {
    console.time('time: sendMessageHandler');
    upload.any()(req, res, async (err) => {
      if (err) {
        serviceLogger.error('Upload failed', { error: err });
        res.status(500).json({ error: err.message });
        return resolve();
      }
      const username = req.body.username;
      const prompt = req.body.transcript;
      const namespace = req.body.namespace;
      const sanitizedPrompt = prompt.trim().replaceAll('\n', ' ');
      let temperature =
        namespace === 'general'
          ? chatTemperature
          : namespace === 'document'
          ? docTemperature
          : 0;

      serviceLogger.info('Chat Completion Prompt:', {
        response: prompt,
      });
      let response;
      if (useLanchgain) {
        serviceLogger.info('Using Langchain for Chat Completion...');
        response = await sendViaLangChain(
          username,
          sanitizedPrompt,
          namespace,
          temperature,
          returnSourceDocuments
        );
      } else {
        serviceLogger.info(
          'Langchain disabled. Using OpenAI for Chat Completion...'
        );
        response = await sendViaChatCompletion(
          username,
          sanitizedPrompt,
          namespace
        );
      }
      if ('conversationId' in response && response.successful) {
        console.timeEnd('time: sendMessageHandler');
        res.status(200).json({
          successful: true,
          conversationId: response?.conversationId,
          response: response?.response,
        });
        return resolve();
      } else {
        res.status(500).json({ successful: false, message: err });
        return reject();
      }
    });
  });
};

export default sendMessageHandler;
