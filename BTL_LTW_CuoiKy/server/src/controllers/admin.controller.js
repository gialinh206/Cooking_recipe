import Recipe from '../models/Recipe.js';
import Review from '../models/Review.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

// GET /api/admin/recipes?status=pending
export const listRecipesByStatus = asyncHandler(async (req, res) => {
  const status = req.query.status || 'pending';
  const data = await Recipe.find({ status })
    .select('-steps')
    .populate('author', 'name email')
    .populate('category', 'name')
    .sort('-createdAt')
    .lean();
  res.json({ data });
});

// PATCH /api/admin/recipes/:id/status   body: { status }
export const setRecipeStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!['approved', 'rejected', 'pending'].includes(status)) {
    throw new ApiError(400, 'Trạng thái không hợp lệ');
  }
  const recipe = await Recipe.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!recipe) throw new ApiError(404, 'Không tìm thấy công thức');
  res.json(recipe);
});

// GET /api/admin/reviews  (để chọn bình luận cần ẩn)
export const listAllReviews = asyncHandler(async (req, res) => {
  const data = await Review.find()
    .populate('user', 'name')
    .populate('recipe', 'title')
    .sort('-createdAt')
    .limit(100)
    .lean();
  res.json({ data });
});

// GET /api/admin/stats/top-rated  -> Aggregation Pipeline
export const topRated = asyncHandler(async (req, res) => {
  const data = await Review.aggregate([
    { $match: { hidden: false } },
    { $group: { _id: '$recipe', avg: { $avg: '$rating' }, count: { $sum: 1 } } },
    { $match: { count: { $gte: Number(req.query.minReviews) || 1 } } },
    { $sort: { avg: -1, count: -1 } },
    { $limit: 10 },
    { $lookup: { from: 'recipes', localField: '_id', foreignField: '_id', as: 'recipe' } },
    { $unwind: '$recipe' },
    { $project: { _id: 1, avg: { $round: ['$avg', 2] }, count: 1, title: '$recipe.title', image: '$recipe.image' } },
  ]);
  res.json({ data });
});
