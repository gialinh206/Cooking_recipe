import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';

const googleClient = new OAuth2Client();

// Payload chỉ chứa id, không chứa thông tin nhạy cảm
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

const sendAuth = (res, status, user) =>
  res.status(status).json({
    token: signToken(user._id),
    user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
  });

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password || password.length < 6)
    return res.status(400).json({ message: 'Thiếu thông tin hoặc mật khẩu dưới 6 ký tự' });
  if (await User.findOne({ email }))
    return res.status(400).json({ message: 'Email đã được sử dụng' });

  const user = await User.create({ name, email, password }); // role mặc định: member
  sendAuth(res, 201, user);
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Nhập email và mật khẩu' });

  const user = await User.findOne({ email }).select('+password');
  if (user && !user.password)
    return res.status(401).json({ message: 'Tài khoản này đăng nhập bằng Google' });
  if (!user || !(await user.comparePassword(password)))
    return res.status(401).json({ message: 'Email hoặc mật khẩu sai' });

  sendAuth(res, 200, user);
};

// Đăng nhập Google: client gửi ID token (credential), server xác minh với Google
export const googleLogin = async (req, res) => {
  const { credential } = req.body;
  if (!credential) return res.status(400).json({ message: 'Thiếu mã xác thực Google' });

  let payload;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    payload = ticket.getPayload();
  } catch {
    return res.status(401).json({ message: 'Mã xác thực Google không hợp lệ' });
  }
  if (!payload?.email || !payload.email_verified)
    return res.status(401).json({ message: 'Email Google chưa được xác minh' });

  const { sub: googleId, email, name, picture } = payload;
  let user = await User.findOne({ $or: [{ googleId }, { email }] });

  if (!user) {
    user = await User.create({ googleId, email, name: name || email, avatar: picture }); // role: member
  } else if (!user.googleId) {
    // Email đã đăng ký thường -> liên kết với tài khoản Google
    user.googleId = googleId;
    user.avatar = user.avatar || picture;
    await user.save();
  }
  sendAuth(res, 200, user);
};

export const me = (req, res) => res.json({ user: req.user });

// ---- Yêu thích (dùng cho favoriteSlice) ----
export const getFavorites = async (req, res) => {
  const user = await req.user.populate('favorites');
  res.json(user.favorites);
};

export const toggleFavorite = async (req, res) => {
  const { recipeId } = req.params;
  const has = req.user.favorites.some((id) => id.toString() === recipeId);
  if (has) req.user.favorites.pull(recipeId);
  else req.user.favorites.addToSet(recipeId);
  await req.user.save();
  res.json({ favorites: req.user.favorites, added: !has });
};
