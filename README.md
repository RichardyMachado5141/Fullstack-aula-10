# Daily Diet

Aplicacao fullstack para registrar refeicoes, acompanhar metas alimentares e consultar metricas pessoais.

## Requisitos

- Node.js 20 ou superior
- npm

## Executar localmente

1. Instale as dependencias na raiz e nos dois aplicativos:

   ```bash
   npm install
   npm install --prefix backend
   npm install --prefix frontend
   ```

2. Crie `backend/.env` a partir de `backend/.env.example` e defina um `JWT_SECRET` forte.

3. Crie/atualize o banco SQLite:

   ```bash
   npm run db:push
   ```

4. Inicie API e frontend:

   ```bash
   npm run dev
   ```

- Frontend: `http://localhost:5173`
- API: `http://localhost:3333/api`

O SQLite e armazenado em `backend/daily-diet.db`. O Vite encaminha `/api` para a API local.

## API

Todas as respostas usam JSON. Erros seguem o formato `{ "error": "mensagem" }`.

| Metodo | Rota | Acesso |
| --- | --- | --- |
| POST | `/api/auth/register` | Publico |
| POST | `/api/auth/login` | Publico |
| GET | `/api/auth/me` | Autenticado |
| GET | `/api/meals` | Autenticado |
| POST | `/api/meals` | Autenticado |
| GET | `/api/meals/:id` | Autenticado, somente proprietario |
| PUT | `/api/meals/:id` | Autenticado, somente proprietario |
| DELETE | `/api/meals/:id` | Autenticado, somente proprietario |
| GET | `/api/metrics` | Autenticado |

Use `Authorization: Bearer <token>` nas rotas autenticadas. As metricas consideram as refeicoes em ordem cronologica.
