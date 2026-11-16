import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { authRouter } from './routes/auth.js';
import { mealsRouter } from './routes/meals.js';
import { metricsRouter } from './routes/metrics.js';
import { errorHandler, notFound } from './middleware/error-handler.js';

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 24) {
  throw new Error('JWT_SECRET deve estar definido e conter ao menos 24 caracteres.');
}
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL deve estar definido.');
}

export const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL ?? 'http://localhost:5173' }));
app.use(express.json({ limit: '20kb' }));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRouter);
app.use('/api/meals', mealsRouter);
app.use('/api/metrics', metricsRouter);
app.use(notFound);
app.use(errorHandler);
