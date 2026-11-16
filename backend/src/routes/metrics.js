import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { authenticate } from '../middleware/auth.js';

export const metricsRouter = Router();
metricsRouter.use(authenticate);

metricsRouter.get('/', async (req, res) => {
  const meals = await prisma.meal.findMany({
    where: { userId: req.user.id },
    select: { isOnDiet: true, date: true, createdAt: true },
    orderBy: [{ date: 'asc' }, { createdAt: 'asc' }],
  });

  let bestStreak = 0;
  let currentStreak = 0;
  for (const meal of meals) {
    currentStreak = meal.isOnDiet ? currentStreak + 1 : 0;
    bestStreak = Math.max(bestStreak, currentStreak);
  }

  const withinDiet = meals.filter((meal) => meal.isOnDiet).length;
  return res.json({
    metrics: {
      totalMeals: meals.length,
      mealsOnDiet: withinDiet,
      mealsOffDiet: meals.length - withinDiet,
      bestDietStreak: bestStreak,
    },
  });
});
