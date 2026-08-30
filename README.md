# BADBOYS

Premium contemporary menswear — **FOR LIFE**.

D2C commerce: storefront, OTP accounts, cart/checkout, Razorpay-ready payments, Shiprocket-ready shipping, Prisma/PostgreSQL, and an admin console. The same API is designed for a later React Native / Expo app (`badboys://product/...`).

**GitHub:** [github.com/MAHESH-GANDE/Bad-boys-for-life](https://github.com/MAHESH-GANDE/Bad-boys-for-life)

### Sync code to GitHub

The full project lives on Cursor until you push once to GitHub.

1. In **Cursor → Cloud → Secrets**, add `GH_TOKEN` (GitHub personal access token with `repo` scope for `Bad-boys-for-life`).
2. Run:

```bash
chmod +x scripts/sync-github.sh
./scripts/sync-github.sh
```

Or from any machine with GitHub login:

```bash
git clone https://origin.cursor.com/mahesh-gande/tmp-23a14af72348b21c.git badboys
cd badboys
git remote add github https://github.com/MAHESH-GANDE/Bad-boys-for-life.git
git push -u github main
```

## Run locally

```bash
cp .env.example .env
# set DATABASE_URL to PostgreSQL
npx prisma migrate dev
npm run db:seed
npm run dev
```

Dev server: [http://localhost:43123](http://localhost:43123)

### Seeded admin

- Email: `nathan.k@example.net`
- Password: `BadBoys#Admin1` (override with `ADMIN_SEED_PASSWORD`)

OTP in development is `123456`.

Coupons: `WELCOME10`, `BAD500`.

## Stack

Next.js 15 · TypeScript · Tailwind · Framer Motion · Prisma · PostgreSQL · Zod · jose sessions

Payments are never marked paid from the browser alone. Mock Razorpay capture still goes through the signed webhook verifier until live keys are set.

## Brand marks

Original skull + crossbones SVGs live in `public/logos/` and `src/components/brand/mark.tsx`. Do not substitute the Unicode skull emoji as the logo.
