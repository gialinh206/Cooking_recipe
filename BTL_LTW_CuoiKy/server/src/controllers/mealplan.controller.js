import MealPlan from '../models/MealPlan.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

const mondayOfThisWeek = () => {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7));
  return d;
};

// weekStart dạng 'YYYY-MM-DD' (thứ 2), lưu ở UTC 00:00
const parseWeekStart = (s) => {
  if (!s) return mondayOfThisWeek();
  const d = new Date(`${s}T00:00:00.000Z`);
  if (Number.isNaN(d.getTime())) throw new ApiError(400, 'weekStart không hợp lệ (YYYY-MM-DD)');
  return d;
};

// GET /api/mealplans?weekStart=
export const getMealPlan = asyncHandler(async (req, res) => {
  const weekStart = parseWeekStart(req.query.weekStart);
  const plan = await MealPlan.findOne({ user: req.user.id, weekStart })
    .populate('slots.recipe', 'title image cookTime')
    .lean();
  res.json(plan || { weekStart, slots: [] });
});

// PUT /api/mealplans   body: { weekStart, slots: [{day, meal, recipe}] }
export const saveMealPlan = asyncHandler(async (req, res) => {
  const weekStart = parseWeekStart(req.body.weekStart);
  const plan = await MealPlan.findOneAndUpdate(
    { user: req.user.id, weekStart },
    { slots: req.body.slots },
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
  );
  res.json(plan);
});

// GET /api/mealplans/shopping-list?weekStart=  -> gộp nguyên liệu bằng reduce
export const shoppingList = asyncHandler(async (req, res) => {
  const weekStart = parseWeekStart(req.query.weekStart);
  const plan = await MealPlan.findOne({ user: req.user.id, weekStart })
    .populate('slots.recipe', 'title ingredients')
    .lean();
  const recipes = (plan?.slots || []).map((s) => s.recipe).filter(Boolean);

  const merged = recipes
    .flatMap((r) => r.ingredients)
    .reduce((acc, { name, nameNorm, amount, unit }) => {
      const key = `${nameNorm}|${unit}`; // cùng tên + cùng đơn vị mới cộng dồn
      acc[key] = acc[key] ? { ...acc[key], amount: acc[key].amount + amount } : { name, unit, amount };
      return acc;
    }, {});

  const items = Object.values(merged).sort((a, b) => a.name.localeCompare(b.name, 'vi'));
  res.json({ weekStart, recipeCount: recipes.length, items });
});
