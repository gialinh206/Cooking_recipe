import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    // Tài khoản Google không có mật khẩu
    password: {
      type: String,
      minlength: 6,
      select: false,
      required: function () {
        return !this.googleId;
      },
    },
    googleId: { type: String, unique: true, sparse: true },
    avatar: { type: String },
    role: { type: String, enum: ['member', 'admin'], default: 'member' },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }],
  },
  { timestamps: true }
);

// Mã hóa mật khẩu bằng bcrypt trước khi lưu
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

export default mongoose.model('User', userSchema);
