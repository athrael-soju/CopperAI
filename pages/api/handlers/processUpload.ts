import { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import { Request, Response } from 'express';
import logger from '../../../lib/winstonConfig';
import path from 'path';
import fs from 'fs';

type NextApiRequestWithExpress = NextApiRequest & Request;
type NextApiResponseWithExpress = NextApiResponse & Response;

logger.defaultMeta = { service: 'processUploads.ts' };

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.env.TMP_DIR ?? 'tmp');
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
  return new Promise<void>((resolve, reject) => {
    const uploadedFiles: string[] = [];
    uploadMiddleware(req, res, async (err) => {
      if (err) {
        logger.error('Upload Error: ', err.message);
        res.status(500).json({
          successful: false,
          response: 'Internal Server Error',
        });
        return reject(err);
      }

      const files = req.files as Express.Multer.File[];
      files.forEach((file) => {
        logger.info('Uploading File: ', file.originalname);
        const projectTmpDir = path.join(
          process.cwd(),
          process.env.TMP_DIR ?? 'tmp'
        );
        fs.mkdirSync(projectTmpDir, { recursive: true });
        const newFilePath = path.join(projectTmpDir, file.originalname);
        fs.renameSync(file.path, newFilePath);
        uploadedFiles.push(newFilePath);
      });

      if (uploadedFiles.length > 0) {
        logger.info(`Files: ${uploadedFiles.join(', ')} have been Uploaded!`);
        res.status(200).json({
          successful: true,
          response: `Files: ${uploadedFiles.join(', ')} have been Uploaded!`,
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
