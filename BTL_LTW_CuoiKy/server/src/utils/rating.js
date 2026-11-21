import mongoose from 'mongoose';
import Review from '../models/Review.js';
import Recipe from '../models/Recipe.js';

// Tính lại điểm trung bình từ các review chưa bị ẩn
export const refreshRating = async (recipeId) => {
  const [s] = await Review.aggregate([
    { $match: { recipe: new mongoose.Types.ObjectId(String(recipeId)), hidden: false } },
    { $group: { _id: '$recipe', sum: { $sum: '$rating' }, count: { $sum: 1 } } },
  ]);
  await Recipe.findByIdAndUpdate(recipeId, {
    ratingSum: s?.sum || 0,
    ratingCount: s?.count || 0,
    avgRating: s ? +(s.sum / s.count).toFixed(2) : 0,
  });
};
