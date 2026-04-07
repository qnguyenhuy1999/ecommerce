# Documentation Summary

**Version:** 1.0.0 | **Date:** 2026-04-07

---

## Table of Contents

### [00 - Overview](./)
| Document | Description |
|----------|-------------|
| [SUMMARY.md](./SUMMARY.md) | This file — master index and guide |

### [01 - Requirements](./../01-requirements/)
| Document | Description |
|----------|-------------|
| [BRD.md](./../01-requirements/BRD.md) | Business Requirements Document — full business, functional, and non-functional requirements |
| [GLOSSARY.md](./../01-requirements/GLOSSARY.md) | Alphabetical glossary of all terms and definitions |

### [02 - Architecture](./../02-architecture/)
| Document | Description |
|----------|-------------|
| [SYSTEM_ARCHITECTURE.md](./../02-architecture/SYSTEM_ARCHITECTURE.md) | High-level system architecture, evolution path, and engineering principles |
| [SEQUENCE_DIAGRAMS.md](./../02-architecture/SEQUENCE_DIAGRAMS.md) | Complete sequence diagrams for all key flows |

### [03 - Technical](./../03-technical/)
| Document | Description |
|----------|-------------|
| [API_DESIGN.md](./../03-technical/API_DESIGN.md) | REST API endpoint specifications for all modules |
| [DATABASE_SCHEMA.md](./../03-technical/DATABASE_SCHEMA.md) | Complete Prisma database schema |
| [SECURITY.md](./../03-technical/SECURITY.md) | Security architecture — auth, RBAC, OWASP, PCI-DSS |
| [INFRASTRUCTURE.md](./../03-technical/INFRASTRUCTURE.md) | Docker, environment setup, CI/CD, monitoring |
| [TESTING_STRATEGY.md](./../03-technical/TESTING_STRATEGY.md) | Testing pyramid — unit, integration, E2E, load, security |

### [04 - Processes](./../04-processes/)
| Document | Description |
|----------|-------------|
| [DEPLOYMENT.md](./../04-processes/DEPLOYMENT.md) | Release process, migrations, rollback, environment promotion |
| [ONBOARDING.md](./../04-processes/ONBOARDING.md) | Developer setup, project structure, code conventions |

### [05 - References](./../05-references/)
| Document | Description |
|----------|-------------|
| [CHECKLIST.md](./../05-references/CHECKLIST.md) | Pre-launch, pre-sprint, code review, and PR merge checklists |
| [CHANGELOG.md](./../05-references/CHANGELOG.md) | Version history and change log |

---

## Document Relationships

```
BRD.md (business requirements)
    ├── drives → API_DESIGN.md (FR-01 through FR-08)
    ├── drives → DATABASE_SCHEMA.md (entities from BRD conceptual model)
    └── drives → SYSTEM_ARCHITECTURE.md (architecture decisions)

GLOSSARY.md
    └── referenced by → All documents (single source of truth for terminology)

SYSTEM_ARCHITECTURE.md
    ├── references → SEQUENCE_DIAGRAMS.md (flow details)
    ├── references → DATABASE_SCHEMA.md (data model)
    ├── references → INFRASTRUCTURE.md (infra setup)
    └── references → SECURITY.md (security architecture)

API_DESIGN.md
    └── drives → TESTING_STRATEGY.md (test scenarios per endpoint)

INFRASTRUCTURE.md
    └── drives → DEPLOYMENT.md (CI/CD pipeline definition)

CHECKLIST.md
    └── aggregates → All process and quality requirements
```

---

## Version Tracking

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-04-07 | doc-migrator | Initial documentation reorganization — created 6-category structure, migrated 4 existing docs into 12 new documents |

---

## Quick Reference

### Architecture Evolution
- **Phase 1 (MVP):** Modular Monolith — NestJS + Prisma + PostgreSQL + Redis + BullMQ + Next.js
- **Phase 2 (Scale):** Extract Order/Payment/Inventory services, introduce Kafka, Redis Cluster, Elasticsearch
- **Phase 3 (1M+ Users):** Full microservices, DB-per-service, Kafka Cluster, ES Cluster, chaos testing

### Key Tech Stack
| Layer | Technology |
|-------|------------|
| Backend | NestJS, Prisma ORM |
| Database | PostgreSQL |
| Cache | Redis |
| Queue | BullMQ |
| Frontend | Next.js (SSR) |
| Container | Docker, Kubernetes |
| CDN | CloudFlare / AWS CloudFront |

### Key Quality Targets
| Metric | Target |
|--------|--------|
| API p95 latency | < 200ms |
| Concurrent users (MVP) | 5,000 |
| Concurrent users (1M scale) | 80,000 RPS read / 5,000 RPS checkout |
| Uptime | 99.9% |
| Unit test coverage | >= 80% |
| RTO / RPO | < 2h / < 15m |

---

*Maintained by the engineering team. Update this file when new documents are added or structure changes.*
