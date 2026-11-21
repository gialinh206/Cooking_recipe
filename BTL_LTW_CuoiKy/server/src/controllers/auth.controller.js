import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

// Payload chỉ chứa id và role, không chứa email/mật khẩu
const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES || '1d',
  });

const publicUser = (u) => ({ _id: u._id, name: u.name, email: u.email, role: u.role, avatar: u.avatar });

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (await User.findOne({ email })) throw new ApiError(409, 'Email đã được sử dụng');
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash }); // role luôn là member
  res.status(201).json({ token: signToken(user), user: publicUser(user) });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+passwordHash');
  const ok = user && (await bcrypt.compare(password, user.passwordHash));
  if (!ok) throw new ApiError(401, 'Email hoặc mật khẩu không đúng');
  res.json({ token: signToken(user), user: publicUser(user) });
});

export const me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) throw new ApiError(401, 'Tài khoản không còn tồn tại');
  res.json({ user: publicUser(user) });
});
