import { body, validationResult } from 'express-validator';
import ApiError from '../utils/ApiError.js';

export const handleValidation = (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const details = result.array().map((e) => ({ field: e.path, message: e.msg }));
    return next(new ApiError(400, 'Dữ liệu không hợp lệ', details));
  }
  next();
};

export const registerRules = [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Tên 2-50 ký tự'),
  body('email').trim().isEmail().withMessage('Email không hợp lệ'),
  body('password').isLength({ min: 6 }).withMessage('Mật khẩu tối thiểu 6 ký tự'),
];
export const loginRules = [
  body('email').trim().isEmail().withMessage('Email không hợp lệ'),
  body('password').notEmpty().withMessage('Vui lòng nhập mật khẩu'),
];
export const recipeRules = [
  body('title').trim().isLength({ min: 3, max: 120 }).withMessage('Tên món 3-120 ký tự'),
  body('category').isMongoId().withMessage('Loại món không hợp lệ'),
  body('cookTime').isInt({ min: 1 }).withMessage('Thời gian nấu phải là số phút >= 1'),
  body('difficulty').isIn(['easy', 'medium', 'hard']).withMessage('Độ khó không hợp lệ'),
  body('servings').optional().isInt({ min: 1 }).withMessage('Khẩu phần >= 1'),
  body('ingredients').isArray({ min: 1 }).withMessage('Cần ít nhất 1 nguyên liệu'),
  body('ingredients.*.name').trim().notEmpty().withMessage('Tên nguyên liệu không được trống'),
  body('ingredients.*.amount').isFloat({ min: 0 }).withMessage('Số lượng phải >= 0'),
  body('steps').isArray({ min: 1 }).withMessage('Cần ít nhất 1 bước làm'),
  body('steps.*.content').trim().notEmpty().withMessage('Nội dung bước không được trống'),
];
export const reviewRules = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Điểm đánh giá từ 1 đến 5'),
  body('comment').optional().trim().isLength({ max: 1000 }).withMessage('Bình luận tối đa 1000 ký tự'),
];
export const mealPlanRules = [
  body('slots').isArray().withMessage('slots phải là mảng'),
  body('slots.*.day').isInt({ min: 0, max: 6 }).withMessage('day từ 0 đến 6'),
  body('slots.*.meal').isIn(['breakfast', 'lunch', 'dinner']).withMessage('meal không hợp lệ'),
  body('slots.*.recipe').isMongoId().withMessage('recipe không hợp lệ'),
];
export const categoryRules = [
  body('name').trim().isLength({ min: 2, max: 40 }).withMessage('Tên loại món 2-40 ký tự'),
];
