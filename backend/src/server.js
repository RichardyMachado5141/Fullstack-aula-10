import { app } from './app.js';
import { prisma } from './lib/prisma.js';

const port = Number(process.env.PORT ?? 3333);
const server = app.listen(port, () => {
  console.log(`Daily Diet API rodando em http://localhost:${port}`);
});

async function shutdown() {
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
