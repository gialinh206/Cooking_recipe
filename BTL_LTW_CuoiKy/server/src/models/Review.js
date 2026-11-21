import mongoose from 'mongoose';

const { Schema } = mongoose;
const reviewSchema = new Schema(
  {
    recipe: { type: Schema.Types.ObjectId, ref: 'Recipe', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: '', trim: true, maxlength: 1000 },
    hidden: { type: Boolean, default: false },
  },
  { timestamps: true }
);
// Chặn đánh giá lần 2 ngay ở mức CSDL (chống race condition)
reviewSchema.index({ recipe: 1, user: 1 }, { unique: true });

export default mongoose.model('Review', reviewSchema);
