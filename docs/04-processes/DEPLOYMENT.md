# Deployment

**Version:** 1.0.0 | **Date:** 2026-04-07

> **Related Documents:**
>
> - [INFRASTRUCTURE.md](./../03-technical/INFRASTRUCTURE.md) — Infrastructure setup and CI/CD pipeline
> - [ONBOARDING.md](./ONBOARDING.md) — Developer setup reference
> - [SYSTEM_ARCHITECTURE.md](./../02-architecture/SYSTEM_ARCHITECTURE.md) — Architecture phases

---

## Table of Contents

1. [Release Process](#1-release-process)
2. [Docker Image Build](#2-docker-image-build)
3. [Database Migration Runbook](#3-database-migration-runbook)
4. [Rollback Procedure](#4-rollback-procedure)
5. [Environment Promotion](#5-environment-promotion)

---

## 1. Release Process

### Git Flow

```
main (production)    ──────────────────────────────────
                        ↑                   ↑
                        │ tag: v1.0.0       │ tag: v1.1.0
                        │ deploy prod       │ deploy prod
                        │                   │
develop (staging)    ──┼───────────────────┼─────────
                        ↑                   ↑
                        │ merge PR #42      │ merge PR #45
                        │ deploy staging     │ deploy staging
                        │                   │
feature/xyz          ──┼───────────────────┘
                        ↑ PR merge
                        │
bugfix/abc           ──┴─────────────────────────────
                        ↑ PR merge
```

### Release Steps

1. **Feature freeze** on `develop` branch before release
2. Create release branch: `git checkout -b release/v1.x.x develop`
3. Update version in `package.json` and `CHANGELOG.md`
4. Run full test suite on release branch
5. Merge to `develop` and `main`
6. Create Git tag: `git tag v1.x.x && git push --tags`
7. GitHub Actions triggers deployment to staging (develop) or production (tag)
8. Run smoke tests on deployed environment
9. Monitor error rates and performance for 30 minutes post-deploy

### Version Naming

Format: `v{MAJOR}.{MINOR}.{PATCH}`

- **MAJOR:** Breaking changes (API, schema)
- **MINOR:** New features (backward compatible)
- **PATCH:** Bug fixes

---

## 2. Docker Image Build

### Build Arguments

| ARG        | Description                   | Required            |
| ---------- | ----------------------------- | ------------------- |
| `NODE_ENV` | `production` or `development` | Yes                 |
| `API_URL`  | Backend API URL for frontend  | Yes (frontend only) |

### Build Commands

```bash
# Build API image
docker build -f apps/api-storefront/Dockerfile -t marketplace-api-storefront:latest ./apps/api-storefront
docker build -f apps/api-admin/Dockerfile -t marketplace-api-admin:latest ./apps/api-admin

# Build with specific version
docker build -f apps/api-storefront/Dockerfile \
  -t marketplace-api-storefront:v1.0.0 \
  -t marketplace-api-storefront:latest \
  ./apps/api-storefront

# Build all images
docker compose build

# Multi-stage build (production)
docker build --target production -f apps/api-storefront/Dockerfile -t marketplace-api-storefront:v1.0.0 ./apps/api-storefront
docker build --target production -f apps/api-admin/Dockerfile -t marketplace-api-admin:v1.0.0 ./apps/api-admin
```

### Image Tags Strategy

```
marketplace-api-storefront:v1.0.0       # Specific version (immutable)
marketplace-api-storefront:latest         # Latest (mutable)
marketplace-api-storefront:develop        # Staging build
marketplace-api-storefront:sha-abc1234    # Git SHA for rollback tracking
```

### Health Check

```dockerfile
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1
```

---

## 3. Database Migration Runbook

### Pre-Migration Checklist

- [ ] Backup completed and verified
- [ ] Migration tested on staging
- [ ] Rollback plan documented
- [ ] Maintenance window communicated
- [ ] DBA/team available for monitoring

### Running Migrations

```bash
# Development
npm run db:migrate --workspace=apps/api-storefront

# Staging / Production (with explicit env)
DATABASE_URL=$PROD_DATABASE_URL npm run db:migrate --workspace=apps/api-storefront

# Check migration status
npm run db:status --workspace=apps/api-storefront

# Rollback last migration (if needed)
npm run db:rollback --workspace=apps/api-storefront
```

### Migration Best Practices

1. **Never modify a committed migration** — create a new one instead
2. **Additive only in production** — add columns/tables, avoid dropping or renaming
3. **Zero-downtime migrations:**
   - Add nullable column first
   - Backfill data in batches (via a separate script)
   - Add constraints after backfill
4. **Test on a production-sized dataset** before running on production

### Zero-Downtime Migration Example

```typescript
// Migration 1: Add nullable column
await db.query(`
  ALTER TABLE "Product" ADD COLUMN "rating" DOUBLE PRECISION DEFAULT 0;
`)

// Migration 2: Backfill (separate job, run after deployment)
await db.query(`
  UPDATE "Product" SET "rating" = (
    SELECT AVG(rating) FROM "Review" WHERE "productId" = "Product".id
  ) WHERE "rating" = 0;
`)

// Migration 3: Add NOT NULL constraint (after backfill)
await db.query(`
  ALTER TABLE "Product" ALTER COLUMN "rating" SET NOT NULL;
`)
```

### Post-Migration Verification

```bash
# Verify all tables exist
npm run db:validate --workspace=apps/api-storefront

# Check for data integrity issues
npm run db:check --workspace=apps/api-storefront
```

---

## 4. Rollback Procedure

### Application Rollback

```bash
# 1. Identify the previous working version
docker images | grep marketplace-api-storefront

# 2. Stop current deployment
docker compose down

# 3. Pull/load previous image
docker pull marketplace-api-storefront:v1.0.0

# 4. Update image tag reference
sed -i 's/marketplace-api-storefront:current/marketplace-api-storefront:v1.0.0/' docker-compose.yml

# 5. Restart
docker compose up -d

# Or via ECS:
aws ecs update-service \
  --cluster marketplace-prod \
  --service marketplace-api-storefront \
  --task-definition marketplace-api-storefront:42  # previous task def
```

### Database Rollback

**If migration is reversible:**

```bash
# Rollback last migration
npm run db:rollback --workspace=apps/api-storefront
```

**If migration is not reversible (data changes):**

1. Restore from backup taken before migration
2. Restore point-in-time recovery if available:

```bash
# AWS RDS PITR
aws rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier marketplace-restored \
  --db-snapshot-identifier pre-migration-snapshot
```

### Rollback Decision Criteria

| Issue                        | Action                                  |
| ---------------------------- | --------------------------------------- |
| API returning 5xx errors     | Rollback immediately                    |
| Database migration failed    | Rollback migration, investigate         |
| Partial deployment           | Rollback to stable version              |
| Performance regression > 20% | Investigate first; rollback if critical |

---

## 5. Environment Promotion

### Environment Overview

| Environment | Branch        | URL                     | Purpose                |
| ----------- | ------------- | ----------------------- | ---------------------- |
| Development | Local         | localhost:3001          | Individual development |
| Staging     | `develop`     | staging.marketplace.com | Integration testing    |
| Production  | `main` (tags) | api.marketplace.com     | Live users             |

### Promotion Path

```
Local Dev -> Staging (automatic on merge to develop)
                    |
                    v (manual: create release tag)
             Production
```

### Staging Promotion

Automatic on every push to `develop`:

1. CI runs: lint, test, build
2. Docker images built and pushed to registry
3. ECS service updated with new task definition
4. Blue/green deployment to staging
5. Smoke tests run automatically
6. Slack notification sent with deployment status

### Production Promotion

Manual trigger on version tag:

1. Approval required from Engineering Lead
2. Final review of changelog
3. Database migration (if any) executed before deploy
4. ECS deployment with blue/green strategy
5. Post-deployment smoke tests
6. 30-minute monitoring window
7. Slack notification with deployment summary

### Environment-Specific Config

| Variable      | Development | Staging | Production |
| ------------- | ----------- | ------- | ---------- |
| `NODE_ENV`    | development | staging | production |
| `LOG_LEVEL`   | debug       | info    | warn       |
| Rate limiting | Disabled    | Normal  | Enforced   |
| Source maps   | Yes         | No      | No         |
| Error details | Full stack  | Generic | Generic    |
