import Review from '../models/Review.js';
import Recipe from '../models/Recipe.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { refreshRating } from '../utils/rating.js';

// GET /api/recipes/:id/reviews
export const listReviews = asyncHandler(async (req, res) => {
  const data = await Review.find({ recipe: req.params.id, hidden: false })
    .populate('user', 'name avatar')
    .sort('-createdAt')
    .lean();
  res.json({ data });
});

// POST /api/recipes/:id/reviews
export const createReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const recipe = await Recipe.findOne({ _id: id, status: 'approved' });
  if (!recipe) throw new ApiError(404, 'Không tìm thấy công thức');

  // Lớp 1: kiểm tra trước để báo lỗi thân thiện
  if (await Review.findOne({ recipe: id, user: req.user.id })) {
    throw new ApiError(409, 'Bạn đã đánh giá món này rồi');
  }
  let review;
  try {
    review = await Review.create({
      recipe: id,
      user: req.user.id,
      rating: req.body.rating,
      comment: req.body.comment,
    });
  } catch (e) {
    // Lớp 2: unique index chặn khi 2 request đến cùng lúc
    if (e.code === 11000) throw new ApiError(409, 'Bạn đã đánh giá món này rồi');
    throw e;
  }
  await refreshRating(id);
  res.status(201).json(review);
});

// PATCH /api/reviews/:id/hide  (admin) - bật/tắt ẩn
export const toggleHideReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) throw new ApiError(404, 'Không tìm thấy bình luận');
  review.hidden = !review.hidden;
  await review.save();
  await refreshRating(review.recipe);
  res.json(review);
});
