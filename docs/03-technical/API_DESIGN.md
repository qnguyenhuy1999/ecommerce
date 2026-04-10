# API Design

**Version:** 1.0.0 | **Date:** 2026-04-07

> **Related Documents:**
>
> - [BRD.md](./../01-requirements/BRD.md) — Functional requirements FR-01 through FR-08 drive these endpoints
> - [GLOSSARY.md](./../01-requirements/GLOSSARY.md) — Term definitions
> - [SECURITY.md](./SECURITY.md) — Authentication and authorization requirements

---

## Table of Contents

1. [API Conventions](#1-api-conventions)
2. [Auth Module](#2-auth-module)
3. [User Module](#3-user-module)
4. [Seller Module](#4-seller-module)
5. [Product Module](#5-product-module)
6. [Cart Module](#6-cart-module)
7. [Order Module](#7-order-module)
8. [Payment Module](#8-payment-module)
9. [Notification Module](#9-notification-module)

---

## 1. API Conventions

### Base URL

```
https://api.marketplace.com/v1
```

### Versioning

- All endpoints are prefixed with `/v1`
- Breaking changes require a new version (`/v2`)
- Non-breaking additions are allowed in the current version

### Response Format

**Success (2xx):**

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}
```

**Error (4xx/5xx):**

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable error message",
    "details": [{ "field": "email", "message": "Email is required" }]
  }
}
```

### HTTP Status Codes

| Code | Usage                                    |
| ---- | ---------------------------------------- |
| 200  | Success (GET, PATCH)                     |
| 201  | Created (POST)                           |
| 204  | No Content (DELETE)                      |
| 400  | Bad Request / Validation Error           |
| 401  | Unauthorized (no/invalid token)          |
| 403  | Forbidden (insufficient permissions)     |
| 404  | Not Found                                |
| 409  | Conflict (e.g., out of stock, duplicate) |
| 422  | Unprocessable Entity                     |
| 429  | Too Many Requests (rate limited)         |
| 500  | Internal Server Error                    |

### Pagination

```
GET /products?page=1&limit=20&sort=createdAt&order=desc
```

- Default page size: 20
- Maximum page size: 100
- Response includes `meta` with `page`, `limit`, `total`, `totalPages`

### Authentication

- Bearer token in `Authorization` header: `Authorization: Bearer <jwt_token>`
- Access token expires in 15 minutes
- Refresh token expires in 7 days

---

## 2. Auth Module

### POST /auth/register

Register a new user account.

**Auth Required:** No

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "SecureP@ss123",
  "role": "USER"
}
```

| Field    | Type   | Required | Description                                            |
| -------- | ------ | -------- | ------------------------------------------------------ |
| email    | string | Yes      | Unique email address                                   |
| password | string | Yes      | Min 8 chars, must include uppercase, lowercase, number |
| role     | enum   | No       | `USER` (default) or `SELLER`                           |

**Response (201):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "USER",
    "status": "UNVERIFIED",
    "createdAt": "2026-04-07T00:00:00Z"
  }
}
```

**Errors:**

- 400: `EMAIL_EXISTS`, `VALIDATION_ERROR`
- 422: `INVALID_PASSWORD_FORMAT`

---

### POST /auth/login

Authenticate and receive JWT tokens.

**Auth Required:** No

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "SecureP@ss123"
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGci...",
    "refreshToken": "eyJhbGci...",
    "expiresIn": 900,
    "tokenType": "Bearer"
  }
}
```

**Errors:**

- 401: `INVALID_CREDENTIALS`

---

### POST /auth/refresh

Refresh access token using refresh token.

**Auth Required:** No (but refresh token in body)

**Request Body:**

```json
{
  "refreshToken": "eyJhbGci..."
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGci...",
    "refreshToken": "eyJhbGci...",
    "expiresIn": 900,
    "tokenType": "Bearer"
  }
}
```

**Errors:**

- 401: `INVALID_REFRESH_TOKEN`, `TOKEN_EXPIRED`

---

### POST /auth/logout

Invalidate refresh token.

**Auth Required:** Yes

**Request Body:**

```json
{
  "refreshToken": "eyJhbGci..."
}
```

**Response (200):**

```json
{
  "success": true,
  "data": { "message": "Logged out successfully" }
}
```

---

### POST /auth/verify-email

Verify email address using token from verification email.

**Auth Required:** No (token in body)

**Request Body:**

```json
{
  "token": "verification-token-uuid"
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "emailVerified": true
  }
}
```

**Errors:**

- 400: `INVALID_TOKEN`, `TOKEN_EXPIRED`, `ALREADY_VERIFIED`

---

## 3. User Module

### GET /users/me

Get current user profile.

**Auth Required:** Yes

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "USER",
    "status": "ACTIVE",
    "emailVerified": true,
    "createdAt": "2026-04-07T00:00:00Z",
    "updatedAt": "2026-04-07T00:00:00Z"
  }
}
```

---

### PATCH /users/me

Update current user profile.

**Auth Required:** Yes

**Request Body:**

```json
{
  "password": "NewSecureP@ss456",
  "currentPassword": "OldSecureP@ss123"
}
```

| Field           | Type   | Required | Description                             |
| --------------- | ------ | -------- | --------------------------------------- |
| password        | string | No       | New password (requires currentPassword) |
| currentPassword | string | No       | Required when changing password         |

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "updatedAt": "2026-04-07T00:00:00Z"
  }
}
```

**Errors:**

- 400: `CURRENT_PASSWORD_REQUIRED`, `INVALID_CURRENT_PASSWORD`
- 422: `INVALID_PASSWORD_FORMAT`

---

### GET /users/me/orders

Get orders for the current user.

**Auth Required:** Yes

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| page | int | 1 | Page number |
| limit | int | 20 | Items per page |
| status | enum | — | Filter by order status |
| sort | string | createdAt | Sort field |
| order | enum | desc | Sort direction (asc/desc) |

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "orderNumber": "ORD-20260407-001",
      "status": "PAID",
      "subtotal": 150.0,
      "shippingFee": 10.0,
      "totalAmount": 160.0,
      "itemCount": 3,
      "createdAt": "2026-04-07T00:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 5,
    "totalPages": 1
  }
}
```

---

## 4. Seller Module

### POST /sellers/register

Register as a seller (requires existing USER account with verified email).

**Auth Required:** Yes (USER role)

**Request Body:**

```json
{
  "storeName": "My Electronics Store",
  "storeDescription": "Quality electronics from Singapore",
  "businessRegistrationNumber": "202012345A",
  "bankAccountNumber": "1234567890",
  "bankCode": "SCB"
}
```

| Field                      | Type   | Required | Description                   |
| -------------------------- | ------ | -------- | ----------------------------- |
| storeName                  | string | Yes      | Unique store display name     |
| storeDescription           | string | No       | Store bio/description         |
| businessRegistrationNumber | string | Yes      | Government-issued business ID |
| bankAccountNumber          | string | Yes      | For payouts                   |
| bankCode                   | string | Yes      | Bank identifier               |

**Response (201):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "storeName": "My Electronics Store",
    "kycStatus": "PENDING",
    "createdAt": "2026-04-07T00:00:00Z"
  }
}
```

**Errors:**

- 400: `STORE_NAME_EXISTS`, `SELLER_ALREADY_REGISTERED`
- 403: `EMAIL_NOT_VERIFIED`

---

### GET /sellers/:id

Get seller public profile.

**Auth Required:** No

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "storeName": "My Electronics Store",
    "storeDescription": "Quality electronics from Singapore",
    "rating": 4.5,
    "totalProducts": 42,
    "createdAt": "2026-04-07T00:00:00Z"
  }
}
```

---

### PATCH /sellers/:id

Update seller store information. Only the seller themselves can update.

**Auth Required:** Yes (owner only)

**Request Body:**

```json
{
  "storeName": "Updated Store Name",
  "storeDescription": "Updated description"
}
```

**Response (200):** Updated seller data.

**Errors:**

- 403: `NOT_SELLER_OWNER`
- 404: `SELLER_NOT_FOUND`

---

### GET /sellers/:id/products

List products for a specific seller.

**Auth Required:** No

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| page | int | 1 | Page number |
| limit | int | 20 | Items per page |
| status | enum | ACTIVE | Filter by product status |
| category | string | — | Filter by category ID |

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "sku": "ELEC-001",
      "name": "Wireless Mouse",
      "price": 29.99,
      "status": "ACTIVE",
      "categoryId": "uuid",
      "images": ["https://cdn.example.com/mouse.jpg"],
      "variantsCount": 3,
      "rating": 4.2,
      "createdAt": "2026-04-07T00:00:00Z"
    }
  ],
  "meta": { "page": 1, "limit": 20, "total": 42, "totalPages": 3 }
}
```

---

### GET /sellers/:id/orders

Get orders for a specific seller (sub-orders where seller is the seller).

**Auth Required:** Yes (seller owner or ADMIN)

**Query Parameters:** Same as `/users/me/orders`

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "orderId": "parent-uuid",
      "orderNumber": "ORD-20260407-001",
      "status": "PROCESSING",
      "subtotal": 59.98,
      "itemCount": 2,
      "buyer": { "id": "uuid", "email": "b***@example.com" },
      "createdAt": "2026-04-07T00:00:00Z"
    }
  ],
  "meta": { "page": 1, "limit": 20, "total": 10, "totalPages": 1 }
}
```

---

### GET /sellers/:id/analytics

Get seller analytics dashboard data.

**Auth Required:** Yes (seller owner or ADMIN)

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| period | enum | `7d`, `30d`, `90d`, `365d` (default: 30d) |

**Response (200):**

```json
{
  "success": true,
  "data": {
    "totalRevenue": 15420.5,
    "totalOrders": 234,
    "totalProducts": 42,
    "averageRating": 4.5,
    "pendingOrders": 5,
    "totalCommission": 1542.05,
    "topProducts": [{ "id": "uuid", "name": "Wireless Mouse", "sold": 89 }],
    "revenueByDay": [{ "date": "2026-04-01", "amount": 520.0 }]
  }
}
```

---

## 5. Product Module

### GET /products

Search and browse products.

**Auth Required:** No

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| q | string | — | Search query |
| category | string | — | Category ID |
| sellerId | string | — | Filter by seller |
| minPrice | number | — | Minimum price |
| maxPrice | number | — | Maximum price |
| page | int | 1 | Page number |
| limit | int | 20 | Items per page |
| sort | string | createdAt | Sort field |
| order | string | desc | Sort direction |

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "sku": "ELEC-001",
      "name": "Wireless Mouse",
      "price": 29.99,
      "seller": { "id": "uuid", "storeName": "TechStore" },
      "category": { "id": "uuid", "name": "Electronics" },
      "images": ["https://cdn.example.com/mouse.jpg"],
      "rating": 4.2,
      "variantCount": 3,
      "status": "ACTIVE"
    }
  ],
  "meta": { "page": 1, "limit": 20, "total": 500, "totalPages": 25 }
}
```

---

### GET /products/:id

Get product details including variants.

**Auth Required:** No

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "sku": "ELEC-001",
    "name": "Wireless Mouse",
    "description": "High-precision wireless mouse...",
    "price": 29.99,
    "status": "ACTIVE",
    "category": { "id": "uuid", "name": "Electronics" },
    "seller": { "id": "uuid", "storeName": "TechStore", "rating": 4.5 },
    "images": ["https://cdn.example.com/mouse.jpg"],
    "variants": [
      {
        "id": "uuid",
        "sku": "ELEC-001-BLK",
        "attributes": { "color": "Black", "size": "Standard" },
        "priceOverride": null,
        "stock": 50,
        "reservedStock": 5
      }
    ],
    "rating": 4.2,
    "reviewCount": 128,
    "createdAt": "2026-04-07T00:00:00Z"
  }
}
```

---

### POST /products

Create a new product. Only approved sellers can publish.

**Auth Required:** Yes (SELLER role, kycStatus = APPROVED)

**Request Body:**

```json
{
  "sku": "ELEC-001",
  "name": "Wireless Mouse",
  "description": "High-precision wireless mouse with ergonomic design",
  "price": 29.99,
  "status": "ACTIVE",
  "categoryId": "uuid",
  "images": ["https://cdn.example.com/mouse.jpg"],
  "variants": [
    {
      "sku": "ELEC-001-BLK",
      "attributes": { "color": "Black" },
      "priceOverride": null,
      "stock": 50
    },
    {
      "sku": "ELEC-001-WHT",
      "attributes": { "color": "White" },
      "priceOverride": 32.99,
      "stock": 30
    }
  ]
}
```

| Field       | Type     | Required | Description                                  |
| ----------- | -------- | -------- | -------------------------------------------- |
| sku         | string   | Yes      | Unique per seller                            |
| name        | string   | Yes      | Max 255 chars                                |
| description | string   | No       | Max 5000 chars                               |
| price       | number   | Yes      | > 0                                          |
| status      | enum     | No       | `DRAFT` (default) or `ACTIVE`                |
| categoryId  | string   | Yes      | Valid category ID                            |
| images      | string[] | No       | CDN URLs                                     |
| variants    | array    | No       | If omitted, creates a single default variant |

**Response (201):** Created product with ID.

**Errors:**

- 400: `SKU_EXISTS`, `SKU_NOT_UNIQUE_PER_SELLER`
- 403: `KYC_NOT_APPROVED`, `CANNOT_PUBLISH_WITHOUT_APPROVAL`
- 404: `CATEGORY_NOT_FOUND`

---

### PATCH /products/:id

Update a product.

**Auth Required:** Yes (seller owner only)

**Request Body:** Partial update — any combination of fields from POST.

**Response (200):** Updated product.

**Errors:**

- 403: `NOT_PRODUCT_OWNER`
- 404: `PRODUCT_NOT_FOUND`

---

### DELETE /products/:id

Soft-delete a product (sets status to DELETED).

**Auth Required:** Yes (seller owner only)

**Response (204):** No content.

**Errors:**

- 403: `NOT_PRODUCT_OWNER`
- 404: `PRODUCT_NOT_FOUND`

---

### GET /products/:id/variants

List all variants for a product.

**Auth Required:** No

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "sku": "ELEC-001-BLK",
      "attributes": { "color": "Black" },
      "priceOverride": null,
      "stock": 50,
      "reservedStock": 5,
      "availableStock": 45
    }
  ]
}
```

---

## 6. Cart Module

### GET /cart

Get current user's cart.

**Auth Required:** Yes

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "items": [
      {
        "id": "uuid",
        "variant": {
          "id": "uuid",
          "sku": "ELEC-001-BLK",
          "product": { "id": "uuid", "name": "Wireless Mouse" },
          "attributes": { "color": "Black" },
          "priceOverride": null,
          "effectivePrice": 29.99
        },
        "quantity": 2,
        "seller": { "id": "uuid", "storeName": "TechStore" }
      }
    ],
    "subtotal": 59.98,
    "sellerGroups": [
      {
        "sellerId": "uuid",
        "storeName": "TechStore",
        "items": [...],
        "subtotal": 59.98
      }
    ],
    "itemCount": 2
  }
}
```

---

### POST /cart/items

Add item to cart.

**Auth Required:** Yes

**Request Body:**

```json
{
  "variantId": "uuid",
  "quantity": 2
}
```

| Field     | Type   | Required | Description      |
| --------- | ------ | -------- | ---------------- |
| variantId | string | Yes      | Valid variant ID |
| quantity  | int    | Yes      | Min 1, max stock |

**Response (201):**

```json
{
  "success": true,
  "data": {
    "cartItemId": "uuid",
    "variant": { ... },
    "quantity": 2,
    "cart": { ... }
  }
}
```

**Errors:**

- 400: `INSUFFICIENT_STOCK`
- 404: `VARIANT_NOT_FOUND`

---

### PATCH /cart/items/:id

Update cart item quantity.

**Auth Required:** Yes

**Request Body:**

```json
{
  "quantity": 3
}
```

**Response (200):** Updated cart item.

**Errors:**

- 400: `INSUFFICIENT_STOCK`, `INVALID_QUANTITY`
- 404: `CART_ITEM_NOT_FOUND`

---

### DELETE /cart/items/:id

Remove item from cart.

**Auth Required:** Yes

**Response (204):** No content.

**Errors:**

- 404: `CART_ITEM_NOT_FOUND`, `NOT_CART_OWNER`

---

### DELETE /cart

Clear entire cart.

**Auth Required:** Yes

**Response (204):** No content.

---

## 7. Order Module

### POST /orders

Checkout — create order from cart.

**Auth Required:** Yes

**Request Body:**

```json
{
  "shippingAddress": {
    "fullName": "John Doe",
    "phone": "+6591234567",
    "addressLine1": "123 Main Street",
    "addressLine2": "#05-123",
    "city": "Singapore",
    "postalCode": "123456",
    "country": "SG"
  },
  "paymentMethod": "stripe",
  "idempotencyKey": "unique-key-uuid"
}
```

| Field           | Type   | Required | Description                      |
| --------------- | ------ | -------- | -------------------------------- |
| shippingAddress | object | Yes      | Delivery address                 |
| paymentMethod   | string | Yes      | Payment provider identifier      |
| idempotencyKey  | string | Yes      | UUID to prevent duplicate orders |

**Response (201):**

```json
{
  "success": true,
  "data": {
    "orderId": "uuid",
    "orderNumber": "ORD-20260407-001",
    "status": "PENDING_PAYMENT",
    "subtotal": 150.0,
    "shippingFee": 10.0,
    "totalAmount": 160.0,
    "paymentIntent": {
      "clientSecret": "pi_xxx_secret_xxx",
      "provider": "stripe",
      "redirectUrl": "https://stripe.com/pay/..."
    },
    "subOrders": [
      {
        "id": "uuid",
        "sellerId": "uuid",
        "storeName": "TechStore",
        "subtotal": 59.98,
        "status": "PENDING_PAYMENT"
      }
    ]
  }
}
```

**Errors:**

- 400: `CART_EMPTY`, `IDEMPOTENCY_KEY_REUSED`
- 409: `INSUFFICIENT_STOCK` (some items no longer available)

---

### GET /orders

List orders for authenticated user.

**Auth Required:** Yes

**Query Parameters:** Same as `/users/me/orders`

**Response (200):** Same format as `/users/me/orders`.

---

### GET /orders/:id

Get order details.

**Auth Required:** Yes (buyer, seller of sub-orders, or ADMIN)

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "orderNumber": "ORD-20260407-001",
    "status": "PAID",
    "subtotal": 150.00,
    "shippingFee": 10.00,
    "totalAmount": 160.00,
    "shippingAddress": { ... },
    "buyer": { "id": "uuid", "email": "b***@example.com" },
    "subOrders": [
      {
        "id": "uuid",
        "sellerId": "uuid",
        "storeName": "TechStore",
        "subtotal": 59.98,
        "status": "PAID",
        "shippingTracking": null,
        "items": [
          {
            "id": "uuid",
            "variant": { "sku": "ELEC-001", "productName": "Wireless Mouse", "attributes": { "color": "Black" } },
            "quantity": 2,
            "unitPrice": 29.99,
            "priceSnapshot": { "sku": "ELEC-001", "price": 29.99 }
          }
        ]
      }
    ],
    "payment": {
      "id": "uuid",
      "provider": "stripe",
      "providerReference": "pi_xxx",
      "amount": 160.00,
      "status": "SUCCESS"
    },
    "createdAt": "2026-04-07T00:00:00Z"
  }
}
```

---

### PATCH /orders/:id/status

Update order status (used by sellers and admin).

**Auth Required:** Yes (seller of sub-order or ADMIN)

**Request Body:**

```json
{
  "status": "SHIPPED",
  "shippingTracking": {
    "carrier": "DHL",
    "trackingNumber": "1234567890"
  }
}
```

| Field            | Type   | Required | Description                            |
| ---------------- | ------ | -------- | -------------------------------------- |
| status           | enum   | Yes      | Valid transition from current status   |
| shippingTracking | object | No       | Required when transitioning to SHIPPED |

**Response (200):** Updated order.

**Errors:**

- 400: `INVALID_STATUS_TRANSITION`
- 403: `NOT_ORDER_OWNER` (for sub-orders) or `NOT_ADMIN`
- 404: `ORDER_NOT_FOUND`

**Valid Transitions:**

| Current         | Allowed Next          |
| --------------- | --------------------- |
| PENDING_PAYMENT | PAID, CANCELLED       |
| PAID            | PROCESSING, CANCELLED |
| PROCESSING      | SHIPPED               |
| SHIPPED         | COMPLETED, REFUNDED   |
| COMPLETED       | REFUNDED              |

---

### POST /orders/:id/refund

Request a refund for an order.

**Auth Required:** Yes (buyer only, order must be SHIPPED or COMPLETED)

**Request Body:**

```json
{
  "reason": "Product not as described",
  "requestedAmount": 160.0
}
```

| Field           | Type   | Required | Description                   |
| --------------- | ------ | -------- | ----------------------------- |
| reason          | string | Yes      | Refund reason                 |
| requestedAmount | number | No       | Full or partial refund amount |

**Response (201):**

```json
{
  "success": true,
  "data": {
    "refundId": "uuid",
    "orderId": "uuid",
    "status": "PENDING_REFUND",
    "reason": "Product not as described",
    "requestedAmount": 160.0,
    "createdAt": "2026-04-07T00:00:00Z"
  }
}
```

**Errors:**

- 400: `REFUND_ALREADY_REQUESTED`, `ORDER_NOT_REFUNDABLE`
- 404: `ORDER_NOT_FOUND`

---

## 8. Payment Module

### POST /payments/intent

Create a payment intent (usually called internally by checkout).

**Auth Required:** Yes

**Request Body:**

```json
{
  "orderId": "uuid",
  "paymentMethod": "stripe",
  "idempotencyKey": "payment-key-uuid"
}
```

**Response (201):**

```json
{
  "success": true,
  "data": {
    "paymentId": "uuid",
    "clientSecret": "pi_xxx_secret_xxx",
    "redirectUrl": "https://stripe.com/pay/...",
    "amount": 160.0,
    "currency": "SGD",
    "status": "PENDING"
  }
}
```

---

### GET /payments/:id

Get payment details.

**Auth Required:** Yes (buyer, admin)

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "orderId": "uuid",
    "provider": "stripe",
    "providerReference": "pi_xxx",
    "amount": 160.0,
    "currency": "SGD",
    "status": "SUCCESS",
    "idempotencyKey": "payment-key-uuid",
    "webhookReceivedAt": "2026-04-07T00:00:00Z",
    "createdAt": "2026-04-07T00:00:00Z"
  }
}
```

---

### POST /payments/webhook

Webhook endpoint for payment gateway callbacks.

**Auth Required:** No (validated by gateway signature)

**Headers:** `stripe-signature` (or equivalent from provider)

**Request Body:** Raw payment webhook payload from gateway.

**Response (200):**

```json
{
  "received": true
}
```

**Processing:**

1. Verify webhook signature using provider's secret
2. Check idempotency key — if already processed, return 200 immediately
3. Update payment record based on event type
4. Publish internal event (PAYMENT_SUCCESS / PAYMENT_FAILED)
5. Return 200

**Errors:**

- 400: `INVALID_SIGNATURE`

---

## 9. Notification Module

### GET /notifications

Get notifications for current user.

**Auth Required:** Yes

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| page | int | 1 | Page number |
| limit | int | 20 | Items per page |
| isRead | boolean | — | Filter by read status |

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "type": "ORDER_PAID",
      "title": "Payment Confirmed",
      "body": "Your order ORD-20260407-001 has been paid successfully.",
      "data": { "orderId": "uuid" },
      "isRead": false,
      "createdAt": "2026-04-07T00:00:00Z"
    }
  ],
  "meta": { "page": 1, "limit": 20, "total": 15, "totalPages": 1 },
  "unreadCount": 5
}
```

---

### PATCH /notifications/:id/read

Mark a notification as read.

**Auth Required:** Yes (notification owner only)

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "isRead": true
  }
}
```

**Errors:**

- 404: `NOTIFICATION_NOT_FOUND`
- 403: `NOT_NOTIFICATION_OWNER`
