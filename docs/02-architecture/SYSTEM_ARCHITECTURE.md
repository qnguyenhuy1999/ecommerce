# System Architecture

**Version:** 1.0.0 | **Date:** 2026-04-07

> **Related Documents:**
> - [BRD.md](./../01-requirements/BRD.md) — Business requirements driving this architecture
> - [GLOSSARY.md](./../01-requirements/GLOSSARY.md) — Term definitions
> - [SEQUENCE_DIAGRAMS.md](./SEQUENCE_DIAGRAMS.md) — Detailed flow diagrams

---

## Table of Contents

1. [High-Level System Architecture](#1-high-level-system-architecture)
2. [Backend Internal Architecture (Modular Monolith Phase)](#2-backend-internal-architecture-modular-monolith-phase)
3. [Multi-Seller Order Architecture](#3-multi-seller-order-architecture)
4. [Checkout Flow (Production Grade)](#4-checkout-flow-production-grade)
5. [Payment & Webhook Architecture](#5-payment--webhook-architecture)
6. [Inventory Architecture (Flash-Sale Ready)](#6-inventory-architecture-flash-sale-ready)
7. [Seller Wallet & Commission Architecture](#7-seller-wallet--commission-architecture)
8. [Database Strategy](#8-database-strategy)
9. [Caching Strategy](#9-caching-strategy)
10. [Queue & Async Processing](#10-queue--async-processing)
11. [Horizontal Scaling Strategy](#11-horizontal-scaling-strategy)
12. [High-Traffic Safety Mechanisms](#12-high-traffic-safety-mechanisms)
13. [Evolution Path](#13-evolution-path)
14. [Engineering Principles](#14-engineering-principles)

---

## 1. High-Level System Architecture

```
                    CDN
                      │
               Load Balancer
                      │
                 API Gateway
                      │
        ┌─────────────┼─────────────┐
        │             │             │
     API Server   API Server   API Server
      (Stateless)  (Stateless)  (Stateless)
            │
     ┌──────┴──────────────┐
     │                     │
  Redis Cluster     Message Queue
  (Cache/Stock)     (BullMQ/Kafka)
     │                     │
PostgreSQL Primary   Async Consumers
  Read Replica       (Email, Notification,
                      Analytics, Settlement)
```

**Design Notes:**

- API servers are **stateless** — any server can handle any request
- Redis serves dual purpose: caching layer and atomic inventory counter
- Message queue (BullMQ for MVP, Kafka for Phase 2+) decouples services
- PostgreSQL read replica handles analytics and reporting queries
- Async consumers process non-critical paths (emails, notifications, settlement)

---

## 2. Backend Internal Architecture (Modular Monolith Phase)

### Modules

| Module | Responsibility |
|--------|---------------|
| **auth** | Registration, login, JWT issuance, email verification |
| **user** | User profile, preferences |
| **seller** | Seller onboarding, KYC, store management |
| **product** | Product CRUD, variants, catalog, search |
| **inventory** | Stock management, reservations, atomic operations |
| **cart** | Cart management, item operations |
| **order** | Order creation, splitting, lifecycle management |
| **payment** | Payment intent creation, webhook handling |
| **commission** | Commission calculation, ledger entries |
| **review** | Ratings and reviews |
| **notification** | In-app notifications, email/SMS triggers |
| **admin** | Seller approval, dispute resolution, analytics |

### Design Principles

- Domain-driven modules with clear boundaries
- Event-based internal communication between modules
- Stateless API servers — no session affinity required
- No shared mutable state across requests
- Each module owns its data and exposes a clean API

---

## 3. Multi-Seller Order Architecture

### Core Concept

- One cart may contain products from **multiple sellers**
- Orders are **split per seller** (sub-orders)
- Sellers ship independently
- Sellers are paid independently

### Core Tables

| Table | Fields |
|-------|--------|
| **User** | id, email, role (USER \| SELLER \| ADMIN), status |
| **Seller** | id, owner_id (user), shop_name, status, commission_rate, rating |
| **Product** | id, seller_id, name, price, status |
| **Inventory** | product_id, seller_id, total_stock, reserved_stock |
| **Order** | id, buyer_id, total_amount, status |
| **SubOrder** | id, order_id, seller_id, subtotal, status |
| **OrderItem** | id, sub_order_id, product_id, quantity, price_snapshot |

---

## 4. Checkout Flow (Production Grade)

```
Client
  → API Gateway
    → Order Service
      - Validate cart
      - Split by seller
      - Create parent order
      - Create sub-orders
      - Emit ORDER_CREATED
        → Inventory Service
        - Reserve stock
        - Emit STOCK_RESERVED
          → Payment Service
          - Create payment intent
          - Await webhook
```

**Key Steps:**

1. Validate all cart items (stock availability, seller status)
2. Split cart items by seller into sub-orders
3. Create parent order with `PENDING_PAYMENT` status
4. Reserve inventory for each sub-order
5. Initiate payment intent with idempotency key
6. Await payment webhook confirmation

---

## 5. Payment & Webhook Architecture

```
User → Payment Gateway
  → Payment Webhook Endpoint
    → Payment Service
      - Verify signature
      - Idempotency check
      - Emit PAYMENT_SUCCESS
      - Update order status
```

**Event Consumers (on PAYMENT_SUCCESS):**

- Inventory Service → Confirm stock deduction
- Seller Wallet Service → Credit seller balance (minus commission)
- Commission Logic → Record commission entry in ledger
- Notification Service → Send order confirmation email
- Analytics → Record transaction metrics
- Shipping → Trigger fulfillment (Phase 2+)

---

## 6. Inventory Architecture (Flash-Sale Ready)

### Normal Mode

```
Check Redis cache
  → Validate stock
  → Use optimistic locking (DB)
  → Reserve stock (atomic decrement)
```

### Flash Sale Mode

```
Preload stock into Redis before sale starts
  → Redis DECR (atomic) on checkout
  → If remaining >= 0 → push order to queue
  → If remaining < 0 → rollback Redis DECR, return "SOLD OUT"
  → Async DB update (batch processed by worker)
```

**Key Mechanism:** Redis acts as the atomic counter for high-concurrency scenarios. Database updates happen asynchronously to avoid DB bottleneck during the flash sale.

---

## 7. Seller Wallet & Commission Architecture

### Ledger Pattern

**Rule #1:** Never update balance directly.
**Rule #2:** Always append ledger entries.
**Rule #3:** Deduct commission automatically on credit.
**Rule #4:** Credit seller wallet after payment success.

### Tables

| Table | Fields |
|-------|--------|
| **SellerLedger** | id, seller_id, type (CREDIT \| DEBIT), amount, reference_type, reference_id, description, created_at |

### Commission Flow

1. Buyer completes payment for order
2. PAYMENT_SUCCESS event triggers commission calculation
3. Commission = subtotal * commission_rate
4. Ledger entry: CREDIT to seller wallet (subtotal - commission)
5. Ledger entry: DEBIT commission to platform account

---

## 8. Database Strategy

| Layer | Purpose |
|-------|--------|
| **PostgreSQL Primary** | All write operations |
| **PostgreSQL Read Replica** | Product listings, order history, analytics |
| **Redis** | Cache (product details, categories, sessions) + atomic counters (inventory) |

### Required Indexes

- product_id
- seller_id
- order_id
- user_id
- status (for filtering queries)
- composite indexes on (seller_id, status), (user_id, created_at)

---

## 9. Caching Strategy

### Redis Use Cases

- Product detail cache (TTL: 5 minutes)
- Category cache (TTL: 30 minutes)
- Cart data (TTL: 7 days, or until checkout)
- Session data (TTL: session duration)
- Rate limiting counters (TTL: sliding window)
- Inventory atomic counters (no TTL — managed explicitly)

### Cache-Aside Pattern

```
Request → Check Redis → Hit → Return
Miss → Query DB → Store in Redis → Return
```

**Cache Invalidation:** On product update, delete cache key immediately. Use event-driven invalidation for inventory changes.

---

## 10. Queue & Async Processing

### BullMQ Queues (MVP)

| Queue | Purpose |
|-------|--------|
| **email** | Transactional emails (order confirmation, refund) |
| **notification** | In-app notification creation |
| **analytics** | Event aggregation and metrics |
| **order-expiration** | Cancel unpaid orders after timeout |
| **settlement** | Commission calculation and seller payouts |
| **inventory-reconciliation** | Sync Redis counters with DB periodically |

### Event-Driven Benefits

- Improved scalability: producers and consumers are decoupled
- Fault tolerance: failed jobs are retried with backoff
- Better user experience: non-critical operations run asynchronously

---

## 11. Horizontal Scaling Strategy

| Layer | Strategy |
|-------|----------|
| **API Layer** | Stateless servers — auto-scale by CPU/memory |
| **Redis** | Cluster mode with replica nodes for high availability |
| **Database** | Primary + read replicas; partition large tables by seller_id in Phase 3 |
| **Queue Workers** | Scale workers independently based on queue depth |

---

## 12. High-Traffic Safety Mechanisms

- **Rate limiting** — per user (JWT) and per IP (sliding window)
- **Circuit breaker** — for payment gateway calls (fail fast, recover gracefully)
- **Timeout** — for all external API calls (max 5s)
- **Retry with exponential backoff** — for transient failures (max 3 retries)
- **Graceful degradation** — non-critical services fail without blocking checkout

---

## 13. Evolution Path

### Phase 1 — Modular Monolith (MVP)

- Single NestJS application
- Single PostgreSQL database
- BullMQ for async jobs
- Redis for caching + inventory
- 5,000 concurrent users
- Order p95 < 300ms
- No overselling under moderate load

### Phase 2 — Scale to 500K Users

- Extract **Inventory Service** as standalone microservice
- Extract **Order Service** as standalone microservice
- Extract **Payment Service** as standalone microservice
- Introduce **Kafka** for event bus
- **Redis Cluster** for high availability
- Introduce **Elasticsearch** for product search
- 20,000+ concurrent users
- Flash sale safe (Redis atomic inventory)

### Phase 3 — 1M+ Users

- Full microservices decomposition (per domain)
- **DB-per-service** (each service owns its PostgreSQL)
- **Kafka Cluster** with dead-letter queues
- **ES Cluster** for advanced search and analytics
- 80,000 RPS peak read / 5,000 RPS checkout
- 99.9% uptime
- Horizontal Pod Autoscaling (HPA)
- Chaos testing in production

### Infrastructure Evolution Table

| Phase | DB Strategy | Messaging | Inventory | Search |
|-------|-------------|-----------|-----------|--------|
| MVP | Single cluster | BullMQ | DB locking | DB |
| Scale | DB per service | Kafka | Redis atomic | Elasticsearch |
| 1M+ | DB per service cluster | Kafka cluster | Redis cluster | ES cluster |

---

## 14. Engineering Principles

1. **Idempotency everywhere** — Every operation must be safely retriable
2. **Never block on external services** — Use async patterns, timeouts, circuit breakers
3. **Separate read & write workloads** — Use read replicas, CQRS where appropriate
4. **Ledger-based financial tracking** — Never update balances directly; always append
5. **Event-driven architecture** — Decouple modules via events, not direct calls
6. **Design for failure scenarios** — Every external call can fail; plan for it
7. **Scale horizontally** — Stateless design enables auto-scaling
8. **Zero overselling** — Inventory is sacred; use atomic operations and optimistic locking

---

## Document Relationship

This document is informed by:

- **BRD.md** — All functional requirements (FR-01 through FR-08) drive the module definitions and flows
- **GLOSSARY.md** — All terminology in this document follows standardized definitions
- **SEQUENCE_DIAGRAMS.md** — Detailed step-by-step flows for checkout, payment, inventory, and refund

---

*See [SEQUENCE_DIAGRAMS.md](./SEQUENCE_DIAGRAMS.md) for detailed flow diagrams.*
