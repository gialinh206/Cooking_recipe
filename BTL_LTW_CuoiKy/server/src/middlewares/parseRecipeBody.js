import ApiError from '../utils/ApiError.js';

// FormData gửi ingredients/steps dưới dạng chuỗi JSON -> parse lại thành mảng
export const parseRecipeBody = (req, res, next) => {
  try {
    ['ingredients', 'steps'].forEach((k) => {
      if (typeof req.body[k] === 'string') req.body[k] = JSON.parse(req.body[k]);
    });
    if (Array.isArray(req.body.steps)) {
      req.body.steps = req.body.steps.map((s, i) => ({ ...s, order: i + 1 }));
    }
    next();
  } catch {
    next(new ApiError(400, 'ingredients/steps phải là JSON hợp lệ'));
  }
};
