import { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import { Request, Response } from 'express';

type NextApiRequestWithExpress = NextApiRequest & Request;
type NextApiResponseWithExpress = NextApiResponse & Response;

// Initialize multer with memory storage
const upload = multer({ storage: multer.memoryStorage() });

const processUploadHandler = async (
  req: NextApiRequestWithExpress,
  res: NextApiResponseWithExpress
) => {
  const uploadMiddleware = upload.array('files');

  // Use a promise to handle the multer middleware
  return new Promise<void>((resolve, reject) => {
    uploadMiddleware(req, res, (err) => {
      if (err) {
        return reject(err);
      }

      // Files are available in req.files
      const files = req.files as Express.Multer.File[];
      const userName = req.body.userName;
      console.log(`User Name: ${userName}`);
      // Iterate over the files and print their filenames and contents
      files.forEach((file) => {
        console.log(`Filename: ${file.originalname}`);
        //console.log(`Content: ${file.buffer.toString()}`);

        // langchain?
        // Break each file down and structure is as JSON
        // Create embeddings for each file
        // Store entries in DB
        // Store embeddings in Pinecone
        // Create a new namespace in Pinecone
      });

      // Send a response to the client
      res.status(200).json({ status: 'ok' });

      resolve();
    });
  });
};

export default processUploadHandler;
