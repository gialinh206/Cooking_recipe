import ApiError from '../utils/ApiError.js';

// Dùng sau verifyToken: requireRole('admin')
export const requireRole =
  (...roles) =>
  (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new ApiError(403, 'Bạn không có quyền thực hiện thao tác này');
    }
    next();
  };
