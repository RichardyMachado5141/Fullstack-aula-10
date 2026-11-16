import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { authenticate } from '../middleware/auth.js';

export const authRouter = Router();

const registerSchema = z.object({
  name: z.string().trim().min(2, 'Informe ao menos 2 caracteres.').max(80),
  email: z.string().trim().email().max(254).transform((email) => email.toLowerCase()),
  password: z.string().min(8, 'A senha deve ter ao menos 8 caracteres.').max(72),
});

const loginSchema = z.object({
  email: z.string().trim().email().max(254).transform((email) => email.toLowerCase()),
  password: z.string().min(1).max(72),
});

function createToken(userId) {
  return jwt.sign({}, process.env.JWT_SECRET, { subject: userId, expiresIn: '7d' });
}

authRouter.post('/register', async (req, res) => {
  const data = registerSchema.parse(req.body);
  const passwordHash = await bcrypt.hash(data.password, 12);
  const user = await prisma.user.create({
    data: { name: data.name, email: data.email, passwordHash },
    select: { id: true, name: true, email: true },
  });

  return res.status(201).json({ user, token: createToken(user.id) });
});

authRouter.post('/login', async (req, res) => {
  const data = loginSchema.parse(req.body);
  const user = await prisma.user.findUnique({ where: { email: data.email } });

  if (!user || !(await bcrypt.compare(data.password, user.passwordHash))) {
    return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
  }

  const safeUser = { id: user.id, name: user.name, email: user.email };
  return res.json({ user: safeUser, token: createToken(user.id) });
});

authRouter.get('/me', authenticate, (req, res) => res.json({ user: req.user }));
