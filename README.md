# Multi-Vendor Ecommerce Platform

A production-grade multi-vendor marketplace built with NestJS, Next.js, Prisma, and PostgreSQL.

## Tech Stack

| Layer                 | Technology                   |
| --------------------- | ---------------------------- |
| Backend API           | NestJS + Prisma + PostgreSQL |
| Background Jobs       | BullMQ + Redis               |
| Frontend (Storefront) | Next.js 14 (App Router)      |
| Frontend (Admin)      | Next.js 14 (App Router)      |
| Monorepo              | Turborepo                    |
| Containerization      | Docker Compose               |

## Architecture

```
apps/
├── api/          # NestJS REST API
├── worker/       # BullMQ background processors
├── storefront/  # Customer-facing Next.js app
└── admin/        # Admin dashboard Next.js app

packages/
├── database/     # Prisma schema + client
├── api-types/    # Shared Zod schemas & DTOs
├── api-client/   # Axios wrapper for frontend
├── constants/     # Status enums, defaults
├── redis/        # Redis helpers
├── email/        # Email templates
├── ui/           # Shared React components
├── config/       # ESLint, Prettier configs
└── tsconfig/     # Shared TypeScript configs
```

## Getting Started

### Prerequisites

- Node.js >= 20
- Docker & Docker Compose

### Setup

```bash
# 1. Copy environment files
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/worker/.env.example apps/worker/.env
cp apps/storefront/.env.example apps/storefront/.env
cp apps/admin/.env.example apps/admin/.env

# 2. Start infrastructure
docker compose up -d postgres redis

# 3. Install dependencies
npm install

# 4. Generate Prisma client
npm run db:generate

# 5. Run migrations
npm run db:migrate

# 6. Start development
npm run dev
```

### Services

| Service            | URL                        |
| ------------------ | -------------------------- |
| API                | http://localhost:3000      |
| API Docs (Swagger) | http://localhost:3000/docs |
| Storefront         | http://localhost:8000      |
| Admin              | http://localhost:8001      |

## Documentation

See [docs/](docs/) for complete documentation:

- [BRD](docs/01-requirements/BRD.md) — Business requirements
- [Architecture](docs/02-architecture/SYSTEM_ARCHITECTURE.md) — System design
- [API Design](docs/03-technical/API_DESIGN.md) — REST endpoints
- [Database Schema](docs/03-technical/DATABASE_SCHEMA.md) — Prisma schema
- [Security](docs/03-technical/SECURITY.md) — Security guidelines
- [Dev Onboarding](docs/04-processes/ONBOARDING.md) — Setup guide

## Scripts

```bash
npm run dev           # Start all apps in dev mode
npm run build         # Build all apps
npm run lint          # Lint all apps
npm run test          # Run all tests
npm run db:generate   # Generate Prisma client
npm run db:migrate    # Run database migrations
npm run db:seed       # Seed database
```

## Environment Variables

See `.env.example` for all required variables. Key ones:

- `DATABASE_URL` — PostgreSQL connection string
- `REDIS_HOST` / `REDIS_PORT` — Redis connection
- `JWT_SECRET` — JWT signing secret
- `STRIPE_SECRET_KEY` — Stripe API key
