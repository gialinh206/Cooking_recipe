import multer from 'multer';
import ApiError from '../utils/ApiError.js';

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  let status = err.status || 500;
  let message = err.message || 'Lỗi máy chủ';
  let details = err.details;

  if (err instanceof multer.MulterError) {
    status = 400;
    message = err.code === 'LIMIT_FILE_SIZE' ? 'Ảnh vượt quá 2MB' : err.message;
  } else if (err.name === 'ValidationError') {
    status = 400;
    message = 'Dữ liệu không hợp lệ';
    details = Object.values(err.errors).map((e) => ({ field: e.path, message: e.message }));
  } else if (err.name === 'CastError') {
    status = 400;
    message = 'ID không hợp lệ';
  } else if (err.code === 11000) {
    status = 409;
    message = 'Dữ liệu đã tồn tại';
  } else if (!(err instanceof ApiError) && !err.status) {
    console.error(err);
    message = 'Lỗi máy chủ';
  }
  res.status(status).json({ message, ...(details && { details }) });
};

export const notFound = (req, res, next) => next(new ApiError(404, 'Không tìm thấy API'));
