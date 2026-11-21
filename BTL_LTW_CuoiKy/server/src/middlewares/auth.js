import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError.js';

const readToken = (req) => {
  const h = req.headers.authorization || '';
  return h.startsWith('Bearer ') ? h.slice(7) : null;
};

// Bắt buộc đăng nhập -> 401 nếu thiếu/sai token
export const verifyToken = (req, res, next) => {
  const token = readToken(req);
  if (!token) throw new ApiError(401, 'Bạn chưa đăng nhập');
  try {
    const { id, role } = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id, role };
    next();
  } catch {
    throw new ApiError(401, 'Token không hợp lệ hoặc đã hết hạn');
  }
};

// Không bắt buộc đăng nhập, có token hợp lệ thì gắn req.user
export const optionalAuth = (req, res, next) => {
  const token = readToken(req);
  if (token) {
    try {
      const { id, role } = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { id, role };
    } catch {
      /* bỏ qua, coi như khách */
    }
  }
  next();
};
