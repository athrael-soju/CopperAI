import { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import { Request, Response } from 'express';
import logger from '../../../lib/winstonConfig';
import path from 'path';
import fs from 'fs';

type NextApiRequestWithExpress = NextApiRequest & Request;
type NextApiResponseWithExpress = NextApiResponse & Response;

// Initialize multer with memory storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'tmp'); // Adjust the path as needed
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now());
  },
});
const upload = multer({ storage: storage });
const uploadMiddleware = upload.array('files');

const processUploadHandler = async (
  req: NextApiRequestWithExpress,
  res: NextApiResponseWithExpress
) => {
  // Use a promise to handle the multer middleware
  return new Promise<void>((resolve, reject) => {
    logger.defaultMeta = { service: 'processUploads.ts' };
    const uploadedFiles: string[] = [];
    uploadMiddleware(req, res, async (err) => {
      if (err) {
        return reject(err);
      }

      // Files are available in req.files
      const files = req.files as Express.Multer.File[];
      // Iterate over the files and print their filenames and contents
      files.forEach((file) => {
        if (process.env.NODE_ENV !== 'production') {
          const projectTmpDir = path.join(process.cwd(), 'tmp');
          fs.mkdirSync(projectTmpDir, { recursive: true });
          const newFilePath = path.join(projectTmpDir, file.originalname);
          fs.renameSync(file.path, newFilePath);
          uploadedFiles.push(newFilePath);
        } else {
          uploadedFiles.push(file.path);
        }
      });
      if (uploadedFiles.length > 0) {
        res.status(200).json({
          successful: true,
          response: `Files ${uploadedFiles.join(', ')} have been Uploaded!`,
        });
        return resolve();
      } else {
        res.status(400).json({
          successful: false,
          response: `No Files have been Uploaded`,
        });
        return reject();
      }
    });
  });
};

export default processUploadHandler;
