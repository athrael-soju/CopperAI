import { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import { sendViaChatCompletion, sendViaLangChain } from '@/lib/utils';
import logger from '../../../lib/winstonConfig';

// Initialize multer
const upload = multer({ storage: multer.memoryStorage() });
const docTemperature = Number(process.env.NEXT_PUBLIC_USE_DOC_TEMPERATURE);
const chatTemperature = Number(process.env.NEXT_PUBLIC_USE_CHAT_TEMPERATURE);
const useLanchgain = process.env.NEXT_PUBLIC_LANGCHAIN_ENABLED === 'true';
const returnSourceDocuments =
  process.env.NEXT_PUBLIC_RETURN_SOURCE_DOCS === 'true';
const sendMessageHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  return new Promise<void>((resolve, reject) => {
    logger.defaultMeta = { service: 'sendMessage.ts' };
    // @ts-ignore - Argument of type 'NextApiRequest' is not assignable to parameter of type 'Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>'.
    upload.any()(req, res, async (err) => {
      if (err) {
        logger.error('Upload failed', { error: err });
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

      logger.info('Chat Completion Prompt:', {
        response: prompt,
      });
      let response;
      if (useLanchgain) {
        logger.info('Using Langchain for Chat Completion...');
        response = await sendViaLangChain(
          username,
          sanitizedPrompt,
          namespace,
          temperature,
          returnSourceDocuments
        );
      } else {
        logger.info('Langchain disabled. Using OpenAI for Chat Completion...');
        response = await sendViaChatCompletion(
          username,
          sanitizedPrompt,
          namespace
        );
      }
      if (response?.successful) {
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
