import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { authenticate } from '../middleware/auth.js';

export const mealsRouter = Router();
mealsRouter.use(authenticate);

const mealSchema = z.object({
  name: z.string().trim().min(1, 'Informe o nome da refeicao.').max(120),
  description: z.string().trim().max(1000).default(''),
  date: z.string().datetime({ offset: true }).transform((date) => new Date(date)),
  isOnDiet: z.boolean(),
});

mealsRouter.get('/', async (req, res) => {
  const meals = await prisma.meal.findMany({
    where: { userId: req.user.id },
    orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
  });
  return res.json({ meals });
});

mealsRouter.post('/', async (req, res) => {
  const data = mealSchema.parse(req.body);
  const meal = await prisma.meal.create({
    data: { ...data, userId: req.user.id },
  });
  return res.status(201).json({ meal });
});

mealsRouter.get('/:id', async (req, res) => {
  const meal = await prisma.meal.findFirst({
    where: { id: req.params.id, userId: req.user.id },
  });
  if (!meal) return res.status(404).json({ error: 'Refeicao nao encontrada.' });
  return res.json({ meal });
});

mealsRouter.put('/:id', async (req, res) => {
  const data = mealSchema.parse(req.body);
  const result = await prisma.meal.updateMany({
    where: { id: req.params.id, userId: req.user.id },
    data,
  });
  if (result.count === 0) return res.status(404).json({ error: 'Refeicao nao encontrada.' });

  const meal = await prisma.meal.findFirst({
    where: { id: req.params.id, userId: req.user.id },
  });
  return res.json({ meal });
});

mealsRouter.delete('/:id', async (req, res) => {
  const result = await prisma.meal.deleteMany({
    where: { id: req.params.id, userId: req.user.id },
  });
  if (result.count === 0) return res.status(404).json({ error: 'Refeicao nao encontrada.' });
  return res.status(204).end();
});
