# Infrastructure

**Version:** 1.0.0 | **Date:** 2026-04-07

> **Related Documents:**
>
> - [SYSTEM_ARCHITECTURE.md](./../02-architecture/SYSTEM_ARCHITECTURE.md) — Architecture decisions and evolution path
> - [DEPLOYMENT.md](./../04-processes/DEPLOYMENT.md) — Release and deployment procedures
> - [TESTING_STRATEGY.md](./TESTING_STRATEGY.md) — Test environment setup

---

## Table of Contents

1. [Docker Compose Setup (MVP)](#1-docker-compose-setup-mvp)
2. [Environment Variables](#2-environment-variables)
3. [Local Development Workflow](#3-local-development-workflow)
4. [Cloud-Ready Design](#4-cloud-ready-design)
5. [CI/CD Pipeline](#5-cicd-pipeline)
6. [Monitoring & Observability](#6-monitoring--observability)

---

## 1. Docker Compose Setup (MVP)

### docker-compose.yml

```yaml
version: '3.9'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:16-alpine
    container_name: marketplace-db
    environment:
      POSTGRES_USER: marketplace
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: marketplace_dev
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U marketplace']
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis Cache & Queue
  redis:
    image: redis:7-alpine
    container_name: marketplace-redis
    ports:
      - '6379:6379'
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    healthcheck:
      test: ['CMD', 'redis-cli', 'ping']
      interval: 10s
      timeout: 5s
      retries: 5

  # NestJS Backend API
  api:
    build:
      context: ./apps/api
      dockerfile: Dockerfile
    container_name: marketplace-api
    environment:
      DATABASE_URL: postgresql://marketplace:${POSTGRES_PASSWORD}@postgres:5432/marketplace_dev
      REDIS_URL: redis://redis:6379
      NODE_ENV: development
      # ... other env vars from .env
    ports:
      - '3000:3000'
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    volumes:
      - ./apps/api:/app
      - /app/node_modules
    command: npm run start:dev

  # BullMQ Worker
  worker:
    build:
      context: ./apps/api
      dockerfile: Dockerfile
    container_name: marketplace-worker
    environment:
      DATABASE_URL: postgresql://marketplace:${POSTGRES_PASSWORD}@postgres:5432/marketplace_dev
      REDIS_URL: redis://redis:6379
      NODE_ENV: development
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    volumes:
      - ./apps/api:/app
      - /app/node_modules
    command: npm run start:worker:dev

  # Next.js Frontend
  frontend:
    build:
      context: ./apps/web
      dockerfile: Dockerfile
    container_name: marketplace-web
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:3000
    ports:
      - '3001:3000'
    depends_on:
      - api
    volumes:
      - ./apps/web:/app
      - /app/node_modules
      - /app/.next
    command: npm run dev

volumes:
  postgres_data:
  redis_data:
```

### Dockerfile (API)

```dockerfile
FROM node:20-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Development image
FROM base AS development
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
CMD ["npm", "run", "start:dev"]

# Production build
FROM base AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production image
FROM base AS production
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
ENV NODE_ENV=production
USER node
CMD ["node", "dist/main"]
```

---

## 2. Environment Variables

### Core Application (.env)

```bash
# Application
NODE_ENV=development
PORT=3000
APP_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://marketplace:password@localhost:5432/marketplace_dev

# Redis
REDIS_URL=redis://localhost:6379

# JWT Authentication
JWT_ACCESS_SECRET=your-access-secret-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-min-32-chars
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Encryption
ENCRYPTION_KEY=your-32-character-encryption-key

# CORS
ALLOWED_ORIGINS=http://localhost:3001

# Payment Gateway (Stripe)
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Email (SMTP)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=noreply@marketplace.com
SMTP_PASSWORD=smtp-password

# CDN / File Storage
CDN_BUCKET_NAME=marketplace-assets
CDN_REGION=ap-southeast-1
CDN_ACCESS_KEY_ID=
CDN_SECRET_ACCESS_KEY=

# Feature Flags
ENABLE_FLASH_SALE_MODE=false
RESERVATION_TIMEOUT_SECONDS=900
```

---

## 3. Local Development Workflow

### Prerequisites

- Docker & Docker Compose installed
- Node.js 20+ installed
- Git

### Setup Steps

1. **Clone and install:**

   ```bash
   git clone <repo>
   cd ecommerce
   npm install
   ```

2. **Configure environment:**

   ```bash
   cp apps/api/.env.example apps/api/.env
   cp apps/web/.env.example apps/web/.env
   # Edit .env files with local values
   ```

3. **Start infrastructure:**

   ```bash
   docker compose up -d postgres redis
   ```

4. **Run database migrations:**

   ```bash
   npm run db:migrate --workspace=apps/api
   npm run db:seed --workspace=apps/api   # Optional: seed test data
   ```

5. **Start development servers:**

   ```bash
   # In separate terminals, or use concurrently:
   npm run dev --workspace=apps/api
   npm run dev --workspace=apps/web
   ```

6. **Verify:**
   - API: http://localhost:3000
   - Web: http://localhost:3001
   - Health: http://localhost:3000/health
   - API docs: http://localhost:3000/api/docs (Swagger)

---

## 4. Cloud-Ready Design

### MVP Cloud Architecture (AWS)

```
                    Route 53
                        |
              CloudFront CDN (static assets)
                        |
                  Application Load Balancer
                        |
              ┌─────────┼─────────┐
              │         │         │
         Next.js    Next.js    Next.js
         (vercel)  (vercel)   (vercel)
              │         │         │
         ECS Fargate (API) — auto-scaling
              │
         ┌────┴────┐
         │         │
    RDS PostgreSQL  ElastiCache Redis
    (Multi-AZ)      (Cluster mode)
         │
    read replica
```

### Deployment Targets

| Environment | Recommended Platform       | Notes                       |
| ----------- | -------------------------- | --------------------------- |
| Development | Local Docker               | Full stack                  |
| Staging     | AWS ECS / Railway / Render | Mirror production           |
| Production  | AWS ECS (Fargate)          | Multi-AZ RDS, Redis Cluster |

### Database

- **MVP:** Single PostgreSQL instance on RDS (db.t3.micro)
- **Scale:** RDS with Multi-AZ, read replica for analytics
- **1M+:** Consider Aurora or per-service database separation

### Object Storage

- **Images:** S3 with CloudFront distribution for product images
- **KYC Documents:** S3 with server-side encryption, signed URLs only

### Container Strategy

- **MVP:** Docker Compose for local, ECS Fargate for production
- **Scale:** EKS (Kubernetes) when team grows, consider managed K8s

---

## 5. CI/CD Pipeline

### GitHub Actions

#### 1. PR Checks (on every pull request)

```yaml
# .github/workflows/pr-checks.yml
name: PR Checks

on:
  pull_request:
    branches: [main, develop]

jobs:
  lint-and-typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck

  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - run: npm ci
      - run: npm test --workspace=apps/api -- --coverage
      - uses: codecov/codecov-action@v3

  build:
    runs-on: ubuntu-latest
    needs: [lint-and-typecheck, unit-tests]
    steps:
      - uses: actions/checkout@v4
      - uses: docker/setup-buildx-action@v3
      - run: docker compose -f docker-compose.yml build
```

#### 2. Deploy to Staging (on merge to develop)

```yaml
# .github/workflows/deploy-staging.yml
name: Deploy Staging

on:
  push:
    branches: [develop]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123456789:role/github-actions
          aws-region: ap-southeast-1
      - name: Deploy to ECS
        run: |
          # Update ECS service
          aws ecs update-service --cluster marketplace-staging --force-new-deployment
          aws ecs wait services-stable --cluster marketplace-staging --services marketplace-api
```

#### 3. Deploy to Production (on release tag)

```yaml
# .github/workflows/deploy-production.yml
name: Deploy Production

on:
  push:
    tags: ['v*']

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4
      - name: Run database migrations
        run: npm run db:migrate --workspace=apps/api
        env:
          DATABASE_URL: ${{ secrets.PROD_DATABASE_URL }}
      - name: Deploy to ECS
        run: |
          aws ecs update-service --cluster marketplace-prod --force-new-deployment
```

---

## 6. Monitoring & Observability

### Health Checks

```typescript
// GET /health
{
  "status": "ok",
  "timestamp": "2026-04-07T00:00:00Z",
  "services": {
    "database": "healthy",
    "redis": "healthy",
    "queue": "healthy"
  },
  "version": "1.0.0"
}
```

### OpenTelemetry Setup

```typescript
// src/tracing.ts
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'
import { JaegerExporter } from '@opentelemetry/exporter-jaeger'
import { NodeSDK } from '@opentelemetry/sdk-node'

const sdk = new NodeSDK({
  serviceName: 'marketplace-api',
  traceExporter: new JaegerExporter({
    endpoint: process.env.JAEGER_ENDPOINT || 'http://localhost:14268/api/traces',
  }),
  instrumentations: [getNodeAutoInstrumentations()],
})

sdk.start()
```

### Key Metrics to Monitor

| Metric                    | Alert Threshold | Dashboard             |
| ------------------------- | --------------- | --------------------- |
| API p95 latency           | > 200ms         | APM dashboard         |
| API error rate            | > 1%            | APM dashboard         |
| DB connection pool        | > 80%           | RDS dashboard         |
| Redis memory              | > 75%           | ElastiCache dashboard |
| Queue depth               | > 1000          | BullMQ dashboard      |
| Failed payment webhooks   | > 5 in 5 min    | Alerting              |
| Inventory reserve latency | > 100ms         | APM dashboard         |

### Logging Strategy

- **Format:** JSON structured logging (Pino in NestJS)
- **Fields:** timestamp, level, message, requestId, userId, duration, statusCode
- **Transport:** Console (dev) / CloudWatch / Datadog (prod)
- **Correlation:** Every request has a `X-Request-ID` header propagated to logs and traces

```typescript
// Structured log example
logger.log({
  level: 'info',
  message: 'Order created',
  orderId: order.id,
  buyerId: buyer.id,
  sellerCount: subOrders.length,
  totalAmount: order.totalAmount,
  duration: performance.now() - start,
})
```
