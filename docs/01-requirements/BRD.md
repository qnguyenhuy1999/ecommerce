# BUSINESS REQUIREMENTS DOCUMENT (BRD)

**Version:** 1.0.0 | **Date:** 2026-04-07

**Project:** Multi-Vendor Ecommerce Platform (APAC)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Project Objectives](#2-project-objectives)
3. [Stakeholders & Governance](#3-stakeholders--governance)
4. [Current State & Problem Statement](#4-current-state--problem-statement)
5. [Proposed Solution Overview](#5-proposed-solution-overview)
6. [Scope Definition](#6-scope-definition)
7. [Business Requirements](#7-business-requirements)
8. [Stakeholder Requirements & Personas](#8-stakeholder-requirements--personas)
9. [Use Cases & User Journeys](#9-use-cases--user-journeys)
10. [Data Requirements & Conceptual Data Model](#10-data-requirements--conceptual-data-model)
11. [Interfaces & Integration Requirements](#11-interfaces--integration-requirements)
12. [Quality Attributes](#12-quality-attributes)
13. [Constraints, Risks & Assumptions](#13-constraints-risks--assumptions)
14. [Regulatory & Compliance](#14-regulatory--compliance)
15. [Acceptance Criteria & Success Metrics](#15-acceptance-criteria--success-metrics)
16. [Release Plan & Milestones](#16-release-plan--milestones)
17. [Governance Model](#17-governance-model)
18. [Appendices](#18-appendices)

---

## 1. Executive Summary

The **Multi-Vendor Ecommerce Platform** is a web-based marketplace enabling multiple sellers across APAC to list and sell products to customers.

The platform will:

- Enable seller onboarding
- Provide scalable product catalog management
- Ensure strong inventory consistency
- Support secure payment integration
- Handle growth from MVP to 1M+ users

The system is designed for startup MVP launch with architectural scalability toward growth stage.

---

## 2. Project Objectives

### 2.1 Business Objectives

- Launch MVP within 4-6 months
- Enable revenue via commission model
- Onboard 1,000+ sellers in first year
- Achieve GMV growth month-over-month

### 2.2 Technical Objectives

- Support 100K MAU (scalable to 1M+)
- Prevent overselling under concurrency
- Maintain 99.9% uptime
- API p95 < 200ms
- Event-driven order lifecycle

---

## 3. Stakeholders & Governance

| Stakeholder      | Role                    | Responsibility            |
| ---------------- | ----------------------- | ------------------------- |
| Founders         | Executive Sponsor       | Strategic direction       |
| Product Owner    | Business Lead           | Backlog prioritization    |
| Engineering Lead | Technical Owner         | Architecture & delivery   |
| DevOps           | Infrastructure          | Deployment & scaling      |
| Finance          | Accounting              | Reconciliation & payouts  |
| Sellers          | Marketplace Participant | Sell products             |
| Customers        | End User                | Purchase products         |
| Admin            | Operations              | Manage disputes & sellers |

---

## 4. Current State & Problem Statement

### 4.1 Market Challenges in APAC

- Fragmented sellers with limited digital presence
- Inventory inconsistency across channels
- Slow checkout experience
- Limited trust in smaller sellers
- Cross-border regulatory complexity

### 4.2 Problem Statement

The platform must:

- Enable centralized marketplace
- Support high concurrency safely
- Prevent inventory oversell
- Provide secure and compliant payment flow
- Scale beyond MVP without re-architecture

---

## 5. Proposed Solution Overview

### Architecture Style

- Modular Monolith (MVP)
- Evolvable to Microservices (Growth)
- Event-driven using message queue
- API Gateway layer
- Redis caching
- CDN for assets

### Core Domains

- Identity & Access
- Catalog
- Inventory
- Cart
- Order
- Payment
- Seller
- Admin
- Notification

---

## 6. Scope Definition

### 6.1 In Scope (MVP)

**Customer**

- Registration & Login
- Product browsing & search
- Cart management
- Checkout & payment
- Order tracking
- Ratings & reviews

**Seller**

- Registration & KYC
- Store creation
- Product CRUD
- Inventory management
- Order fulfillment

**Admin**

- Seller approval
- Order monitoring
- Commission management
- Dispute resolution

### 6.2 Out of Scope (Phase 1)

- Mobile App
- AI recommendation
- Flash sale engine
- Multi-currency wallet
- Advanced promotion engine

---

## 7. Business Requirements

### 7.1 Functional Requirements

#### FR-01: User Registration & Authentication

**Description:** System shall allow customer and seller account creation.

**Acceptance Criteria:**

- Email must be unique
- Email verification required
- Password stored using strong hashing (Argon2/Bcrypt)
- JWT-based authentication
- Session expiration configurable

---

#### FR-02: Seller Onboarding & KYC

**Acceptance Criteria:**

- Seller submits legal/business info
- Admin approval required
- Seller cannot publish products until approved
- All approval actions logged

---

#### FR-03: Product Management

**Acceptance Criteria:**

- Seller can create/update/delete products
- SKU must be unique per seller
- Price > 0
- Support variants (size, color)
- Images stored via CDN
- Product searchable within 5 seconds after publish

---

#### FR-04: Inventory Control

**Acceptance Criteria:**

- Stock cannot go below zero
- Inventory reserved at checkout
- Reservation expires after configurable timeout
- Atomic deduction on payment confirmation
- High concurrency safe

---

#### FR-05: Cart & Checkout

**Acceptance Criteria:**

- Cart persists for logged-in user
- Validate stock before checkout
- Calculate shipping & commission
- Generate unique Order ID
- Order status = `PENDING_PAYMENT` initially

---

#### FR-06: Payment Processing

**Acceptance Criteria:**

- Integrate at least 1 PCI-compliant gateway
- Webhook updates order status
- Idempotent payment confirmation
- Payment failure auto-cancels order after timeout

---

#### FR-07: Order Lifecycle Management

**States:**

- `PENDING_PAYMENT`
- `PAID`
- `PROCESSING`
- `SHIPPED`
- `COMPLETED`
- `CANCELLED`
- `REFUNDED`

**Acceptance Criteria:**

- State transitions validated
- Invalid transitions rejected
- All state changes auditable

---

#### FR-08: Commission Calculation

**Acceptance Criteria:**

- Commission rate configurable
- Commission calculated per seller
- Stored in settlement ledger
- Admin can generate payout report

---

### 7.2 Non-Functional Requirements

| Category      | Requirement                   |
| ------------- | ----------------------------- |
| Performance   | p95 API < 200ms               |
| Scalability   | 1M users capability           |
| Availability  | 99.9% uptime                  |
| Security      | OWASP Top 10 protection       |
| Observability | Centralized logging & tracing |
| Backup        | Daily full backup             |
| DR            | RTO < 2h, RPO < 15m           |

---

## 8. Stakeholder Requirements & Personas

### Persona 1: Buyer (APAC Urban User)

- Mobile-first but uses web
- Wants fast checkout
- Sensitive to price & delivery time

**Needs:**

- Transparent pricing
- Secure payment
- Easy returns

### Persona 2: SME Seller

- Limited technical knowledge
- Needs simple dashboard
- Requires inventory visibility

**Needs:**

- Real-time stock view
- Sales analytics
- Fast payout

### Persona 3: Operations Admin

**Needs:**

- Seller management
- Fraud detection visibility
- Dispute management tools

---

## 9. Use Cases & User Journeys

### UC-01: Buyer Places Order

1. Browse catalog
2. Add to cart
3. Checkout
4. Payment redirect
5. Payment webhook confirmation
6. Order confirmation email

### UC-02: Seller Fulfillment

1. Seller receives notification
2. Updates status to `PROCESSING`
3. Ships item
4. Marks as `SHIPPED`

### UC-03: Refund Flow

1. Buyer requests refund
2. Admin reviews
3. Approves refund
4. Payment gateway processes refund
5. Order status = `REFUNDED`

---

## 10. Data Requirements & Conceptual Data Model

### Core Entities

| Entity               | Fields                                    |
| -------------------- | ----------------------------------------- |
| User                 | id, email, role, status                   |
| Seller               | id, user_id, store_name, kyc_status       |
| Product              | id, seller_id, sku, price, status         |
| ProductVariant       | id, product_id, attributes, stock         |
| InventoryReservation | id, sku, quantity, expires_at             |
| Cart                 | id, user_id                               |
| Order                | id, buyer_id, status, total_amount        |
| OrderItem            | id, order_id, product_id, quantity, price |
| Payment              | id, order_id, status, provider_reference  |
| Commission           | id, order_id, seller_id, amount           |

### Relationships

- Seller `1:N` Product
- Product `1:N` Variant
- Order `1:N` OrderItem
- Order `1:1` Payment
- Order `1:N` Commission

---

## 11. Interfaces & Integration Requirements

### External

- Payment Gateway (Stripe, Adyen, etc.)
- Email service
- SMS notification
- CDN
- Shipping provider (optional MVP+)

### Internal

- REST APIs
- Webhooks
- Admin dashboard UI

---

## 12. Quality Attributes

**Security:**

- Rate limiting
- CSRF protection
- Secure cookies
- CSP headers

**Performance:**

- Redis caching
- DB indexing
- Pagination

**Reliability:**

- Retry mechanism
- Circuit breaker
- Idempotency keys

**Maintainability:**

- Clean architecture
- Domain-driven design
- Observability dashboards

---

## 13. Constraints, Risks & Assumptions

### Constraints

- Startup budget
- Limited team size
- Third-party payment dependency

### Risks

- Payment gateway downtime
- Overselling under concurrency
- Fraud transactions
- Regulatory variation across APAC

### Assumptions

- Single currency in MVP
- Single region deployment
- Web only

---

## 14. Regulatory & Compliance

For APAC:

- **PCI-DSS** (payment handling)
- **PDPA** (Singapore)
- **Personal Data Protection Act** (Thailand)
- **GDPR-like compliance** if EU users
- Data encryption at rest & transit
- Seller KYC compliance

---

## 15. Acceptance Criteria & Success Metrics

| KPI                    | Target      |
| ---------------------- | ----------- |
| Conversion rate        | >= 3%       |
| Checkout latency       | < 2 seconds |
| Cart abandonment       | < 60%       |
| Refund rate            | < 5%        |
| Uptime                 | >= 99.9%    |
| Seller onboarding time | < 48 hours  |

---

## 16. Release Plan & Milestones

| Phase   | Description           | Duration   |
| ------- | --------------------- | ---------- |
| Phase 0 | Architecture & Design | 1 month    |
| Phase 1 | Core Marketplace MVP  | 3 months   |
| Phase 2 | Growth Optimization   | 2-3 months |
| Phase 3 | Regional Expansion    | TBD        |

---

## 17. Governance Model

- Scrum framework
- 2-week sprint cadence
- Weekly stakeholder demo
- Monthly KPI review
- Change control via Product Owner

---

## 18. Appendices

### Glossary

| Term | Definition               |
| ---- | ------------------------ |
| SKU  | Stock Keeping Unit       |
| GMV  | Gross Merchandise Value  |
| KYC  | Know Your Customer       |
| RTO  | Recovery Time Objective  |
| RPO  | Recovery Point Objective |

---

### System Context Diagram (Text Description)

```
User → Web App → API Gateway
                  │
        ┌─────────┼─────────┬──────────┬──────────┐
        │         │         │          │          │
    Identity   Catalog   Inventory   Order    Payment
    Module     Module     Module    Module    Module
        │         │         │          │          │
        └─────────┴─────────┴──────────┴──────────┘
                  │
               Database
```

Domain Modules: Identity & Access, Catalog, Inventory, Cart, Order, Payment, Seller, Admin, Notification

---

### Test Strategy

| Type                | Detail                  |
| ------------------- | ----------------------- |
| Unit Testing        | 80% code coverage       |
| Integration Testing | Payment & order flows   |
| Load Testing        | 10K concurrent checkout |
| Security Testing    | OWASP scan              |
| UAT                 | With pilot sellers      |
