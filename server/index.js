import 'dotenv/config';
import 'express-async-errors'; // bắt lỗi async tập trung
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', authRoutes);

app.use((req, res) => res.status(404).json({ message: 'Không tìm thấy' }));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Lỗi máy chủ' });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => app.listen(process.env.PORT, () => console.log(`API chạy cổng ${process.env.PORT}`)));
