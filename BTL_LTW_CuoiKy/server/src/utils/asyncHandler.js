// Bọc controller async để lỗi tự chuyển vào errorHandler
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
export default asyncHandler;
