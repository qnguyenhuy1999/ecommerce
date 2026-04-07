# Testing Strategy

**Version:** 1.0.0 | **Date:** 2026-04-07

> **Related Documents:**
> - [API_DESIGN.md](./API_DESIGN.md) — API endpoints to test
> - [BRD.md](./../01-requirements/BRD.md) — Acceptance criteria to verify
> - [INFRASTRUCTURE.md](./INFRASTRUCTURE.md) — Test environment setup

---

## Table of Contents

1. [Testing Pyramid](#1-testing-pyramid)
2. [Unit Tests](#2-unit-tests)
3. [Integration Tests](#3-integration-tests)
4. [E2E Tests](#4-e2e-tests)
5. [Load Testing](#5-load-testing)
6. [Security Testing](#6-security-testing)
7. [Test Data Management](#7-test-data-management)
8. [CI Integration](#8-ci-integration)

---

## 1. Testing Pyramid

```
                          /\
                         /E2E\
                        /     \        <-- Critical user journeys (Playwright)
                       /-------\       <-- 10 tests
                      /         \
                     /Integration\     <-- API flows (Supertest) - 50 tests
                    /-------------\   <-- 50 tests
                   /               \
                  /    Unit Tests   \ <-- Services, utils (Jest) - 200+ tests
                 /-------------------\ <-- 200+ tests

Target coverage: >= 80% for services
```

| Layer | Tools | Scope | Target | CI Gate |
|-------|-------|-------|--------|---------|
| Unit | Jest | Services, utils, validators | 200+ tests, 80% coverage | Yes — must pass |
| Integration | Supertest + Jest | API endpoints, DB flows | 50 tests | Yes — must pass |
| E2E | Playwright | Critical user journeys | 10+ scenarios | Optional on PR, full on staging |
| Load | k6 | Checkout, product browse | 5K concurrent | Weekly on staging |
| Security | OWASP ZAP | All endpoints | Baseline scan | Monthly |

---

## 2. Unit Tests

### Framework & Configuration

```bash
npm install --save-dev jest @nestjs/testing ts-jest @types/jest
```

```typescript
// jest.config.ts
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.spec.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.module.ts',
    '!src/main.ts',
    '!src/**/*.dto.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
```

### What to Test

1. **Services** — business logic, state transitions, error cases
2. **Validators & DTOs** — input validation rules
3. **Utils/Helpers** — pure functions, transformers
4. **Guards & Decorators** — permission checks
5. **State machines** — order status transitions

### Example: Order Service Unit Test

```typescript
describe('OrderService', () => {
  let orderService: OrderService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        OrderService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    orderService = module.get(OrderService);
    prisma = module.get(PrismaService);
  });

  describe('createOrder', () => {
    it('should create order with PENDING_PAYMENT status', async () => {
      mockPrisma.order.create.mockResolvedValue({
        id: 'order-123',
        status: 'PENDING_PAYMENT',
        totalAmount: 100,
        buyerId: 'buyer-123',
      });

      const result = await orderService.createOrder({
        buyerId: 'buyer-123',
        cartId: 'cart-123',
        shippingAddress: mockAddress,
        idempotencyKey: 'idem-123',
      });

      expect(result.status).toBe('PENDING_PAYMENT');
      expect(mockPrisma.order.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            status: 'PENDING_PAYMENT',
          }),
        }),
      );
    });

    it('should throw CONFLICT error on idempotency key reuse', async () => {
      mockPrisma.order.findUnique.mockResolvedValue({
        id: 'existing-order',
        idempotencyKey: 'idem-123',
      });

      await expect(
        orderService.createOrder({
          buyerId: 'buyer-123',
          cartId: 'cart-123',
          idempotencyKey: 'idem-123',
        }),
      ).rejects.toThrow(IdempotencyKeyConflictException);
    });
  });

  describe('order status transitions', () => {
    it('should transition PENDING_PAYMENT -> PAID', async () => {
      mockPrisma.order.update.mockResolvedValue({ status: 'PAID' });
      const result = await orderService.updateStatus('order-123', 'PAID');
      expect(result.status).toBe('PAID');
    });

    it('should reject invalid transition PENDING_PAYMENT -> SHIPPED', async () => {
      mockPrisma.order.findUnique.mockResolvedValue({
        status: 'PENDING_PAYMENT',
      });

      await expect(
        orderService.updateStatus('order-123', 'SHIPPED'),
      ).rejects.toThrow(InvalidStatusTransitionException);
    });
  });
});
```

### Example: Inventory Reservation

```typescript
describe('InventoryService.reserveStock', () => {
  it('should reserve stock using optimistic locking', async () => {
    mockPrisma.productVariant.findUnique.mockResolvedValue({
      id: 'variant-1',
      stock: 10,
      version: 1,
    });
    mockPrisma.productVariant.update.mockResolvedValue({
      stock: 8,
      version: 2,
    });

    const result = await service.reserveStock('variant-1', 2);

    expect(result.remaining).toBe(8);
    expect(mockPrisma.productVariant.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'variant-1', version: 1 },
        data: expect.objectContaining({
          stock: 8,
          reservedStock: 2,
          version: 2,
        }),
      }),
    );
  });

  it('should throw OUT_OF_STOCK when stock is insufficient', async () => {
    mockPrisma.productVariant.findUnique.mockResolvedValue({
      stock: 1,
      version: 1,
    });

    await expect(service.reserveStock('variant-1', 5)).rejects.toThrow(
      InsufficientStockException,
    );
  });
});
```

---

## 3. Integration Tests

### Setup

```typescript
// test/integration.setup.ts
beforeAll(async () => {
  // Use separate test database
  process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/marketplace_test';
  await migrateDatabase();
  await seedTestData();
});

afterAll(async () => {
  await cleanupDatabase();
  await prisma.$disconnect();
});
```

### Test Categories

**Auth Flow:**

```typescript
describe('Auth Module (Integration)', () => {
  describe('POST /auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: 'new@test.com', password: 'TestPass123' });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe('new@test.com');
      expect(res.body.data.status).toBe('UNVERIFIED');
    });

    it('should reject duplicate email', async () => {
      await createTestUser({ email: 'existing@test.com' });
      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: 'existing@test.com', password: 'TestPass123' });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('EMAIL_EXISTS');
    });
  });

  describe('POST /auth/login', () => {
    it('should return JWT tokens on valid credentials', async () => {
      await createTestUser({
        email: 'login@test.com',
        password: await hashPassword('TestPass123'),
      });

      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'login@test.com', password: 'TestPass123' });

      expect(res.status).toBe(200);
      expect(res.body.data.accessToken).toBeDefined();
      expect(res.body.data.refreshToken).toBeDefined();
    });

    it('should reject invalid password', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'login@test.com', password: 'WrongPass123' });

      expect(res.status).toBe(401);
    });
  });
});
```

**Checkout Flow:**

```typescript
describe('Checkout Flow (Integration)', () => {
  let authToken: string;
  let seller: Seller;
  let product: Product;

  beforeEach(async () => {
    // Setup: create seller, product, and cart
    seller = await createApprovedSeller();
    product = await createProduct({ sellerId: seller.id, stock: 10 });
    authToken = await getAuthToken({ role: 'USER' });
  });

  it('should complete full checkout flow', async () => {
    // Add to cart
    const cartRes = await request(app.getHttpServer())
      .post('/cart/items')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ variantId: product.defaultVariantId, quantity: 2 });

    expect(cartRes.status).toBe(201);

    // Checkout
    const checkoutRes = await request(app.getHttpServer())
      .post('/orders')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        shippingAddress: mockAddress,
        paymentMethod: 'stripe',
        idempotencyKey: `checkout-${Date.now()}`,
      });

    expect(checkoutRes.status).toBe(201);
    expect(checkoutRes.body.data.status).toBe('PENDING_PAYMENT');
    expect(checkoutRes.body.data.paymentIntent).toBeDefined();
  });

  it('should fail checkout when stock is insufficient', async () => {
    await updateVariant({ stock: 0 });

    const res = await request(app.getHttpServer())
      .post('/orders')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        paymentMethod: 'stripe',
        idempotencyKey: `checkout-${Date.now()}`,
      });

    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe('INSUFFICIENT_STOCK');
  });
});
```

**Payment Webhook:**

```typescript
describe('Payment Webhook (Integration)', () => {
  it('should process payment success webhook idempotently', async () => {
    const order = await createPendingOrder();

    // First webhook call
    const res1 = await request(app.getHttpServer())
      .post('/payments/webhook')
      .set('stripe-signature', 'valid-signature')
      .send(mockPaymentIntentSucceeded(order.idempotencyKey));

    expect(res1.status).toBe(200);

    // Duplicate webhook call
    const res2 = await request(app.getHttpServer())
      .post('/payments/webhook')
      .set('stripe-signature', 'valid-signature')
      .send(mockPaymentIntentSucceeded(order.idempotencyKey));

    expect(res2.status).toBe(200);
    // Order status should not change (idempotent)
    const updatedOrder = await getOrder(order.id);
    expect(updatedOrder.status).toBe('PAID');
  });
});
```

---

## 4. E2E Tests

### Setup (Playwright)

```typescript
// e2e/checkout.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Critical User Journeys', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('user can browse, add to cart, and checkout', async ({ page }) => {
    // Browse products
    await page.click('[data-testid="search-input"]');
    await page.fill('[data-testid="search-input"]', 'wireless mouse');
    await page.click('[data-testid="search-button"]');
    await page.waitForSelector('[data-testid="product-card"]');

    // Add to cart
    await page.click('[data-testid="product-card"]:first-child');
    await page.click('[data-testid="add-to-cart"]');
    await expect(page.locator('[data-testid="cart-count"]')).toHaveText('1');

    // Checkout
    await page.click('[data-testid="checkout-button"]');
    await page.fill('[data-testid="address-form"]', mockAddress);
    await page.click('[data-testid="place-order"]');
    await expect(page.locator('[data-testid="order-confirmation"]')).toBeVisible();
  });

  test('seller can register and add products', async ({ page }) => {
    // Login as seller
    await page.goto('/login');
    await page.fill('[name="email"]', 'seller@test.com');
    await page.fill('[name="password"]', 'TestPass123');
    await page.click('[data-testid="login-button"]');

    // Navigate to seller dashboard
    await page.goto('/seller/dashboard');

    // Add product
    await page.click('[data-testid="add-product"]');
    await page.fill('[name="name"]', 'New Product');
    await page.fill('[name="price"]', '29.99');
    await page.fill('[name="sku"]', 'NP-001');
    await page.click('[data-testid="publish-product"]');

    await expect(page.locator('[data-testid="product-list"]')).toContainText('New Product');
  });
});
```

---

## 5. Load Testing

### k6 Script: Checkout Flow

```javascript
// k6/checkout-load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 100 },   // Ramp up
    { duration: '1m', target: 1000 },  // Sustain
    { duration: '30s', target: 5000 },  // Spike
    { duration: '1m', target: 5000 },   // Sustained peak
    { duration: '30s', target: 0 },     // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<300'],  // p95 < 300ms
    http_req_failed: ['rate<0.01'],   // Error rate < 1%
    checkout_success_rate: ['rate>0.95'],
  },
};

export default function () {
  const baseUrl = 'https://api-staging.marketplace.com/v1';

  // Get auth token
  const loginRes = http.post(`${baseUrl}/auth/login`, JSON.stringify({
    email: `loadtest_${__VU}@test.com`,
    password: 'LoadTest123',
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  const token = loginRes.json('data.accessToken');

  // Get cart
  const cartRes = http.get(`${baseUrl}/cart`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  // Checkout
  const checkoutRes = http.post(`${baseUrl}/orders`, JSON.stringify({
    shippingAddress: {
      fullName: 'Load Test',
      phone: '+6590000000',
      addressLine1: '123 Test St',
      city: 'Singapore',
      postalCode: '123456',
      country: 'SG',
    },
    paymentMethod: 'stripe',
    idempotencyKey: `k6-${__VU}-${__ITER}-${Date.now()}`,
  }), {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  check(checkoutRes, {
    'checkout status 201': (r) => r.status === 201,
    'checkout returns orderId': (r) => r.json('data.orderId') !== undefined,
  });

  sleep(1);
}
```

---

## 6. Security Testing

### OWASP ZAP Baseline Scan

```yaml
# .github/workflows/security-scan.yml
name: Security Scan

on:
  schedule:
    - cron: '0 0 1 * *'  # Monthly
  workflow_dispatch:

jobs:
  zap-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Start API
        run: docker compose up -d api
      - name: OWASP ZAP Scan
        uses: zaproxy/action-baseline@v0.9.0
        with:
          target: 'https://localhost:3000/api'
          rules: '-rules /zap/zap-baseline.rule'
          zap_options: '-config api.addrs.addr.type=REGEX -config api.addrs.addr.desc=\\d+'
```

---

## 7. Test Data Management

### Factories

```typescript
// test/factories/index.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function createTestUser(overrides = {}) {
  return prisma.user.create({
    data: {
      email: `test-${Date.now()}@test.com`,
      password: await hash('TestPass123'),
      role: 'USER',
      status: 'ACTIVE',
      emailVerified: new Date(),
      ...overrides,
    },
  });
}

export async function createTestSeller(user?: User, overrides = {}) {
  const userOrCreated = user || await createTestUser();
  return prisma.seller.create({
    data: {
      userId: userOrCreated.id,
      storeName: `Store-${Date.now()}`,
      kycStatus: 'APPROVED',
      ...overrides,
    },
  });
}

export async function createTestProduct(sellerId: string, overrides = {}) {
  const sku = `SKU-${Date.now()}-${Math.random()}`;
  return prisma.product.create({
    data: {
      sellerId,
      sku,
      name: `Test Product ${sku}`,
      price: 29.99,
      status: 'ACTIVE',
      ...overrides,
    },
  });
}
```

### Cleanup

```typescript
// Clean up between tests
afterEach(async () => {
  await prisma.notification.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.subOrder.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.inventoryReservation.deleteMany();
});
```

---

## 8. CI Integration

### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  unit:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - run: npm ci
      - run: npm test --workspace=apps/api -- --coverage --ci
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: coverage
          path: apps/api/coverage

  integration:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - run: npm ci
      - run: npm run test:integration --workspace=apps/api -- --ci
```

### Coverage Enforcement

Coverage must remain above 80%. PRs that reduce coverage below threshold will fail CI.
