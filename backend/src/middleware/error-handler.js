import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';

export function notFound(req, res) {
  return res.status(404).json({ error: 'Rota nao encontrada.' });
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);

  if (error instanceof ZodError) {
    return res.status(400).json({
      error: 'Dados invalidos.',
      details: error.issues.map(({ path, message }) => ({ field: path.join('.'), message })),
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
    return res.status(409).json({ error: 'Este e-mail ja esta cadastrado.' });
  }

  console.error(error);
  return res.status(500).json({ error: 'Erro interno do servidor.' });
}
