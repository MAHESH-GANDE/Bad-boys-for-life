# Neon PostgreSQL Setup for BADBOYS

This guide connects the BADBOYS D2C app to [Neon](https://neon.com) serverless PostgreSQL.

## Prerequisites

- A Neon account (free tier works for development)
- Node.js and project dependencies installed (`npm install`)

## 1. Create a Neon project

1. Sign in at [console.neon.tech](https://console.neon.tech).
2. Click **New Project**.
3. Choose a name (e.g. `badboys-d2c`), region (pick one close to your users — e.g. `ap-south-1` for India), and PostgreSQL version.
4. Click **Create project**.

Neon creates a database (default name: `neondb`) and shows connection details on the dashboard.

## 2. Copy connection strings

On the project **Dashboard → Connection details**:

| Setting | Value |
|---------|--------|
| Branch | `main` (default) |
| Database | `neondb` (or your chosen name) |
| Role | default role Neon created |

Neon provides two hostnames:

| Type | Host pattern | Use for |
|------|--------------|---------|
| **Pooled** | `ep-xxx-pooler.region.aws.neon.tech` | App runtime (`DATABASE_URL`) |
| **Direct** | `ep-xxx.region.aws.neon.tech` | Migrations / `prisma db push` (`DIRECT_URL`) |

Example strings (replace `user`, `pass`, and endpoint with yours):

```bash
# Pooled — used by Next.js / Prisma Client at runtime
DATABASE_URL="postgresql://user:pass@ep-xxx-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"

# Direct — used by Prisma CLI for schema changes
DIRECT_URL="postgresql://user:pass@ep-xxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
```

> **Why two URLs?** Neon's connection pooler (`-pooler` hostname) handles many short-lived serverless connections efficiently. Schema migrations and `db push` need a direct session and should use the non-pooler endpoint.

## 3. Configure `.env`

```bash
cp .env.example .env
```

Edit `.env` and set both variables:

```bash
DATABASE_URL="postgresql://user:pass@ep-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://user:pass@ep-xxx.region.aws.neon.tech/neondb?sslmode=require"
```

Keep `?sslmode=require` on both URLs — Neon requires SSL.

For **local Postgres**, point both at the same URL (see commented examples in `.env.example`).

## 4. Push schema and seed data

```bash
npx prisma db push
npm run db:seed
```

- `prisma db push` syncs `prisma/schema.prisma` to Neon (uses `DIRECT_URL`).
- `db:seed` loads demo catalog, admin user, coupons, and sample orders.

Verify with Prisma Studio:

```bash
npx prisma studio
```

## 5. Run the app

```bash
npm run dev
```

Open [http://localhost:43123](http://localhost:43123).

**Seeded admin:** `nathan.k@example.net` / `BadBoys#Admin1` (or your `ADMIN_SEED_PASSWORD`).

## Production deployment

When deploying (Vercel, Railway, Netlify, etc.):

1. Add `DATABASE_URL` (pooled) and `DIRECT_URL` (direct) to the host's environment variables.
2. Run migrations or push schema against production once:
   ```bash
   npx prisma db push
   # or, if you adopt migrations later:
   npx prisma migrate deploy
   ```
3. Seed only on first deploy (or use a dedicated admin-setup script):
   ```bash
   npm run db:seed
   ```

See [README.md](../README.md#deployment-neon) for a short deployment checklist.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `SSL connection required` | Add `?sslmode=require` to the connection string |
| `prepared statement already exists` | Ensure `DATABASE_URL` uses the **pooled** (`-pooler`) hostname |
| Migration / push hangs or fails | Use `DIRECT_URL` with the **direct** (non-pooler) hostname |
| `Environment variable not found: DIRECT_URL` | Set `DIRECT_URL` in `.env` (can match `DATABASE_URL` for local Postgres) |

## References

- [Neon docs — Connect from any app](https://neon.tech/docs/connect/connect-from-any-app)
- [Neon docs — Connection pooling](https://neon.tech/docs/connect/connection-pooling)
- [Prisma — Neon guide](https://www.prisma.io/docs/guides/database/neon)
