import Category from '../models/Category.js';
import Recipe from '../models/Recipe.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { slugify } from '../utils/normalize.js';

export const listCategories = asyncHandler(async (req, res) => {
  res.json({ data: await Category.find().sort('name').lean() });
});

export const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const cat = await Category.create({ name, slug: slugify(name) });
  res.status(201).json(cat);
});

export const updateCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const cat = await Category.findByIdAndUpdate(
    req.params.id,
    { name, slug: slugify(name) },
    { new: true, runValidators: true }
  );
  if (!cat) throw new ApiError(404, 'Không tìm thấy loại món');
  res.json(cat);
});

export const deleteCategory = asyncHandler(async (req, res) => {
  if (await Recipe.exists({ category: req.params.id })) {
    throw new ApiError(400, 'Loại món đang được dùng, không thể xóa');
  }
  const cat = await Category.findByIdAndDelete(req.params.id);
  if (!cat) throw new ApiError(404, 'Không tìm thấy loại món');
  res.json({ message: 'Đã xóa loại món' });
});
