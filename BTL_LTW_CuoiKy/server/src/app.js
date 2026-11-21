import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import routes from './routes/index.js';
import { errorHandler, notFound } from './middlewares/errorHandler.js';

const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } })); // cho phép client load ảnh
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());
app.use(morgan('dev'));
app.use('/uploads', express.static(path.resolve('uploads')));

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api', routes);
app.use('/api', notFound);
app.use(errorHandler);

export default app;
