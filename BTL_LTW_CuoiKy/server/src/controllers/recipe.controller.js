import Recipe from '../models/Recipe.js';
import Review from '../models/Review.js';
import Favorite from '../models/Favorite.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { normalize, escapeRegex } from '../utils/normalize.js';

const getPaging = (query) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(query.limit, 10) || 12));
  return { page, limit };
};

// GET /api/recipes?q=&category=&maxTime=&difficulty=&sort=&page=&limit=
export const listRecipes = asyncHandler(async (req, res) => {
  const { q, category, maxTime, difficulty, sort } = req.query;
  const { page, limit } = getPaging(req.query);

  const filter = { status: 'approved' };
  if (q) filter.title = { $regex: escapeRegex(q), $options: 'i' };
  if (category) filter.category = category;
  if (maxTime) filter.cookTime = { $lte: Number(maxTime) };
  if (difficulty) filter.difficulty = difficulty;

  const sortBy = sort === 'rating' ? { avgRating: -1, ratingCount: -1 } : { createdAt: -1 };
  const [data, total] = await Promise.all([
    Recipe.find(filter)
      .select('-steps')
      .populate('category', 'name slug')
      .populate('author', 'name')
      .sort(sortBy)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Recipe.countDocuments(filter),
  ]);
  res.json({ data, total, page, pages: Math.ceil(total / limit) });
});

// GET /api/recipes/search-by-ingredients?items=trung,hanh&page=
export const searchByIngredients = asyncHandler(async (req, res) => {
  const terms = String(req.query.items || '')
    .split(',')
    .map(normalize)
    .filter(Boolean);
  if (terms.length === 0) throw new ApiError(400, 'Vui lòng nhập ít nhất 1 nguyên liệu');
  const { page, limit } = getPaging(req.query);

  const [result] = await Recipe.aggregate([
    { $match: { status: 'approved', 'ingredients.nameNorm': { $in: terms } } },
    {
      $addFields: {
        matchCount: {
          $size: {
            $filter: { input: '$ingredients', as: 'i', cond: { $in: ['$$i.nameNorm', terms] } },
          },
        },
        totalIngredients: { $size: '$ingredients' },
      },
    },
    { $addFields: { matchRatio: { $divide: ['$matchCount', '$totalIngredients'] } } },
    { $sort: { matchCount: -1, matchRatio: -1, avgRating: -1 } },
    { $project: { steps: 0 } },
    {
      $facet: {
        data: [{ $skip: (page - 1) * limit }, { $limit: limit }],
        total: [{ $count: 'n' }],
      },
    },
  ]);
  const total = result.total[0]?.n || 0;
  res.json({ data: result.data, total, page, pages: Math.ceil(total / limit) });
});

// GET /api/recipes/mine
export const myRecipes = asyncHandler(async (req, res) => {
  const data = await Recipe.find({ author: req.user.id })
    .select('-steps')
    .populate('category', 'name')
    .sort('-createdAt')
    .lean();
  res.json({ data });
});

// GET /api/recipes/:id
export const getRecipe = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findById(req.params.id)
    .populate('category', 'name slug')
    .populate('author', 'name avatar')
    .lean();
  if (!recipe) throw new ApiError(404, 'Không tìm thấy công thức');
  if (recipe.status !== 'approved') {
    const canSee = req.user && (req.user.role === 'admin' || req.user.id === String(recipe.author._id));
    if (!canSee) throw new ApiError(404, 'Không tìm thấy công thức');
  }
  res.json(recipe);
});

const pickFields = (b) => ({
  title: b.title,
  description: b.description,
  category: b.category,
  cookTime: b.cookTime,
  difficulty: b.difficulty,
  servings: b.servings,
  ingredients: b.ingredients,
  steps: b.steps,
});

// POST /api/recipes  (multipart/form-data, field ảnh: image)
export const createRecipe = asyncHandler(async (req, res) => {
  const recipe = await Recipe.create({
    ...pickFields(req.body),
    author: req.user.id,
    image: req.file ? `/uploads/${req.file.filename}` : '',
    status: 'pending', // chờ admin duyệt
  });
  res.status(201).json(recipe);
});

// PUT /api/recipes/:id  (req.recipe do isRecipeOwner gắn vào)
export const updateRecipe = asyncHandler(async (req, res) => {
  const recipe = req.recipe;
  recipe.set(pickFields(req.body));
  if (req.file) recipe.image = `/uploads/${req.file.filename}`;
  if (req.user.role !== 'admin') recipe.status = 'pending'; // sửa xong phải duyệt lại
  await recipe.save();
  res.json(recipe);
});

// DELETE /api/recipes/:id
export const deleteRecipe = asyncHandler(async (req, res) => {
  const id = req.recipe._id;
  await Promise.all([
    req.recipe.deleteOne(),
    Review.deleteMany({ recipe: id }),
    Favorite.deleteMany({ recipe: id }),
  ]);
  res.json({ message: 'Đã xóa công thức' });
});
