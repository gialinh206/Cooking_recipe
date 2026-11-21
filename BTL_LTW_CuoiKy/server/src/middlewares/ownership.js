import Recipe from '../models/Recipe.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

// Chỉ chủ công thức (hoặc admin) được sửa/xóa
export const isRecipeOwner = asyncHandler(async (req, res, next) => {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) throw new ApiError(404, 'Không tìm thấy công thức');
  const isOwner = recipe.author.toString() === req.user.id;
  if (!isOwner && req.user.role !== 'admin') {
    throw new ApiError(403, 'Bạn không có quyền với công thức này');
  }
  req.recipe = recipe;
  next();
});
