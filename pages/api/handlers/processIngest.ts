import { NextApiRequest, NextApiResponse } from 'next';
import logger from '../../../lib/winstonConfig';
import multer from 'multer';
import fs from 'fs';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';
import { DocxLoader } from 'langchain/document_loaders/fs/docx';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { getIndex } from '@/lib/pinecone';

const chunkSize = process.env.NEXT_PUBLIC_LANGCHAIN_CHUNK_SIZE;
const overlapSize = process.env.NEXT_PUBLIC_LANGCHAIN_OVERLAP_SIZE;
const uploadLimit = 10 * 1024 * 1024;
const upload = multer({
  limits: { fileSize: uploadLimit },
});

const filePath = process.env.NODE_ENV === 'production' ? '/tmp' : 'tmp';

import { Request, Response } from 'express';
type NextApiRequestWithExpress = NextApiRequest & Request;
type NextApiResponseWithExpress = NextApiResponse & Response;

logger.defaultMeta = { service: 'processIngest.ts' };

const processIngestHandler = async (
  req: NextApiRequestWithExpress,
  res: NextApiResponseWithExpress
) => {
  return new Promise<void>((resolve, reject) => {
    upload.any()(req, res, async (err) => {
      if (err) {
        logger.error('Data Ingestion Failed', { error: err });
        res.status(500).json({ successful: false, response: err.message });
        return reject();
      }

      const { username, namespace } = req.body;

      const directoryLoader = new DirectoryLoader(filePath, {
        '.pdf': (path) => new PDFLoader(path),
        '.docx': (path) => new DocxLoader(path),
        '.txt': (path) => new TextLoader(path),
        '.log': (path) => new TextLoader(path),
      });

      const rawDocs = await directoryLoader.load();

      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: Number(chunkSize),
        chunkOverlap: Number(chunkSize) * Number(overlapSize),
      });
      const docs = await textSplitter.splitDocuments(rawDocs);

      const embeddings = new OpenAIEmbeddings({
        openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY as string,
      });
      let index = await getIndex();

      logger.info('Data Ingestion Started...');
      PineconeStore.fromDocuments(docs, embeddings, {
        pineconeIndex: index,
        namespace: `${username}_${namespace}`,
        textKey: 'pageContent',
      })
        .then(() => {
          logger.info('Data Ingestion Completed');
          const filesToDelete = fs
            .readdirSync(filePath)
            .filter(
              (file) =>
                file.endsWith('.pdf') ||
                file.endsWith('.docx') ||
                file.endsWith('.txt') ||
                file.endsWith('.log')
            );
          filesToDelete.forEach((file) => {
            fs.unlinkSync(`${filePath}/${file}`);
          });
          logger.info('Temporary files deleted');
          res
            .status(200)
            .json({ successful: true, response: 'Data Ingestion Completed' });
          return resolve();
        })
        .catch((err) => {
          logger.error('Data Ingestion Failed', { error: err });
          res.status(500).json({ successful: false, response: err.message });
          return reject();
        });
    });
  });
};

export default processIngestHandler;
