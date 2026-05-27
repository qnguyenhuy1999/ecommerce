# Project Context — ecommerce-v2

Multi-vendor ecommerce marketplace like Shopee/Lazada/Tiki.

Build production-ready marketplace with clean UX and scalable architecture.

## Main domains

```txt
Storefront        # buyer/customer experience
Seller Center     # seller management
Admin Panel       # platform control
```

## Core marketplace behavior

- Multiple sellers can sell products.
- Buyer can add products from many sellers to cart.
- Cart is grouped by seller.
- Checkout splits order per seller.
- Each seller manages own products, orders, inventory, returns.
- Admin moderates sellers, products, users, disputes, and platform settings.

## MVP focus

Prioritize:

- auth/session/RBAC
- buyer product browsing
- cart and checkout basics
- order splitting by seller
- seller product/order management
- admin moderation basics
- stable API contracts
- clean UI package structure

## Storefront goals

Buyer UI should optimize:

- product discovery
- trust
- fast add-to-cart
- smooth checkout
- clear price and shipping info
- mobile conversion

Common surfaces:

- homepage
- category/search results
- product detail
- shop page
- cart
- checkout
- order tracking
- account profile

## Seller Center goals

Seller UI should optimize:

- fast product creation
- clear order handling
- low cognitive load
- visible business metrics
- easy inventory/pricing updates
- simple return/refund handling

Common surfaces:

- seller dashboard
- product list
- add/edit product
- order list/detail
- returns/refunds
- promotions
- shop profile
- analytics

## Admin Panel goals

Admin UI should optimize:

- moderation speed
- risk visibility
- auditability
- platform control
- safe destructive actions

Common surfaces:

- admin dashboard
- seller moderation
- product moderation
- user management
- order/dispute review
- categories
- banners/content
- audit logs

## Architecture direction

Backend:

```txt
NestJS REST APIs
Prisma
PostgreSQL
Redis
OpenAPI contracts
```

Frontend:

```txt
Next.js
React
Tailwind
UI packages
Server components first
```

Packages:

```txt
shared       # pure helpers/constants
contracts    # enums/API contracts/OpenAPI types
nestjs-core  # backend common infra
database     # Prisma
core-ui      # primitives
ui-*         # domain UI packages
```

## Non-functional goals

- scalable to millions of users
- high availability target >=99.9%
- secure by default
- OWASP-aware
- JWT/session/RBAC safe
- fast APIs where possible, target <200ms for common reads
- maintainable monorepo boundaries

## Product principles

- MVP first. Do not overbuild.
- Clear seller workflow beats fancy UI.
- Checkout is critical path.
- Product page must build trust.
- Admin actions must be auditable.
- Platform rules should be explicit and contract-driven.
