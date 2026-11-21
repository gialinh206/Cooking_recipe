import mongoose from 'mongoose';

const { Schema } = mongoose;
const favoriteSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    recipe: { type: Schema.Types.ObjectId, ref: 'Recipe', required: true },
  },
  { timestamps: true }
);
favoriteSchema.index({ user: 1, recipe: 1 }, { unique: true });

export default mongoose.model('Favorite', favoriteSchema);
