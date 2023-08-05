import { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import { ChatMessage } from 'langchain/schema';

import {
  queryMessageInPinecone,
  upsertConversationToPinecone,
} from '@/lib/pinecone';
import templates from '@/lib/templates';

import logger from '../../../lib/winstonConfig';
import { getHistory, updateHistory } from '../../../lib/database';
import { ChatCompletionRequestMessage } from 'openai';
import { createChatCompletion } from '@/lib/openAI';

// Initialize multer
const upload = multer({ storage: multer.memoryStorage() });
const docTemperature = Number(process.env.NEXT_PUBLIC_USE_DOC_TEMPERATURE);
const chatTemperature = Number(process.env.NEXT_PUBLIC_USE_CHAT_TEMPERATURE);
const useHistory = process.env.NEXT_PUBLIC_USE_CHAT_HISTORY === 'true';

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

      let messages: ChatCompletionRequestMessage[] = [];

      let temperature =
        namespace === 'general'
          ? chatTemperature
          : namespace === 'document'
          ? docTemperature
          : 0;

      let history: string[] = [];
      if (useHistory) {
        history = await getHistory(username, namespace);
        messages.push({
          role: 'system',
          content: 'history:' + history,
        });
      }

      let context = await queryMessageInPinecone(username, prompt, namespace);

      const content =
        namespace === 'document'
          ? templates.document_qa.simplified_qa_prompt + '\n' + context
          : namespace === 'general'
          ? templates.general.simplified_general + '\n' + context
          : '';

      messages.push({
        role: 'system',
        content: content,
      });

      messages.push({
        role: 'user',
        content: prompt,
      });
      // refactor to openAI.ts
      createChatCompletion(messages, username)
        .then(async (response) => {
          const responseContent = response?.data?.choices[0]?.message
            ?.content as string;
          logger.info('Chat Completion Request Successful!', {
            response: responseContent,
          });
          let newId = await updateHistory(
            username,
            namespace,
            sanitizedPrompt,
            responseContent
          );
          await upsertConversationToPinecone(
            username,
            prompt,
            responseContent,
            namespace,
            newId
          );
          res.status(200).json({
            successful: true,
            conversationId: newId,
            response: responseContent,
          });
          return resolve();
        })
        .catch((err) => {
          logger.error('Chat Completion Request Unsuccessful', { error: err });
          res.status(500).json({ successful: false, message: err });
          return reject();
        });
    });
  });
};

export default sendMessageHandler;
