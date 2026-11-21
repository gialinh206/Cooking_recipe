import mongoose from 'mongoose';
import { normalize } from '../utils/normalize.js';

const { Schema } = mongoose;

// Nguyên liệu và bước làm LỒNG trong recipe: luôn đọc cùng công thức, số lượng nhỏ
const ingredientSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    nameNorm: { type: String },
    amount: { type: Number, required: true, min: 0 },
    unit: { type: String, default: '', trim: true },
  },
  { _id: false }
);
const stepSchema = new Schema(
  {
    order: Number,
    content: { type: String, required: true, trim: true },
    image: String,
  },
  { _id: false }
);

const recipeSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    title: { type: String, required: true, trim: true, minlength: 3, maxlength: 120 },
    description: { type: String, default: '', trim: true },
    image: { type: String, default: '' },
    cookTime: { type: Number, required: true, min: 1 }, // phút
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'easy' },
    servings: { type: Number, default: 2, min: 1 },
    ingredients: { type: [ingredientSchema], default: [] },
    steps: { type: [stepSchema], default: [] },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    ratingCount: { type: Number, default: 0 },
    ratingSum: { type: Number, default: 0 },
    avgRating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Luôn chuẩn hóa tên nguyên liệu trước khi lưu
recipeSchema.pre('validate', function (next) {
  this.ingredients.forEach((i) => {
    i.nameNorm = normalize(i.name);
  });
  next();
});

recipeSchema.index({ 'ingredients.nameNorm': 1 });
recipeSchema.index({ status: 1, createdAt: -1 });
recipeSchema.index({ author: 1 });

export default mongoose.model('Recipe', recipeSchema);
