import Favorite from '../models/Favorite.js';
import Recipe from '../models/Recipe.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

// GET /api/favorites
export const listFavorites = asyncHandler(async (req, res) => {
  const data = await Favorite.find({ user: req.user.id })
    .populate({ path: 'recipe', select: '-steps', populate: { path: 'category', select: 'name' } })
    .sort('-createdAt')
    .lean();
  res.json({ data: data.filter((f) => f.recipe) });
});

// POST /api/favorites/:recipeId
export const addFavorite = asyncHandler(async (req, res) => {
  const { recipeId } = req.params;
  if (!(await Recipe.exists({ _id: recipeId, status: 'approved' }))) {
    throw new ApiError(404, 'Không tìm thấy công thức');
  }
  try {
    const fav = await Favorite.create({ user: req.user.id, recipe: recipeId });
    res.status(201).json(fav);
  } catch (e) {
    if (e.code === 11000) return res.status(200).json({ message: 'Đã có trong yêu thích' });
    throw e;
  }
});

// DELETE /api/favorites/:recipeId
export const removeFavorite = asyncHandler(async (req, res) => {
  await Favorite.deleteOne({ user: req.user.id, recipe: req.params.recipeId });
  res.json({ message: 'Đã bỏ khỏi yêu thích' });
});
