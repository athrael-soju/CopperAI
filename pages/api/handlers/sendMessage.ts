import { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { getChain } from '@/lib/langchain';
import { getIndex } from '@/lib/pinecone';

import logger from '../../../lib/winstonConfig';
import { getHistory, updateHistory } from '../../../lib/database';

// Initialize multer
const upload = multer({ storage: multer.memoryStorage() });
const openAIapiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY as string;
const docTemperature = Number(process.env.NEXT_PUBLIC_USE_DOC_TEMPERATURE);
const chatTemperature = Number(process.env.NEXT_PUBLIC_USE_CHAT_TEMPERATURE);

const returnSourceDocuments =
  process.env.NEXT_PUBLIC_RETURN_SOURCE_DOCS === 'true';
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
      const index = await getIndex();
      const vectorStore = await PineconeStore.fromExistingIndex(
        new OpenAIEmbeddings({
          openAIApiKey: openAIapiKey as string,
        }),
        {
          pineconeIndex: index,
          textKey: 'pageContent',
          namespace: `${username}_${namespace}`,
        }
      );
      let temperature =
        namespace === 'general'
          ? chatTemperature
          : namespace === 'document'
          ? docTemperature
          : 0;

      const chain = getChain(
        vectorStore,
        returnSourceDocuments === true,
        temperature, //  Anything other than 0 may cause issues right now.
        namespace
      );

      let history = [];
      if (useHistory) {
        history = await getHistory(username, namespace);
      }
      let response;
      if (namespace === 'document') {
        response = await chain?.call({
          question: sanitizedPrompt,
          chat_history: history, // must be an array of strings
        });
      } else if (namespace === 'general') {
        response = await chain?.call({
          question: sanitizedPrompt,
        });
      } else {
        response = { text: 'Unable to generate response' };
      }

      let newId = await updateHistory(
        username,
        namespace,
        sanitizedPrompt,
        response?.text
      );

      res.status(200).json({
        successful: true,
        prompt: sanitizedPrompt,
        response: response?.text,
        conversationId: newId,
      });
      return resolve();
    });
  });
};

export default sendMessageHandler;
