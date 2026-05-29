# Ecommerce-v2 Codebase Architecture

> Generated from systematic codebase analysis. Last updated: 2026-05-29

## Monorepo Structure

**Type**: PNPM + Turborepo monorepo  
**Requirements**: Node >=24, pnpm >=11

### Apps (7)

- **Frontend**: storefront, seller, admin (Next.js 16 + React 19)
- **Backend**: api-storefront, api-seller, api-admin (NestJS)
- **Worker**: Background job processor

### Packages (13)

shared, contracts, nestjs-core, database, auth, redis, email, config, core-ui, ui-storefront, ui-seller, ui-admin, eslint-config

## Architecture Rules

1. `@ecom/shared` and `@ecom/contracts` are leaf packages - import nothing internal
2. No circular dependencies, no app-to-app imports
3. Enums/shared types from `@ecom/contracts` only - never redefine locally
4. API responses use `ApiResponse` from `@ecom/contracts`
5. Shared NestJS filters/interceptors from `@ecom/nestjs-core`
6. OpenAPI is source of truth - run `pnpm openapi:sync && pnpm contracts:check` after API changes

## Database Schema (Prisma - 3392 lines)

### Core Entities

- **Auth**: User, Session, PasswordResetToken, EmailVerifyToken
- **Sellers**: SellerProfile, Shop, Seller (admin approval entity)
- **Products**: Product, ProductVariant, ProductImage, ProductVariantOptionGroup/Option
- **Orders**: Order, SellerOrder, SellerOrderItem
- **Inventory**: InventoryTransaction, Warehouse, WarehouseStock, InventoryTransfer
- **Cart**: Cart, CartItem
- **Checkout**: CheckoutSession, CheckoutDistributionLog, UserAddress

### Marketplace Features

- **Coupons**: Coupon, CouponProduct, CouponCategory, CouponUsage
- **Reviews**: Review, ReviewImage, ReviewReply, ReviewReport
- **Chat**: Conversation, ChatMessage
- **Returns**: ReturnRequest, ReturnItem, ReturnEvidence, ReturnTimeline
- **Notifications**: Notification, UserNotification, DeliveryStatus, OutboxEvent

### Advanced Features

- **Flash Sales**: FlashSaleCampaign, FlashSaleSlot, FlashSalePurchase
- **Ads**: AdCampaign, AdGroup, Ad, AdKeyword, AdImpression, AdClick
- **Affiliates**: AffiliatePartner, AffiliateLink, AffiliateClick, AffiliateConversion
- **Subscriptions**: SubscriptionPlan, SellerSubscription, SubscriptionInvoice
- **Livestream**: LivestreamSession, LivestreamProduct, LivestreamChat
- **AI Tools**: AiTask, AiPromptTemplate, AiUsageLog
- **Loyalty**: LoyaltyTier, LoyaltyAccount, LoyaltyTransaction, LoyaltyMission
- **Wallet**: Wallet, WalletTransaction, WalletWithdrawal, SettlementBatch, SettlementItem

### Admin

- **Admin**: Admin, AdminRole, AdminSession, AdminAuditLog, AdminPasswordResetToken
- **Moderation**: ProductApproval, ProductApprovalHistory, ProductReport
- **CMS**: Banner, NotificationTemplate, AdminNotification, PlatformVoucher

## Key Patterns

### Repository Pattern

Services use repositories for data access.

```
ProductsService → ProductsRepository → Prisma
```

### Immutability

Always create new objects, never mutate existing ones. Enforced throughout codebase.

### Error Handling

- `AllExceptionsFilter` maps Prisma errors and `AppError` to `ApiErrorResponse`
- Prisma P2002 → 409 Conflict, P2025 → 404 Not Found
- Custom errors: `AppError`, `ValidationError`, `PermissionError`, `BusinessRuleError`, `NotFoundError`

### Response Wrapping

`ResponseInterceptor` wraps all successful responses:

```typescript
{ success: true, data: T, timestamp: string }
```

### Session Management

- Redis for session storage (fast lookup)
- Database for audit trail (Session table)
- Cookie-based auth with `SessionService`

### Multi-Seller Order Flow

1. Cart groups items by seller (shopId)
2. Checkout creates one Order
3. Order splits into multiple SellerOrders (one per shop)
4. Each seller manages own SellerOrder independently

## Shared Packages

### @ecom/shared (Leaf Package)

- **Constants**: routes, cache keys, events, queues, limits, regex, feature flags
- **Utils**: slugify, format (currency, date, number), truncate, cn, buildQuery
- **Errors**: AppError, ValidationError, PermissionError, BusinessRuleError, NotFoundError
- **Pagination**: offset/cursor pagination helpers for Prisma, NestJS, React

### @ecom/contracts (Leaf Package)

- **Enums**: ProductStatus, OrderStatus, UserStatus, PaymentStatus, RefundStatus, etc.
- **HTTP**: ApiResponse, ApiSuccess, ApiError, PaginationMeta
- **Generated**: OpenAPI-generated types from all 3 APIs

### @ecom/nestjs-core

- **Filters**: AllExceptionsFilter (global error handler)
- **Interceptors**: ResponseInterceptor (wraps responses)
- **OpenAPI**: Swagger builders, decorators, helpers
- **WebSocket**: RedisIoAdapter for horizontal scaling

### @ecom/database

- Prisma client export
- DatabaseModule (NestJS)
- PrismaService

### @ecom/auth

- BaseUserAuthService (register, login, logout, verifyEmail)
- SessionService (Redis-backed)
- hashPassword, comparePassword (bcrypt)
- Session types and constants

## Frontend Architecture

### Next.js Apps

- **Version**: Next.js 16 + React 19
- **Rendering**: Server Components first, client components only when needed
- **Routing**: App Router
- **Styling**: Tailwind CSS

### UI Package Hierarchy

```
apps/* → ui-storefront/seller/admin → core-ui
```

- `core-ui`: Base primitives (Button, Input, Badge, Dialog, Table)
- `ui-storefront`: Buyer UI (ProductCard, CartSummary, CheckoutSection)
- `ui-seller`: Seller UI (ProductForm, OrderTable, SellerStatsCard)
- `ui-admin`: Admin UI (ModerationQueue, AuditLogTable, UserRiskBadge)

### Auth Flow

- AuthProvider wraps app
- Session stored in HTTP-only cookies
- useProtectedRoute hook for client-side guards
- withAuth middleware for server-side guards

### Realtime

- Socket.io client
- WebSocket connection to API
- Redis pub/sub for multi-instance scaling

### API Client

- Typed fetch wrapper using generated contracts
- Base URL from env
- Cookie credentials included

## Backend Architecture

### NestJS Setup

- ValidationPipe (whitelist, forbidNonWhitelisted, transform)
- Global AllExceptionsFilter
- Global ResponseInterceptor
- Cookie parser middleware
- CORS enabled with credentials

### Auth

- Cookie-based sessions
- Redis storage + DB audit
- SessionService for CRUD
- Guards for route protection

### WebSockets

- RedisIoAdapter for horizontal scaling
- Socket.io with Redis pub/sub
- Chat gateway for real-time messaging

### OpenAPI

- Auto-generated from NestJS decorators
- Synced to contracts package via script
- Swagger UI at /api/docs (storefront), /docs (seller/admin)

### Background Jobs

- BullMQ with Redis
- Queues: email, order-processing, inventory-sync, notification, report-generation, image-processing, search-index

## Marketplace Business Logic

### Multi-Vendor Model

- Multiple sellers sell products
- Buyer cart groups items by seller
- Checkout splits order per seller
- Each seller manages own products/orders/inventory/returns
- Admin moderates sellers/products/users/disputes

### Commission System

- Platform takes commission via SettlementBatch/SettlementItem
- CommissionRule defines rates (global, category, vendor-specific)
- Wallet system tracks seller balances
- WalletWithdrawal for seller payouts

### Product Approval Workflow

1. Seller creates product (status: DRAFT)
2. Seller submits for approval (ProductApproval created)
3. Admin reviews (APPROVED/REJECTED/REVISION_REQUESTED)
4. If approved, product status → PUBLISHED
5. ProductApprovalHistory tracks all changes

### Order Flow

1. Buyer adds items to cart (Cart, CartItem)
2. Checkout creates CheckoutSession
3. CheckoutDistributionLog tracks events (inventory reserve, order create, payment)
4. Order created with multiple SellerOrders
5. Each seller fulfills own SellerOrder
6. Shipment tracking per SellerOrder
7. OrderAuditLog tracks status changes

### Return Flow

1. Buyer requests return (ReturnRequest)
2. ReturnItem specifies which items
3. ReturnEvidence uploaded (photos, etc.)
4. Seller/Admin reviews
5. ReturnTimeline tracks status changes
6. If approved, refund processed

## Testing Strategy

- **Unit**: Services, utilities, business logic
- **Integration**: API endpoints, database operations
- **E2E**: Critical flows (Playwright)
- **Coverage**: 80% minimum
- **Framework**: Vitest for unit/integration, Playwright for E2E

## Key Commands

```bash
pnpm dev                    # Start all apps
pnpm build                  # Build all
pnpm lint                   # ESLint
pnpm type-check             # TypeScript
pnpm test                   # Unit tests
pnpm test:e2e               # E2E tests
pnpm db:generate            # Prisma generate
pnpm db:migrate             # Prisma migrate
pnpm openapi:sync           # Generate OpenAPI + types
pnpm contracts:check        # Validate contracts
pnpm lint:circular          # Check circular deps
pnpm lint:deps              # Check dependency boundaries
```

## File Locations

### Configuration

- Root: `package.json`, `turbo.json`, `tsconfig.json`, `CLAUDE.md`
- Database: `packages/database/prisma/schema.prisma` (3392 lines)

### Documentation

- `docs/ai/project-context.md` - Project overview
- `docs/ai/rules-nestjs.md` - Backend patterns
- `docs/ai/rules-contracts.md` - Contract patterns
- `docs/ai/rules-ui-packages.md` - Frontend patterns
- `docs/ai/rules-testing.md` - Testing patterns
- `docs/ai/rules-engineering.md` - General engineering rules
- `docs/ai/rules-database.md` - Database patterns

### Key Source Files

- `packages/shared/src/` - Pure utilities
- `packages/contracts/src/` - Enums and types
- `packages/nestjs-core/src/` - NestJS shared infrastructure
- `packages/database/src/` - Prisma client
- `apps/api-storefront/src/` - Storefront API
- `apps/storefront/src/` - Storefront frontend
