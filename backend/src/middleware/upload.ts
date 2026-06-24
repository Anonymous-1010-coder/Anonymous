import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { config } from '../config';
import { validateFileType, validateImageType, validateVideoType } from '../utils/validation';
import { Request } from 'express';

if (!fs.existsSync(config.uploadDir)) {
  fs.mkdirSync(config.uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, config.uploadDir);
  },
  filename: (_req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${unique}${ext}`);
  },
});

function fileFilter(_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) {
  if (file.fieldname === 'file') {
    if (validateFileType(file.originalname, file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only APK and EXE files are allowed'));
    }
  } else if (file.fieldname === 'coverImage') {
    if (validateImageType(file.originalname, file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG, PNG, and WebP images are allowed for cover image'));
    }
  } else if (file.fieldname === 'video') {
    if (validateVideoType(file.originalname, file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only MP4 and WebM videos are allowed'));
    }
  } else {
    cb(new Error('Unexpected file field'));
  }
}

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: config.maxFileSize },
});

export const uploadFields = upload.fields([
  { name: 'file', maxCount: 1 },
  { name: 'coverImage', maxCount: 1 },
  { name: 'video', maxCount: 1 },
]);
