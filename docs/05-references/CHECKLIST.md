# Checklists

**Version:** 1.0.0 | **Date:** 2026-04-07

> **Related Documents:**
> - [DEPLOYMENT.md](./../04-processes/DEPLOYMENT.md) — Deployment procedures
> - [ONBOARDING.md](./../04-processes/ONBOARDING.md) — Code conventions
> - [SECURITY.md](./../03-technical/SECURITY.md) — Security requirements

---

## Table of Contents

1. [Pre-Launch Checklist](#1-pre-launch-checklist)
2. [Pre-Sprint Checklist](#2-pre-sprint-checklist)
3. [Code Review Checklist](#3-code-review-checklist)
4. [PR Merge Checklist](#4-pr-merge-checklist)

---

## 1. Pre-Launch Checklist

### Security

- [ ] All endpoints require authentication except public ones (listed in API design)
- [ ] RBAC enforced on all protected endpoints
- [ ] Input validation on all DTOs
- [ ] SQL injection prevention (Prisma parameterized queries)
- [ ] Passwords hashed with Argon2
- [ ] JWT tokens configured with appropriate expiry (15m access, 7d refresh)
- [ ] Refresh token rotation implemented
- [ ] CORS configured for allowed origins only
- [ ] Security headers set (HSTS, CSP, X-Frame-Options, etc.)
- [ ] No secrets in source code (verified via git history scan)
- [ ] Stripe webhook signature verification implemented
- [ ] Rate limiting enabled on all public endpoints
- [ ] OWASP Top 10 checklist reviewed and passed

### Performance

- [ ] API p95 latency < 200ms (measured under load)
- [ ] Database indexes created for all query patterns
- [ ] Redis caching configured for read-heavy endpoints
- [ ] No N+1 queries in critical paths
- [ ] Image optimization and CDN configured
- [ ] Lazy loading implemented for non-critical resources

### Monitoring & Observability

- [ ] Health check endpoint (`/health`) operational
- [ ] Structured logging configured (JSON format)
- [ ] Request correlation IDs (X-Request-ID) propagated
- [ ] Error tracking configured (Sentry/DataDog)
- [ ] APM dashboard set up (latency, error rates, DB performance)
- [ ] Alerting configured for:
  - Error rate > 1%
  - API latency p95 > 500ms
  - DB connection pool > 80%
  - Failed payment webhooks > 5 in 5 minutes
- [ ] Uptime monitoring configured

### Data & Backup

- [ ] Daily automated database backup verified
- [ ] Backup restoration tested in past 30 days
- [ ] Point-in-time recovery tested
- [ ] Redis persistence configured (AOF)
- [ ] KYC documents and sensitive data backed up securely
- [ ] Data retention policy documented

### Infrastructure

- [ ] Production environment provisioned and hardened
- [ ] TLS 1.2+ enforced on all endpoints
- [ ] Secrets stored in secrets manager (not in env files)
- [ ] Separate database credentials for each environment
- [ ] CDN configured for static assets
- [ ] Load balancer health checks configured
- [ ] Auto-scaling policies defined
- [ ] DNS configured for production domain

### Deployment

- [ ] Database migrations tested on staging
- [ ] Zero-downtime deployment strategy verified
- [ ] Rollback procedure documented and tested
- [ ] Feature flags configured for risky features
- [ ] Deployment runbook available
- [ ] Maintenance window communicated if needed

### Documentation

- [ ] API documentation (Swagger/OpenAPI) complete and accurate
- [ ] All new endpoints documented in API_DESIGN.md
- [ ] Database schema documented in DATABASE_SCHEMA.md
- [ ] GLOSSARY.md updated with new terminology
- [ ] README.md reflects current setup instructions

---

## 2. Pre-Sprint Checklist

### Planning

- [ ] Sprint goals defined and communicated
- [ ] Stories have acceptance criteria
- [ ] Technical tasks estimated
- [ ] Dependencies identified and communicated
- [ ] Sprint backlog refined (all items have clear scope)

### Team Readiness

- [ ] All team members have local environment working
- [ ] CI/CD pipeline passing on main
- [ ] Test coverage baseline established
- [ ] Staging environment is stable for testing

### Architecture

- [ ] Major technical decisions documented
- [ ] Database schema changes planned with migration strategy
- [ ] API contract changes reviewed
- [ ] Third-party service changes reviewed

---

## 3. Code Review Checklist

### General

- [ ] Code follows project naming conventions (see ONBOARDING.md)
- [ ] No hardcoded secrets, credentials, or environment-specific values
- [ ] No debug code or console.log statements left in
- [ ] No commented-out code (delete instead)
- [ ] No TODO comments without associated issue
- [ ] Files have appropriate copyright/license headers if needed

### TypeScript / NestJS

- [ ] Strict TypeScript mode enabled, no `any` types
- [ ] DTOs have proper validation decorators
- [ ] Service methods have clear return types
- [ ] Error handling is consistent (use custom exceptions)
- [ ] No nested promises without error handling (prefer async/await)
- [ ] Module imports are explicit and organized

### Business Logic

- [ ] Order status transitions follow defined state machine
- [ ] Inventory is never decremented below zero
- [ ] Idempotency keys used for payment/order operations
- [ ] Concurrency handled for critical operations
- [ ] Sensitive data not logged

### Testing

- [ ] Unit tests cover new service logic
- [ ] Happy path and error cases tested
- [ ] Test names are descriptive (describe what/when/then)
- [ ] No test logic that duplicates production code
- [ ] Integration tests cover API endpoints
- [ ] Test coverage does not decrease

### Database

- [ ] Migrations are additive (for production)
- [ ] Indexes added for new query patterns
- [ ] No raw SQL unless absolutely necessary (and reviewed)
- [ ] Prisma queries use proper select/include (no over-fetching)
- [ ] Transactions used for multi-step writes

### API Design

- [ ] HTTP method is correct (GET/POST/PATCH/DELETE)
- [ ] HTTP status code is appropriate
- [ ] Response format follows API conventions
- [ ] Error codes are consistent with existing patterns
- [ ] Pagination implemented for list endpoints
- [ ] Auth guards applied correctly

### Security

- [ ] User authorization verified before data access
- [ ] Input sanitized for any user-generated content
- [ ] SQL injection prevention (no string concatenation)
- [ ] Rate limiting applied to new public endpoints
- [ ] No sensitive data in error responses

---

## 4. PR Merge Checklist

### Pre-Merge

- [ ] All CI checks passing (lint, typecheck, tests)
- [ ] Branch is up to date with `main` (rebased or merged)
- [ ] PR description accurately describes changes
- [ ] PR linked to relevant issue/ticket
- [ ] Screenshots or demos attached for UI changes

### Review

- [ ] Code reviewed by at least 1 team member
- [ ] No unresolved comments
- [ ] Reviewer approves the PR
- [ ] Technical decisions documented in PR or linked to RFC

### Post-Merge

- [ ] Branch deleted after merge
- [ ] Staging deployment triggered automatically
- [ ] Smoke tests pass on staging
- [ ] Issue transitioned to "In Review" or closed
- [ ] Slack notification sent (if configured)

### Breaking Changes (requires additional sign-off)

- [ ] Engineering Lead approves
- [ ] Migration strategy reviewed
- [ ] Client/consumer teams notified
- [ ] Version bumped appropriately
- [ ] CHANGELOG.md updated
