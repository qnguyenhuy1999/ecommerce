# Security

**Version:** 1.0.0 | **Date:** 2026-04-07

> **Related Documents:**
> - [BRD.md](./../01-requirements/BRD.md) — NFR security requirements (Section 12) and regulatory compliance (Section 14)
> - [GLOSSARY.md](./../01-requirements/GLOSSARY.md) — Security term definitions
> - [API_DESIGN.md](./API_DESIGN.md) — API authentication requirements

---

## Table of Contents

1. [Authentication](#1-authentication)
2. [Authorization (RBAC)](#2-authorization-rbac)
3. [Input Validation](#3-input-validation)
4. [OWASP Top 10 Checklist](#4-owasp-top-10-checklist)
5. [Rate Limiting](#5-rate-limiting)
6. [PCI-DSS Compliance](#6-pci-dss-compliance)
7. [Data Protection](#7-data-protection)
8. [API Security](#8-api-security)
9. [Secrets Management](#9-secrets-management)

---

## 1. Authentication

### Password Hashing

- **Algorithm:** Argon2id (preferred) or bcrypt with cost factor >= 12
- **Minimum password length:** 8 characters
- **Requirements:** Must include uppercase, lowercase, and numeric characters
- **Hash storage:** `password` field in User table stores the hash only, never plaintext

```typescript
// NestJS example using argon2
import * as argon2 from 'argon2';

async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 65536,  // 64MB
    timeCost: 3,
    parallelism: 4,
  });
}

async function verifyPassword(hash: string, password: string): Promise<boolean> {
  return argon2.verify(hash, password);
}
```

### JWT Token Management

- **Access Token:**
  - Algorithm: RS256 (asymmetric) or HS256 (symmetric for MVP)
  - Expiry: 15 minutes
  - Payload: `{ sub: userId, email, role, iat, exp }`

- **Refresh Token:**
  - Expiry: 7 days
  - Storage: HTTP-only secure cookie OR encrypted in database
  - Single-use: each refresh invalidates the previous token
  - Rotation: after refresh, issue new refresh token

```typescript
interface JwtPayload {
  sub: string;       // user ID
  email: string;
  role: UserRole;
  iat: number;       // issued at
  exp: number;        // expiration
}
```

### Session Management

- Sessions tracked via JWT (stateless) with Redis blacklist for logout
- Refresh tokens stored in database with expiry for revocation capability
- Failed login lockout: 5 failed attempts, 15-minute lockout
- All auth events (login, logout, refresh, failure) logged

---

## 2. Authorization (RBAC)

### Roles and Permissions

| Permission | USER | SELLER | ADMIN |
|------------|------|--------|-------|
| Browse products | Yes | Yes | Yes |
| Manage own cart | Yes | Yes | Yes |
| Checkout & order | Yes | Yes | Yes |
| View own orders | Yes | Yes | Yes |
| Manage own seller profile | No | Yes | Yes |
| CRUD own products | No | Yes | Yes |
| View own sub-orders | No | Yes | Yes |
| Update sub-order status | No | Yes | Yes |
| Manage own seller ledger | No | Yes | Yes |
| View own analytics | No | Yes | Yes |
| View all sellers | No | No | Yes |
| Approve seller KYC | No | No | Yes |
| Manage all orders | No | No | Yes |
| Resolve disputes | No | No | Yes |
| Generate payout reports | No | No | Yes |
| System configuration | No | No | Yes |

### Resource Ownership

- Users can only access their own data (orders, cart, notifications)
- Sellers can only modify their own products and view their own sub-orders
- Resource ownership check on every protected endpoint:

```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
async updateProduct(@Param('id') id: string, @CurrentUser() user: User) {
  const product = await this.productService.findOne(id);
  if (product.sellerId !== user.seller?.id) {
    throw new ForbiddenException('NOT_PRODUCT_OWNER');
  }
  return this.productService.update(id, dto);
}
```

---

## 3. Input Validation

### Request Validation

- Use class-validator with DTOs for all request bodies
- Validate type, format, range, and custom constraints
- Never trust client-provided IDs without ownership verification

```typescript
// Example DTO with validation
export class CreateProductDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name: string;

  @IsNumber()
  @Min(0.01)
  price: number;

  @IsString()
  @IsUUID()
  categoryId: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images: string[];
}
```

### SQL Injection Prevention

- **Always use Prisma's parameterized queries** — never concatenate user input into SQL strings
- Prisma uses parameterized queries under the hood for all `where`, `data`, and `include` inputs
- For raw queries (discouraged), use parameterized placeholders exclusively

```typescript
// SAFE — Prisma parameterized
const user = await prisma.user.findUnique({
  where: { email: userInput },
});

// UNSAFE — never do this
await prisma.$queryRaw`SELECT * FROM users WHERE email = ${userInput}`;
```

### XSS Prevention

- Sanitize user-generated content (reviews, descriptions) before rendering
- Use Content Security Policy (CSP) headers
- Angular/React auto-escape by default; be careful with `innerHTML` / `dangerouslySetInnerHTML`

---

## 4. OWASP Top 10 Checklist

### A01 — Broken Access Control

- [ ] Every endpoint enforces authentication (except public ones)
- [ ] Resource ownership verified before any modification
- [ ] Direct object references (IDs) are not exposed without authorization
- [ ] Admin endpoints restricted to ADMIN role only
- [ ] CORS configured to allow only trusted origins
- [ ] No information in URLs that reveals sensitive resources

### A02 — Cryptographic Failures

- [ ] All passwords hashed with Argon2id or bcrypt
- [ ] Sensitive data (bank accounts, KYC docs) encrypted at rest
- [ ] TLS 1.2+ enforced for all connections
- [ ] No sensitive data in URLs, logs, or error messages
- [ ] Keys managed via environment variables, never hardcoded

### A03 — Injection

- [ ] Prisma ORM used (parameterized queries)
- [ ] No raw SQL with string interpolation
- [ ] Input validation on all endpoints
- [ ] HTML output encoding for user-generated content

### A04 — Insecure Design

- [ ] Threat modeling performed for new features
- [ ] Rate limiting on all public endpoints
- [ ] Idempotency keys prevent duplicate operations
- [ ] Inventory never decremented below zero

### A05 — Security Misconfiguration

- [ ] Default credentials changed
- [ ] Unnecessary features/ports disabled
- [ ] Error messages return generic responses, not stack traces
- [ ] Dev tools/settings not deployed to production
- [ ] Regular dependency vulnerability scanning (npm audit, Snyk)

### A06 — Vulnerable Components

- [ ] Regular `npm audit` in CI pipeline
- [ ] No packages with known critical vulnerabilities
- [ ] Pin dependency versions in production
- [ ] Keep Node.js runtime updated

### A07 — Authentication Failures

- [ ] Secure password policy enforced
- [ ] Account lockout after failed login attempts
- [ ] JWT tokens expire appropriately (15 min access, 7 day refresh)
- [ ] Refresh token rotation implemented
- [ ] Password reset uses secure tokens with expiry

### A08 — Software and Data Integrity Failures

- [ ] CI/CD pipeline validates integrity of dependencies
- [ ] No unsigned code deployed
- [ ] Database migrations reviewed before execution
- [ ] Webhook signatures verified before processing

### A09 — Security Logging and Monitoring

- [ ] All authentication events logged (login, logout, failure)
- [ ] All authorization failures logged
- [ ] Error responses include correlation ID for tracing
- [ ] Monitoring dashboards for suspicious activity
- [ ] Alerting on repeated failed auth attempts

### A10 — Server-Side Request Forgery (SSRF)

- [ ] Webhook handlers validate callback origins
- [ ] No user-provided URLs used for internal resource fetching without validation
- [ ] Allowlist approach for external service URLs

---

## 5. Rate Limiting

### Strategy

| Endpoint Type | Limit | Window | Response |
|--------------|-------|--------|----------|
| Auth (login/register) | 10 requests | 1 minute | 429 |
| Auth (refresh) | 30 requests | 1 minute | 429 |
| Public read (products, search) | 100 requests | 1 minute | 429 |
| Authenticated (cart, orders) | 60 requests | 1 minute | 429 |
| Payment webhook | No limit | — | 200 |
| File upload | 10 requests | 1 minute | 429 |

### Implementation

- Redis sliding window counter for distributed rate limiting
- Return `X-RateLimit-*` headers in responses
- Circuit breaker on payment gateway calls

```typescript
// Example: NestJS throttler
@UseGuards(ThrottlerGuard)
@Controller('auth')
export class AuthController {
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post('login')
  async login(@Body() dto: LoginDto) { ... }
}
```

---

## 6. PCI-DSS Compliance

The platform uses Stripe as the payment processor. Under this model:

### Our Responsibilities

- [ ] Never store full credit card numbers, CVV, or cardholder data
- [ ] Only store Stripe `paymentIntent` IDs and metadata
- [ ] Verify Stripe webhook signatures before processing
- [ ] Use HTTPS for all payment-related communications
- [ ] Log payment events securely without sensitive data
- [ ] Maintain PCI compliance awareness for future card data handling

### Stripe Responsibilities (Level 1 SAQ-A)

- Card data collection and transmission
- Card data storage and encryption
- PCI-DSS certification of their infrastructure

### Webhook Security

```typescript
async handleStripeWebhook(
  @Headers('stripe-signature') signature: string,
  @Body() payload: Buffer,
) {
  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET,
  );

  switch (event.type) {
    case 'payment_intent.succeeded':
      await this.paymentService.processPaymentSuccess(event.data.object);
      break;
    case 'payment_intent.payment_failed':
      await this.paymentService.processPaymentFailure(event.data.object);
      break;
  }
}
```

---

## 7. Data Protection

### PDPA Compliance (Singapore)

- [ ] Collect only necessary personal data with consent
- [ ] Provide data access and deletion rights to users
- [ ] Encrypt personal data at rest and in transit
- [ ] Data retention policy: delete inactive accounts after 7 years
- [ ] Breach notification procedure documented

### Encryption

- **At rest:** PostgreSQL Transparent Data Encryption (TDE) + disk-level encryption
- **In transit:** TLS 1.2+ for all connections, HSTS header
- **Sensitive fields:** Bank account numbers, KYC document URLs encrypted with AES-256 before storage

### Data Handling

| Data Type | Storage | Encryption |
|-----------|---------|-----------|
| User email | DB | At rest |
| User password | DB (hashed) | At rest |
| Payment tokens | DB | At rest |
| KYC documents | S3 (signed URLs only) | At rest + signed URLs |
| Bank account | DB | Field-level encryption |
| Personal data in orders | DB | At rest |

---

## 8. API Security

### CORS Configuration

```typescript
// Allow only known origins in production
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || [],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
```

### Security Headers

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
Referrer-Policy: strict-origin-when-cross-origin
Content-Security-Policy: default-src 'self'; script-src 'self'
Cache-Control: no-store, no-cache, must-revalidate
```

### CSRF Protection

- JWT-based auth with Bearer tokens eliminates cookie-based CSRF risk
- For browser clients: use `SameSite=Strict` cookies if session cookies are used
- Validate `Origin` or `Referer` header on state-changing requests

---

## 9. Secrets Management

### Rules

1. **Never hardcode secrets** in source code — use environment variables
2. **Rotate secrets** regularly (quarterly for API keys, annually for signing keys)
3. **Use secret management service** in production (AWS Secrets Manager, HashiCorp Vault)
4. **Separate secrets per environment** (dev, staging, production)
5. **Audit secret access** — log when and by whom secrets are accessed

### Required Environment Variables

```bash
# Authentication
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Database
DATABASE_URL=

# Redis
REDIS_URL=

# Payment Gateway
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PUBLISHABLE_KEY=

# Encryption
ENCRYPTION_KEY=        # AES-256 key for field-level encryption

# Application
APP_SECRET=            # Application-level secret for misc encryption
ALLOWED_ORIGINS=       # Comma-separated list of allowed CORS origins

# Email
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=

# CDN
CDN_BUCKET_NAME=
CDN_ACCESS_KEY_ID=
CDN_SECRET_ACCESS_KEY=
```

### Development

- Use `.env.example` file committed to repo with placeholder values
- Actual secrets stored in `.env` (gitignored) or a secrets manager
- Never print secrets in logs or error messages
