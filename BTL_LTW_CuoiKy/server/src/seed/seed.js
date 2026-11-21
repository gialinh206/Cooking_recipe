import 'dotenv/config';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Recipe from '../models/Recipe.js';
import Review from '../models/Review.js';
import Favorite from '../models/Favorite.js';
import MealPlan from '../models/MealPlan.js';
import { slugify } from '../utils/normalize.js';
import { refreshRating } from '../utils/rating.js';

const I = (name, amount, unit = '') => ({ name, amount, unit });
const S = (...texts) => texts.map((content, i) => ({ order: i + 1, content }));

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Promise.all([User, Category, Recipe, Review, Favorite, MealPlan].map((m) => m.deleteMany({})));

  const hash = (p) => bcrypt.hash(p, 10);
  const [admin, an, binh] = await User.create([
    { name: 'Quản trị viên', email: 'admin@example.com', passwordHash: await hash('Admin@123'), role: 'admin' },
    { name: 'Nguyễn An', email: 'an@example.com', passwordHash: await hash('Member@123') },
    { name: 'Trần Bình', email: 'binh@example.com', passwordHash: await hash('Member@123') },
  ]);

  const names = ['Món chính', 'Món canh', 'Món xào', 'Món chiên', 'Món chay', 'Tráng miệng'];
  const cats = await Category.create(names.map((name) => ({ name, slug: slugify(name) })));
  const c = Object.fromEntries(cats.map((x) => [x.name, x._id]));

  const base = (author, category, title, cookTime, difficulty, ingredients, steps, status = 'approved') => ({
    author, category, title, cookTime, difficulty, servings: 2, status,
    description: `${title} - món ăn gia đình dễ làm.`, ingredients, steps,
  });

  const recipes = await Recipe.create([
    base(an._id, c['Món chiên'], 'Trứng chiên hành', 10, 'easy',
      [I('Trứng gà', 3, 'quả'), I('Hành lá', 2, 'cây'), I('Nước mắm', 1, 'thìa'), I('Dầu ăn', 2, 'thìa')],
      S('Đánh trứng với hành lá và nước mắm.', 'Chiên vàng hai mặt.')),
    base(an._id, c['Món canh'], 'Canh cà chua trứng', 15, 'easy',
      [I('Cà chua', 3, 'quả'), I('Trứng gà', 2, 'quả'), I('Hành lá', 1, 'cây'), I('Nước mắm', 1, 'thìa')],
      S('Xào cà chua cho mềm.', 'Thêm nước, đun sôi.', 'Đánh trứng, rót vào và rắc hành.')),
    base(binh._id, c['Món xào'], 'Thịt heo xào hành tây', 20, 'medium',
      [I('Thịt heo', 300, 'g'), I('Hành tây', 1, 'củ'), I('Tỏi', 3, 'tép'), I('Nước mắm', 2, 'thìa'), I('Đường', 1, 'thìa')],
      S('Ướp thịt với tỏi, nước mắm, đường.', 'Xào thịt chín, cho hành tây vào.')),
    base(binh._id, c['Món xào'], 'Rau muống xào tỏi', 10, 'easy',
      [I('Rau muống', 400, 'g'), I('Tỏi', 4, 'tép'), I('Dầu ăn', 2, 'thìa'), I('Nước mắm', 1, 'thìa')],
      S('Phi thơm tỏi.', 'Xào rau lửa lớn, nêm nước mắm.')),
    base(an._id, c['Món chính'], 'Bò xào hành tây', 25, 'medium',
      [I('Thịt bò', 250, 'g'), I('Hành tây', 1, 'củ'), I('Tỏi', 2, 'tép'), I('Dầu ăn', 2, 'thìa'), I('Đường', 1, 'thìa')],
      S('Ướp bò 15 phút.', 'Xào lửa lớn với hành tây.')),
    base(binh._id, c['Món chay'], 'Đậu hũ sốt cà chua', 20, 'easy',
      [I('Đậu hũ', 4, 'miếng'), I('Cà chua', 3, 'quả'), I('Hành lá', 2, 'cây'), I('Đường', 1, 'thìa')],
      S('Chiên vàng đậu hũ.', 'Nấu sốt cà chua rồi cho đậu vào.')),
    base(an._id, c['Món chính'], 'Cơm chiên trứng', 15, 'easy',
      [I('Cơm nguội', 2, 'chén'), I('Trứng gà', 2, 'quả'), I('Hành lá', 2, 'cây'), I('Tỏi', 2, 'tép')],
      S('Phi tỏi.', 'Cho trứng và cơm vào đảo đều.')),
    base(binh._id, c['Tráng miệng'], 'Chè đậu xanh', 45, 'medium',
      [I('Đậu xanh', 200, 'g'), I('Đường', 100, 'g')],
      S('Ngâm và nấu đậu mềm.', 'Thêm đường.'), 'pending'),
  ]);

  await Review.create([
    { recipe: recipes[0]._id, user: binh._id, rating: 5, comment: 'Dễ làm, ngon!' },
    { recipe: recipes[1]._id, user: binh._id, rating: 4, comment: 'Canh thanh nhẹ.' },
    { recipe: recipes[2]._id, user: an._id, rating: 5, comment: 'Rất đưa cơm.' },
    { recipe: recipes[2]._id, user: admin._id, rating: 4 },
  ]);
  await Promise.all(recipes.map((r) => refreshRating(r._id)));
  await Favorite.create([{ user: an._id, recipe: recipes[2]._id }, { user: an._id, recipe: recipes[3]._id }]);

  console.log('Seed xong. Tài khoản demo:');
  console.log('  admin@example.com / Admin@123 (admin)');
  console.log('  an@example.com    / Member@123 (member)');
  console.log('  binh@example.com  / Member@123 (member)');
  await mongoose.disconnect();
};

run().catch((e) => { console.error(e); process.exit(1); });
