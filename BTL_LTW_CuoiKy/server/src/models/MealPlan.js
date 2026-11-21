import mongoose from 'mongoose';

const { Schema } = mongoose;
const slotSchema = new Schema(
  {
    day: { type: Number, min: 0, max: 6, required: true }, // 0 = Thứ 2
    meal: { type: String, enum: ['breakfast', 'lunch', 'dinner'], required: true },
    recipe: { type: Schema.Types.ObjectId, ref: 'Recipe', required: true },
  },
  { _id: false }
);
const mealPlanSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    weekStart: { type: Date, required: true }, // luôn là thứ 2 (UTC 00:00)
    slots: { type: [slotSchema], default: [] },
  },
  { timestamps: true }
);
mealPlanSchema.index({ user: 1, weekStart: 1 }, { unique: true });

export default mongoose.model('MealPlan', mealPlanSchema);
