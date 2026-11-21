import multer from 'multer';
import path from 'path';
import fs from 'fs';
import ApiError from '../utils/ApiError.js';

const dir = path.resolve('uploads');
fs.mkdirSync(dir, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: dir,
    filename: (req, file, cb) =>
      cb(null, `${Date.now()}-${Math.round(Math.random() * 1e6)}${path.extname(file.originalname)}`),
  }),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) =>
    /^image\/(jpeg|png|webp)$/.test(file.mimetype)
      ? cb(null, true)
      : cb(new ApiError(400, 'Chỉ nhận ảnh jpg, png hoặc webp')),
});
export default upload;
