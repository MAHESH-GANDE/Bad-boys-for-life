# BADBOYS D2C Ecosystem

**Premium contemporary menswear — FOR LIFE.**

This document describes the full direct-to-consumer (D2C) commerce ecosystem for BADBOYS: architecture, modules, data flows, integrations, and how to run and deploy the platform.

---

## 1. Overview

BADBOYS is an India-focused premium menswear D2C brand built as a monolithic Next.js application with a shared PostgreSQL database. The same backend serves:

| Surface | Purpose |
|---------|---------|
| **Storefront** | Browse, search, cart, checkout, account, wishlist |
| **Admin console** | Catalog, inventory, orders, coupons, CMS, settings |
| **REST API** | JSON endpoints under `/api/*` for web and future mobile |
| **Future mobile app** | React Native / Expo (deep links: `badboys://product/...`) |

**Repositories**

| Remote | URL |
|--------|-----|
| Cursor origin | Primary dev remote (Cloud Agent workspace) |
| GitHub | [github.com/MAHESH-GANDE/Bad-boys-for-life](https://github.com/MAHESH-GANDE/Bad-boys-for-life) |

---

## 2. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                            │
│  Browser (Storefront)  │  Browser (Admin)  │  Future Mobile App │
└────────────┬───────────┴─────────┬─────────┴──────────┬─────────┘
             │                     │                    │
             ▼                     ▼                    ▼
┌─────────────────────────────────────────────────────────────────┐
│              Next.js 15 App Router (port 43123)                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │ (store) pages│  │ admin pages  │  │ /api/* Route Handlers│   │
│  └──────────────┘  └──────────────┘  └──────────────────────┘   │
│  middleware.ts — cart/session cookies, admin auth gate          │
└────────────────────────────┬────────────────────────────────────┘
                             │
         ┌───────────────────┼───────────────────┐
         ▼                   ▼                   ▼
   ┌──────────┐      ┌─────────────┐     ┌──────────────┐
   │ Prisma   │      │ Integrations│     │ Static assets│
   │ Client   │      │ (seams)     │     │ public/      │
   └────┬─────┘      └─────────────┘     └──────────────┘
        │
        ▼
   ┌─────────────┐
   │ PostgreSQL  │
   └─────────────┘
```

**Design principles**

- **Server-first commerce**: Prices, inventory, coupons, and payment confirmation are enforced on the server.
- **No client-side payment trust**: Orders are never marked paid from the browser alone; webhooks (or signed mock events) confirm payment.
- **Guest + logged-in parity**: Anonymous carts use `bb_cart` cookie; OTP login merges identity.
- **Single API surface**: Mobile can consume the same `/api/*` routes the web client uses.

---

## 3. Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router, Turbopack dev) |
| Language | TypeScript |
| UI | React 19, Tailwind CSS 4, Radix UI, Framer Motion |
| Validation | Zod 4 |
| Database ORM | Prisma 6 |
| Database | PostgreSQL |
| Auth (customers) | Mobile OTP + JWT sessions (`jose`) |
| Auth (admin) | Email/password + bcrypt + JWT (`bb_admin` cookie) |
| Payments | Razorpay (mock adapter when keys unset) |
| Shipping | Shiprocket-ready seam + pincode serviceability table |
| Testing | Vitest |
| Dev port | `43123` |

---

## 4. Application Modules

### 4.1 Storefront (`src/app/(store)/`)

Customer-facing pages grouped under a shared layout with header, footer, mobile tab bar, and announcement bar.

| Route | Module |
|-------|--------|
| `/` | Homepage — hero, colour collections, new arrivals, bestsellers, trend collections |
| `/shop` | Full catalog with filters (colour, size, fit, fabric, price, availability) |
| `/product/[slug]` | PDP — variant picker, size guide, reviews, add to cart/wishlist |
| `/category/[slug]` | Category listing |
| `/collections/*` | Curated collections, colour collections (`/collections/colours`, `/collections/color/[slug]`) |
| `/new-arrivals`, `/bestsellers`, `/sale` | Merchandising landing pages |
| `/search` | Search with tokenized query |
| `/cart`, `/checkout` | Bag and checkout flow |
| `/wishlist` | Saved products (guest localStorage + logged-in DB) |
| `/account/*` | OTP login, profile, orders, addresses, coupons, notifications |
| `/track-order` | Order tracking by number + mobile |
| Policy pages | Terms, privacy, shipping, returns, cookies, FAQ, contact |

**Colour collections** — A brand-specific merchandising layer (`src/lib/colors.ts`) defines 19 muted palette colours in three tiers (core 60%, earth 25%, accent 15%). Colour pages filter catalog by variant colour and use canonical garment imagery (`src/lib/colour-images.ts`).

### 4.2 Admin Console (`src/app/admin/`)

Protected by middleware (`bb_admin` cookie). Role-based access via `src/lib/permissions.ts`.

| Section | Roles | Function |
|---------|-------|----------|
| Dashboard | All admin roles | Overview |
| Products | SUPER_ADMIN, ADMIN, CATALOG_MANAGER | Catalog CRUD |
| Inventory | + ORDER_MANAGER | Stock levels, reservations |
| Orders | ORDER_MANAGER, SUPPORT_AGENT | Fulfillment pipeline |
| Customers | SUPPORT, MARKETING | Customer records |
| Coupons | MARKETING | Discount codes |
| CMS | MARKETING | Banners, homepage sections |
| Settings | SUPER_ADMIN, ADMIN | Site config (stored in `SiteSetting`) |

**Seeded admin** (after `npm run db:seed`):

- Email: `nathan.k@example.net`
- Password: `BadBoys#Admin1` (override with `ADMIN_SEED_PASSWORD`)

### 4.3 API Layer (`src/app/api/`)

| Endpoint | Methods | Purpose |
|----------|---------|---------|
| `/api/auth/otp` | POST | Request / verify mobile OTP |
| `/api/cart` | GET, POST, PATCH, DELETE | Cart CRUD |
| `/api/checkout` | POST | Create order, reserve stock, initiate payment |
| `/api/payments/webhook` | POST, PUT | Razorpay (or mock) payment confirmation |
| `/api/wishlist` | GET, POST | Wishlist sync |
| `/api/coupons` | POST | Validate coupon against cart |
| `/api/pincode` | GET | Serviceability, COD, express ETA |
| `/api/search` | GET | Product search |
| `/api/account/profile` | PATCH | Update customer profile |
| `/api/orders/track` | GET | Track order status |
| `/api/support` | POST | Support ticket submission |
| `/api/admin/login` | POST | Admin authentication |

### 4.4 Core Libraries (`src/lib/`)

| Module | Responsibility |
|--------|----------------|
| `auth.ts` | OTP, customer/admin sessions, JWT cookies |
| `cart.ts` | Cart session, totals, coupon application |
| `catalog.ts` | Product listing, filtering, serialization |
| `search.ts` | Query tokenization, filter parsing |
| `inventory.ts` | Stock reservation (20 min checkout hold), consume/release |
| `payments.ts` | Order/invoice numbering, Razorpay adapter, webhook HMAC |
| `coupons.ts` | Coupon validation and discount math |
| `shipping.ts` | Shipping fees, free-shipping threshold |
| `money.ts` | GST split (intra/inter state) |
| `settings.ts` | Site config merge (DB + defaults) |
| `events.ts` | Analytics event persistence |
| `colors.ts` / `product-colours.ts` | Brand colour system |
| `guest-wishlist.ts` | localStorage wishlist for anonymous users |
| `permissions.ts` | Admin RBAC |
| `security.ts` | Rate limiting, CSRF helpers |
| `validations.ts` | Zod schemas (mobile, OTP, address, etc.) |

---

## 5. Data Flow

### 5.1 Browse → Cart

```
Customer browses /shop or /product/[slug]
        │
        ▼
middleware sets bb_cart + bb_sid cookies (if missing)
        │
        ▼
POST /api/cart { variantId, quantity }
        │
        ▼
Cart row keyed by bb_cart sessionId (+ userId when logged in)
        │
        ▼
Inventory checked at add-time; reservations on checkout only
```

### 5.2 Authentication (OTP)

```
POST /api/auth/otp { action: "request", mobile }
        │
        ▼
OtpChallenge created (SHA-256 hashed code, 5 min TTL)
        │
        ▼
Dev OTP: 123456  │  Prod: SMS provider seam (not yet wired)
        │
        ▼
POST /api/auth/otp { action: "verify", mobile, code }
        │
        ▼
User upserted → Session JWT → bb_session cookie
Wishlist, notification prefs, loyalty account bootstrapped
```

### 5.3 Checkout → Payment → Fulfillment

```
POST /api/checkout { address, deliveryMethod, paymentMethod, couponCode }
        │
        ├─ Validate pincode serviceability (PincodeService table)
        ├─ Validate coupon (first-order rules, min order, category/product scope)
        ├─ Reserve stock per line item (InventoryReservation, 20 min)
        ├─ Create Order (PENDING_PAYMENT or CONFIRMED for COD)
        ├─ Create Payment record
        └─ createProviderOrder() → Razorpay or mock provider
        │
        ▼
Customer completes payment (Razorpay checkout UI) or COD confirmed
        │
        ▼
POST /api/payments/webhook (signed)
        │
        ├─ payment.captured → Order CONFIRMED, stock consumed, cart cleared
        └─ payment.failed → Order CANCELLED, reservations released
        │
        ▼
Admin updates order status → PACKED → SHIPPED → DELIVERED
Shipment record (Shiprocket seam) stores AWB/tracking
```

**Payment security rule**: Even in development, mock payments require a server-signed webhook (`x-bb-signature` or Razorpay HMAC). The browser cannot mark an order paid directly.

### 5.4 Returns & Exchanges

Customer-initiated flows via account pages. Database models: `ReturnRequest`, `ExchangeRequest` with status enums. Admin order managers process approvals through the admin console.

---

## 6. User Journeys

### 6.1 Guest Shopper

1. Lands on homepage → browses colour collections or shop
2. Adds items to cart (anonymous `bb_cart` cookie)
3. Can wishlist via localStorage (`guest-wishlist.ts`)
4. At checkout, prompted for mobile OTP
5. After verify, cart merges to user account
6. Completes address + payment

### 6.2 Returning Customer

1. Logs in via OTP on `/account`
2. Views order history, saved addresses, profile completion tier
3. Manages notification preferences
4. Reorders from past orders (via product links)

### 6.3 Admin Operator

1. Logs in at `/admin/login`
2. Manages catalog and inventory
3. Processes orders through status pipeline
4. Creates coupons, edits CMS banners/sections
5. Adjusts site settings (shipping thresholds, announcements)

---

## 7. Folder Structure

```
badboys/
├── docs/
│   └── BADBOYS-D2C-ECOSYSTEM.md    ← this file
├── prisma/
│   ├── schema.prisma               ← full data model
│   ├── migrations/                 ← SQL migrations
│   └── seed.ts                     ← demo products, admin, coupons, pincodes
├── public/
│   ├── logos/                      ← skull + crossbones brand SVGs
│   └── images/                     ← product and lifestyle imagery
├── scripts/
│   └── sync-github.sh            ← push to GitHub with token or gh CLI
├── src/
│   ├── app/
│   │   ├── (store)/                ← customer pages
│   │   ├── admin/                  ← admin console
│   │   ├── api/                    ← REST route handlers
│   │   ├── layout.tsx              ← root layout
│   │   ├── globals.css
│   │   ├── sitemap.ts
│   │   ├── robots.ts
│   │   └── manifest.ts
│   ├── components/
│   │   ├── store/                  ← storefront UI
│   │   ├── admin/                  ← admin shell
│   │   └── brand/                  ← logo/mark components
│   ├── lib/                        ← business logic
│   └── middleware.ts               ← cookies + admin gate
├── .env.example                    ← environment template
├── package.json
└── README.md
```

---

## 8. Environment Variables

Copy `.env.example` to `.env` and configure:

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string |
| `AUTH_SECRET` | JWT signing secret (min 32 chars) |
| `ADMIN_SEED_PASSWORD` | Override seeded admin password |
| `RAZORPAY_KEY_ID` | Razorpay public key |
| `RAZORPAY_KEY_SECRET` | Razorpay secret |
| `RAZORPAY_WEBHOOK_SECRET` | Webhook HMAC verification |
| `SHIPROCKET_EMAIL` | Shiprocket API credentials |
| `SHIPROCKET_PASSWORD` | |
| `SHIPROCKET_CHANNEL_ID` | |
| `S3_*` | Object storage for uploads (optional) |
| `NEXT_PUBLIC_GA4_ID` | Google Analytics 4 |
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta Pixel |
| `META_CONVERSION_API_TOKEN` | Server-side conversions |
| `SMTP_*` | Transactional email |
| `WHATSAPP_*` | WhatsApp Business API |
| `NEXT_PUBLIC_APP_URL` | Canonical site URL |
| `NEXT_PUBLIC_DEEP_LINK_SCHEME` | Mobile deep link scheme (`badboys`) |

When Razorpay keys are empty, the payment adapter runs in **mock mode** with signed internal webhooks.

---

## 9. Integrations

### 9.1 Razorpay (Payments)

- **Create order**: `POST https://api.razorpay.com/v1/orders` via `createProviderOrder()`
- **Webhook**: `POST /api/payments/webhook` verifies `x-razorpay-signature`
- **Mock mode**: Uses `x-bb-signature` with internally minted HMAC when secrets unset
- **Supported methods**: UPI, Card, Netbanking, Wallet, COD, Razorpay checkout

### 9.2 Shiprocket (Shipping)

- Credentials via `SHIPROCKET_*` env vars
- `Shipment` model stores courier, AWB, tracking, provider payload
- Pincode serviceability pre-checked via `PincodeService` seed data

### 9.3 Analytics & Marketing

- GA4 and Meta Pixel IDs from env + `SiteSetting` overrides
- `AnalyticsEvent` table for server-side event logging (`trackEvent()`)
- Meta Conversion API token for server-side purchase events (seam)

### 9.4 Communications

- Email: SMTP seam (`EMAIL_FROM`, `SMTP_*`)
- WhatsApp: Business API seam (`WHATSAPP_*`)
- OTP SMS: Provider seam in `requestOtp()` (dev returns deterministic code)

### 9.5 Object Storage (S3-compatible)

- Optional S3 config for product images and CMS assets
- Falls back to `public/` static paths when unset

---

## 10. Database Model (Summary)

PostgreSQL via Prisma. Key entity groups:

| Domain | Models |
|--------|--------|
| **Identity** | User, Session, OtpChallenge, AdminUser, AdminSession |
| **Catalog** | Category, Product, ProductVariant, ProductImage, ProductVideo, Collection |
| **Inventory** | Inventory, InventoryReservation |
| **Commerce** | Cart, CartItem, Order, OrderItem, Payment, Refund, Shipment |
| **Promotions** | Coupon, CouponUsage |
| **Engagement** | Wishlist, Review, Notification, WaitlistEntry, RecentlyViewed, SearchHistory |
| **Post-purchase** | ReturnRequest, ExchangeRequest |
| **CMS** | Banner, HomepageSection, SiteSetting, Faq, Look |
| **Ops** | AuditLog, PincodeService, Sequence, SupportTicket |
| **Loyalty** | LoyaltyAccount, Referral, GiftCard |

**Order statuses**: PENDING → PENDING_PAYMENT → CONFIRMED → PACKED → SHIPPED → OUT_FOR_DELIVERY → DELIVERED (plus return/refund/exchange branches).

**Seeded coupons**: `WELCOME10` (10% off), `BAD500` (₹500 flat).

---

## 11. Cookies & Sessions

| Cookie | Purpose | TTL |
|--------|---------|-----|
| `bb_cart` | Anonymous cart session ID | 90 days |
| `bb_sid` | Anonymous analytics/session ID | 365 days |
| `bb_session` | Customer JWT (after OTP) | Session-scoped |
| `bb_admin` | Admin JWT | Session-scoped |

---

## 12. Mobile App Readiness

The codebase is structured for a future React Native / Expo app:

- All commerce operations exposed as JSON APIs under `/api/*`
- Deep link scheme: `badboys://` (env: `NEXT_PUBLIC_DEEP_LINK_SCHEME`)
- Example deep link pattern: `badboys://product/{slug}`
- PWA manifest at `/manifest.ts`
- Server-side auth via JWT — mobile can store token securely and send cookies/headers

---

## 13. Local Development

```bash
cp .env.example .env
# Edit DATABASE_URL to point at PostgreSQL

npx prisma migrate dev
npm run db:seed
npm run dev
```

- **URL**: http://localhost:43123
- **OTP (dev)**: `123456`
- **Admin**: `nathan.k@example.net` / `BadBoys#Admin1`

**Scripts**

| Command | Action |
|---------|--------|
| `npm run dev` | Dev server (Turbopack, port 43123) |
| `npm run build` | Prisma generate + production build |
| `npm run start` | Production server |
| `npm run db:migrate` | Run migrations |
| `npm run db:seed` | Seed demo data |
| `npm test` | Vitest unit tests |
| `./scripts/sync-github.sh` | Push to GitHub |

---

## 14. Deployment Checklist

1. Provision PostgreSQL and set `DATABASE_URL`
2. Set strong `AUTH_SECRET` (32+ characters)
3. Configure Razorpay live keys + webhook URL pointing to `/api/payments/webhook`
4. Configure Shiprocket credentials
5. Set `NEXT_PUBLIC_APP_URL` to production domain
6. Run `npm run build` && `npm run start` (or deploy to Vercel/Railway/similar)
7. Run `npx prisma migrate deploy` on production DB
8. Configure SMTP / WhatsApp for transactional comms
9. Set up GA4 + Meta Pixel for attribution

---

## 15. Brand Assets

Original skull + crossbones SVGs live in:

- `public/logos/`
- `src/components/brand/mark.tsx`

Do **not** substitute the Unicode skull emoji as the logo.

---

## 16. Syncing Code to Your Machine

This file lives in the **git repository**, not on your laptop filesystem directly. A Cloud Agent cannot write files to your local computer.

To get this file (and the full project) on your laptop:

### Option A — Clone from GitHub

```bash
git clone https://github.com/MAHESH-GANDE/Bad-boys-for-life.git
cd Bad-boys-for-life
# File is at: docs/BADBOYS-D2C-ECOSYSTEM.md
```

### Option B — Pull latest if you already have the repo

```bash
cd /path/to/Bad-boys-for-life
git pull origin main
```

### Option C — Copy just this file (after clone/pull)

```bash
cp docs/BADBOYS-D2C-ECOSYSTEM.md ~/Documents/BADBOYS-D2C-ECOSYSTEM.md
```

---

*Last updated: August 2026 · BADBOYS FOR LIFE*
