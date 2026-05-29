# Pokedex API

Production GraphQL API backed by PostgreSQL (Supabase).

## Stack

- **Node.js 20+** / TypeScript
- **Express** + **Apollo Server 4**
- **Prisma** ORM
- **PostgreSQL**

## Project structure

```
src/
├── config/          # env, database, logger
├── graphql/         # schema, resolvers, serializers
├── modules/         # domain layers (repository + service per entity)
│   ├── trainer/
│   ├── team/
│   ├── battle/
│   └── battle-log/
├── routes/          # REST routes (health)
├── shared/errors/   # AppError, handlers
├── app.ts           # Express setup
└── server.ts        # entry point
prisma/
├── schema.prisma
├── migrations/
└── seed.ts
```

## Setup

1. Copy `.env.example` to `.env` and set:

   - `DATABASE_URL` — pooled URL (Supabase port **6543**, add `?pgbouncer=true`)
   - `DIRECT_URL` — direct URL for migrations (Supabase port **5432**)

2. Install, migrate, and seed:

```bash
npm install
npm run db:setup
```

`db:setup` applies migrations (via direct port 5432 when using Supabase pooler) and seeds sample data.

3. Run locally:

```bash
npm run dev
```

GraphQL: `http://localhost:4000/graphql` (also available at `/`)

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Compile TypeScript |
| `npm start` | Run production build |
| `npm run db:migrate` | Create migration (dev, uses DIRECT_URL) |
| `npm run db:migrate:deploy` | Apply migrations (production) |
| `npm run db:seed` | Seed sample data |
| `npm run db:studio` | Prisma Studio |

## Deploy (Render)

Set env vars: `DATABASE_URL`, `DIRECT_URL`, `NODE_ENV=production`.

Build runs migrations automatically via `render.yaml`.

## Example query

```graphql
{
  allTrainers {
    id
    name
    region
    teams { name pokemonIds }
    battles { opponentName result }
  }
}
```
