# Database Schema

**Version:** 1.0.0 | **Date:** 2026-04-07

> **Related Documents:**
> - [BRD.md](./../01-requirements/BRD.md) — Entity definitions from conceptual data model (Section 10)
> - [GLOSSARY.md](./../01-requirements/GLOSSARY.md) — Term definitions
> - [API_DESIGN.md](./API_DESIGN.md) — API endpoints consuming this schema

---

## Overview

This document defines the complete database schema using **Prisma ORM**. The schema follows the conceptual data model from BRD Section 10 with extensions for operational needs.

All tables include:
- `id` (CUID) as primary key
- `createdAt` and `updatedAt` timestamps (except immutable ledger and log tables)
- Soft deletes via `deletedAt` where applicable

---

## Enums

```prisma
enum UserRole {
  USER
  SELLER
  ADMIN
}

enum UserStatus {
  UNVERIFIED
  ACTIVE
  SUSPENDED
}

enum KycStatus {
  PENDING
  APPROVED
  REJECTED
}

enum ProductStatus {
  DRAFT
  ACTIVE
  INACTIVE
  DELETED
}

enum OrderStatus {
  PENDING_PAYMENT
  PAID
  PROCESSING
  SHIPPED
  COMPLETED
  CANCELLED
  REFUNDED
  PENDING_REFUND
}

enum PaymentStatus {
  PENDING
  SUCCESS
  FAILED
  REFUNDED
}

enum ReservationStatus {
  ACTIVE
  EXPIRED
  CONFIRMED
}

enum LedgerType {
  CREDIT
  DEBIT
}

enum NotificationType {
  ORDER_PAID
  ORDER_SHIPPED
  ORDER_COMPLETED
  ORDER_CANCELLED
  REFUND_APPROVED
  REFUND_REJECTED
  SELLER_APPROVED
  SELLER_REJECTED
  PAYMENT_SUCCESS
  PAYMENT_FAILED
  NEW_ORDER
}
```

---

## Models

### User

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  password      String
  role          UserRole  @default(USER)
  status        UserStatus @default(UNVERIFIED)
  emailVerified DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  seller         Seller?
  carts          Cart[]
  orders         Order[]           @relation("BuyerOrders")
  notifications  Notification[]
  reviews        Review[]

  @@index([email])
  @@index([role])
  @@index([status])
}
```

---

### Seller

```prisma
model Seller {
  id                       String    @id @default(cuid())
  userId                   String    @unique
  user                     User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  storeName                String    @unique
  storeDescription         String?
  kycStatus                KycStatus @default(PENDING)
  kycDocuments             Json?     // { businessReg, identityDoc, bankAccount }
  commissionRate            Float     @default(0.10) // 10% default
  rating                   Float     @default(0)
  totalRatings             Int       @default(0)
  businessRegistrationNumber String?
  bankAccountNumber        String?
  bankCode                 String?
  createdAt                DateTime  @default(now())
  updatedAt                DateTime  @updatedAt

  products    Product[]
  subOrders   SubOrder[]
  commissions Commission[]
  ledger      SellerLedger[]
  reviews     Review[]

  @@index([userId])
  @@index([kycStatus])
  @@index([storeName])
  @@index([rating])
}
```

---

### Product

```prisma
model Product {
  id          String        @id @default(cuid())
  sellerId    String
  seller      Seller        @relation(fields: [sellerId], references: [id], onDelete: Cascade)
  sku         String
  name        String
  description String?
  price       Float
  status      ProductStatus @default(DRAFT)
  categoryId  String?
  images      String[]      // CDN URLs
  rating      Float         @default(0)
  reviewCount Int           @default(0)
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
  deletedAt   DateTime?

  variants Variant[]
  reviews Review[]

  @@unique([sellerId, sku])
  @@index([sellerId])
  @@index([status])
  @@index([categoryId])
  @@index([name])
  @@index([price])
  @@index([deletedAt])
}
```

---

### ProductVariant

```prisma
model ProductVariant {
  id             String   @id @default(cuid())
  productId      String
  product        Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  sku            String
  attributes     Json     // { color: "Black", size: "M" }
  priceOverride  Float?   // null means use parent product price
  stock          Int      @default(0)
  reservedStock  Int      @default(0)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  cartItems            CartItem[]
  inventoryReservations InventoryReservation[]
  orderItems           OrderItem[]

  @@unique([productId, sku])
  @@index([productId])
  @@index([sku])
}
```

---

### InventoryReservation

```prisma
model InventoryReservation {
  id         String            @id @default(cuid())
  variantId  String
  variant    ProductVariant    @relation(fields: [variantId], references: [id], onDelete: Cascade)
  orderId    String
  quantity   Int
  expiresAt  DateTime
  status     ReservationStatus @default(ACTIVE)
  createdAt DateTime          @default(now())

  @@index([variantId])
  @@index([orderId])
  @@index([status])
  @@index([expiresAt])
  @@index([status, expiresAt])
}
```

---

### Cart

```prisma
model Cart {
  id        String    @id @default(cuid())
  userId    String    @unique
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  items CartItem[]

  @@index([userId])
}
```

---

### CartItem

```prisma
model CartItem {
  id        String        @id @default(cuid())
  cartId    String
  cart      Cart          @relation(fields: [cartId], references: [id], onDelete: Cascade)
  variantId String
  variant   ProductVariant @relation(fields: [variantId], references: [id], onDelete: Cascade)
  quantity  Int
  createdAt DateTime      @default(now())

  @@unique([cartId, variantId])
  @@index([cartId])
  @@index([variantId])
}
```

---

### Order

```prisma
model Order {
  id              String    @id @default(cuid())
  orderNumber     String    @unique // ORD-YYYYMMDD-XXX
  buyerId         String
  buyer           User      @relation("BuyerOrders", fields: [buyerId], references: [id], onDelete: Restrict)
  status          OrderStatus @default(PENDING_PAYMENT)
  subtotal        Float
  shippingFee     Float     @default(0)
  totalAmount     Float
  shippingAddress Json      // { fullName, phone, addressLine1, addressLine2, city, postalCode, country }
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  deletedAt       DateTime?

  subOrders SubOrder[]
  payment   Payment?
  reviews   Review[]

  @@index([buyerId])
  @@index([status])
  @@index([orderNumber])
  @@index([createdAt])
  @@index([deletedAt])
}
```

---

### SubOrder

```prisma
model SubOrder {
  id                 String      @id @default(cuid())
  orderId            String
  order              Order       @relation(fields: [orderId], references: [id], onDelete: Cascade)
  sellerId           String
  seller             Seller      @relation(fields: [sellerId], references: [id], onDelete: Restrict)
  subtotal           Float
  status             OrderStatus @default(PENDING_PAYMENT)
  shippingTracking   Json?       // { carrier, trackingNumber }
  createdAt          DateTime    @default(now())
  updatedAt          DateTime    @updatedAt

  items OrderItem[]

  @@unique([orderId, sellerId])
  @@index([orderId])
  @@index([sellerId])
  @@index([status])
}
```

---

### OrderItem

```prisma
model OrderItem {
  id             String        @id @default(cuid())
  subOrderId     String
  subOrder       SubOrder      @relation(fields: [subOrderId], references: [id], onDelete: Cascade)
  variantId      String
  variant        ProductVariant @relation(fields: [variantId], references: [id], onDelete: Restrict)
  quantity       Int
  unitPrice      Float
  priceSnapshot  Json          // { sku, name, attributes } at time of purchase
  createdAt      DateTime      @default(now())

  @@index([subOrderId])
  @@index([variantId])
}
```

---

### Payment

```prisma
model Payment {
  id                 String        @id @default(cuid())
  orderId            String        @unique
  order              Order         @relation(fields: [orderId], references: [id], onDelete: Cascade)
  provider           String        // stripe, adyen, etc.
  providerReference  String?       // payment intent ID from gateway
  amount             Float
  currency           String        @default("SGD")
  status             PaymentStatus @default(PENDING)
  idempotencyKey    String        @unique
  webhookReceivedAt DateTime?
  createdAt          DateTime      @default(now())
  updatedAt          DateTime      @updatedAt

  @@index([orderId])
  @@index([provider])
  @@index([status])
  @@index([idempotencyKey])
  @@index([providerReference])
}
```

---

### Commission

```prisma
model Commission {
  id        String   @id @default(cuid())
  orderId   String
  order     Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  sellerId  String
  seller    Seller   @relation(fields: [sellerId], references: [id], onDelete: Cascade)
  amount    Float
  rate      Float    // commission rate used
  createdAt DateTime @default(now())

  @@unique([orderId, sellerId])
  @@index([orderId])
  @@index([sellerId])
  @@index([createdAt])
}
```

---

### Notification

```prisma
model Notification {
  id        String           @id @default(cuid())
  userId    String
  user      User             @relation(fields: [userId], references: [id], onDelete: Cascade)
  type      NotificationType
  title     String
  body      String
  data      Json?            // { orderId, productId, etc. }
  isRead    Boolean          @default(false)
  createdAt DateTime         @default(now())

  @@index([userId])
  @@index([isRead])
  @@index([createdAt])
  @@index([userId, isRead, createdAt])
}
```

---

### SellerLedger

```prisma
model SellerLedger {
  id            String     @id @default(cuid())
  sellerId      String
  seller        Seller     @relation(fields: [sellerId], references: [id], onDelete: Cascade)
  type          LedgerType
  amount        Float
  referenceType String?    // e.g., "ORDER", "PAYOUT", "REFUND"
  referenceId   String?    // ID of the referenced entity
  description   String?
  createdAt     DateTime   @default(now())

  @@index([sellerId])
  @@index([type])
  @@index([referenceType, referenceId])
  @@index([createdAt])
  @@index([sellerId, createdAt])
}
```

---

### Review

```prisma
model Review {
  id        String   @id @default(cuid())
  orderId   String
  order     Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  sellerId  String
  seller    Seller   @relation(fields: [sellerId], references: [id], onDelete: Cascade)
  productId String
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  rating    Int      // 1-5
  comment   String?
  createdAt DateTime @default(now())

  @@unique([orderId, productId, userId])
  @@index([sellerId])
  @@index([productId])
  @@index([userId])
  @@index([rating])
}
```

---

## Index Strategy Summary

| Table | Indexes | Purpose |
|-------|---------|---------|
| User | email, role, status | Auth lookups, role filtering |
| Seller | userId, kycStatus, storeName, rating | User->seller lookup, admin queries, search |
| Product | sellerId+sku (unique), status, categoryId, name, price, deletedAt | CRUD, category browse, search |
| ProductVariant | productId+sku (unique), productId, sku | Variant lookup, stock queries |
| InventoryReservation | variantId, orderId, status, expiresAt, status+expiresAt | Cleanup jobs, stock management |
| Cart | userId (unique) | Single cart per user |
| CartItem | cartId+variantId (unique), cartId, variantId | Cart operations |
| Order | buyerId, status, orderNumber, createdAt, deletedAt | Buyer history, admin ops |
| SubOrder | orderId+sellerId (unique), orderId, sellerId, status | Multi-seller queries |
| OrderItem | subOrderId, variantId | Order detail, analytics |
| Payment | orderId (unique), provider, status, idempotencyKey, providerReference | Payment ops, webhook matching |
| Commission | orderId+sellerId (unique), orderId, sellerId, createdAt | Settlement, reporting |
| Notification | userId, isRead, createdAt, userId+isRead+createdAt | Inbox, unread count |
| SellerLedger | sellerId, type, referenceType+referenceId, createdAt, sellerId+createdAt | Balance calc, reconciliation |
| Review | orderId+productId+userId (unique), sellerId, productId, userId, rating | Product/seller ratings |

---

## Data Integrity Rules

1. **Inventory:** `stock >= 0` enforced at application layer. `reservedStock <= stock` enforced by triggers or application logic.
2. **Order total:** `totalAmount = subtotal + shippingFee`, enforced at application layer.
3. **Ledger:** Never update `Seller.balance` directly. Always append `SellerLedger` entries and compute balance on read.
4. **Soft deletes:** `deletedAt` is set (not row deletion) for Order and Product to maintain referential integrity for historical data.
5. **Idempotency:** Payment and order operations use idempotency keys with unique constraints to prevent duplicates.
6. **Price snapshot:** OrderItem stores `priceSnapshot` (JSON) to preserve the product/variant price at the time of purchase.
