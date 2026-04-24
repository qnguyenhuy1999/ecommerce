# Authentication Flow — api-storefront

**Version:** 1.1.0 | **Date:** 2026-04-24

> **Related Documents:**
>
> - [SECURITY.md](./SECURITY.md) — Security architecture, OWASP checklist, rate limiting strategy
> - [API_DESIGN.md](./API_DESIGN.md) — Full endpoint specifications
> - [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) — `User` and `RefreshToken` table definitions

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Token Design](#2-token-design)
3. [Endpoints](#3-endpoints)
4. [Flow: Register](#4-flow-register)
5. [Flow: Login](#5-flow-login)
6. [Flow: Refresh](#6-flow-refresh)
7. [Flow: Logout](#7-flow-logout)
8. [Flow: Get Current User](#8-flow-get-current-user)
9. [Guards & Strategies](#9-guards--strategies)
10. [Infrastructure Adapters](#10-infrastructure-adapters)
11. [Security Properties](#11-security-properties)
12. [Known Limitations](#12-known-limitations)
13. [Configuration Reference](#13-configuration-reference)

---

## 1. Architecture Overview

The auth module follows **Clean Architecture** with **CQRS** (NestJS CqrsModule). Every
mutation is a Command; reads are Queries. Infrastructure concerns are injected via
dependency-inversion ports (Symbols), making the domain layer fully testable without
framework or infrastructure dependencies.

```
Presentation Layer     Application Layer          Domain Layer        Infrastructure Layer
─────────────────────  ─────────────────────────  ──────────────────  ───────────────────────────
AuthController         RegisterHandler            UserEntity          PrismaUserRepository
  POST /auth/register  LoginHandler               RefreshTokenEntity  PrismaRefreshTokenRepository
  POST /auth/login     RefreshHandler             Exceptions          Argon2HasherAdapter
  POST /auth/refresh   LogoutHandler              Ports (interfaces)  RedisTokenBlacklistAdapter
  POST /auth/logout    MeHandler                                      RedisLoginLimiterAdapter
  GET  /auth/me        JwtTokenService                                ExpressCookieWriterAdapter
                                                                      JwtAccessStrategy
                                                                      JwtRefreshStrategy
                                                                      TokenCleanupTask
```

---

## 2. Token Design

### Access Token

- **Transport:** `access_token` HttpOnly cookie, path `/`
- **Default lifetime:** 15 minutes (`JWT_ACCESS_EXPIRY`)
- **Payload:** `{ sub, email, role, jti }`
- **Secret:** `JWT_ACCESS_SECRET`
- **Revocation:** Redis blacklist keyed by `jti` (`bl:jti:<jti>`)

### Refresh Token

- **Transport:** `refresh_token` HttpOnly cookie, path `/api/v1/auth`
- **Default lifetime:** 7 days (`JWT_REFRESH_EXPIRY`)
- **Payload:** `{ sub, family, jti }`
- **Secret:** `JWT_REFRESH_SECRET` (separate from access secret)
- **Storage:** PostgreSQL `RefreshToken` table — only the **Argon2 hash of `jti`** is stored, never the raw token
- **Revocation:** `revokedAt` timestamp set on the DB row; `replacedBy` links to the successor token

### Token Family

Each login or registration creates a new `family` UUID. All refresh tokens issued from the
same login session share the same family. This enables:

- **Token rotation:** the old token is revoked and a new one is issued atomically on every refresh
- **Reuse detection:** if a revoked token is presented, the entire family is revoked immediately

---

## 3. Endpoints

| Method | Path             | Guard             | Rate Limit       | Description                                       |
| ------ | ---------------- | ----------------- | ---------------- | ------------------------------------------------- |
| POST   | `/auth/register` | none              | 5 req / 15 min   | Create account and issue token pair               |
| POST   | `/auth/login`    | none              | 5 req / 15 min   | Authenticate and issue token pair                 |
| POST   | `/auth/refresh`  | `JwtRefreshGuard` | 30 req / 1 min   | Rotate token pair using refresh cookie            |
| POST   | `/auth/logout`   | `JwtAccessGuard`  | global (100/min) | Blacklist access token, revoke all refresh tokens |
| GET    | `/auth/me`       | `JwtAccessGuard`  | global (100/min) | Return current authenticated user                 |

Cookies are always **HttpOnly**, **SameSite=Strict**, and **Secure** (configurable via
`COOKIE_SECURE` env var, defaults to `true`).

---

## 4. Flow: Register

```
Client                          AuthController           RegisterHandler
  │                                    │                        │
  │── POST /auth/register ────────────>│                        │
  │   { email, password }              │                        │
  │                                    │── RegisterCommand ────>│
  │                                    │                        │── existsByEmail()
  │                                    │                        │   └─ ConflictException if taken
  │                                    │                        │── argon2.hash(password)
  │                                    │                        │── userRepo.create()
  │                                    │                        │── generateAccessToken()
  │                                    │                        │── generateRefreshToken(family=UUID)
  │                                    │                        │── argon2.hash(jti) → store in DB
  │                                    │<── LoginResult ────────│
  │                                    │── writeAuthCookies()   │
  │<── 201 { user } + cookies ─────────│                        │
```

**Notes:**

- Tokens are issued directly after user creation — no second `argon2.verify` round trip.
- The new user gets role `USER` and status `UNVERIFIED` (can still login — see [Known Limitations](#12-known-limitations)).

---

## 5. Flow: Login

```
Client                          AuthController           LoginHandler
  │                                    │                        │
  │── POST /auth/login ───────────────>│                        │
  │   { email, password }              │                        │
  │                                    │── LoginCommand ───────>│
  │                                    │                        │── loginLimiter.isLocked(email)
  │                                    │                        │   └─ 401 if ≥5 failures in 15 min
  │                                    │                        │── userRepo.findByEmail()
  │                                    │                        │   └─ recordFailure() + 401 if not found
  │                                    │                        │── argon2.verify(password, hash)
  │                                    │                        │   └─ recordFailure() + 401 if wrong
  │                                    │                        │── check status != SUSPENDED
  │                                    │                        │── check canLogin()
  │                                    │                        │── loginLimiter.reset(email)
  │                                    │                        │── generateAccessToken()
  │                                    │                        │── generateRefreshToken(family=UUID)
  │                                    │                        │── argon2.hash(jti) → store in DB
  │                                    │<── LoginResult ────────│
  │                                    │── writeAuthCookies()   │
  │<── 200 { user } + cookies ─────────│                        │
```

**Login lockout:**

- Failed attempts are tracked in Redis under `login:fail:<email>` with a 15-minute TTL
- After 5 failures the account is locked for the remainder of the 15-minute window
- A successful login resets the counter immediately

---

## 6. Flow: Refresh

```
Client                    JwtRefreshStrategy     AuthController        RefreshHandler
  │                              │                     │                     │
  │── POST /auth/refresh ───────>│                     │                     │
  │   [refresh_token cookie]     │                     │                     │
  │                              │── verify JWT sig    │                     │
  │                              │── extract payload   │                     │
  │                              │   { sub, family, jti}                     │
  │                              │──────────────────── >│                    │
  │                              │                     │── RefreshCommand ──>│
  │                              │                     │                     │── findByFamily(family)
  │                              │                     │                     │   WHERE revokedAt IS NULL
  │                              │                     │                     │   AND expiresAt > NOW()
  │                              │                     │                     │── argon2.verify(jti, each hash)
  │                              │                     │                     │
  │                              │   NOT FOUND ────────────────────────────  │
  │                              │                     │                     │── revokeFamily() ← REUSE DETECTED
  │                              │                     │                     │── 401 Unauthorized
  │                              │                     │                     │
  │                              │   FOUND ────────────────────────────────  │
  │                              │                     │                     │── check user ACTIVE / canLogin()
  │                              │                     │                     │── generateAccessToken()
  │                              │                     │                     │── generateRefreshToken(same family)
  │                              │                     │                     │── create new DB row
  │                              │                     │                     │── revokeById(old, replacedBy=new)
  │                              │                     │<── LoginResult ─────│
  │                              │                     │── writeAuthCookies()│
  │<── 200 { user } + new cookies──────────────────────│                     │
```

**Reuse detection:** If a token from a revoked (already-rotated) generation is presented,
`findByFamily` returns no active match. The entire family is revoked immediately, forcing
the user to log in again. This prevents an attacker who stole a refresh token from
silently maintaining access after the legitimate user has rotated it.

---

## 7. Flow: Logout

```
Client                    JwtAccessStrategy      AuthController         LogoutHandler
  │                              │                     │                      │
  │── POST /auth/logout ────────>│                     │                      │
  │   [access_token cookie]      │                     │                      │
  │                              │── verify JWT sig    │                      │
  │                              │── isBlacklisted(jti)│                      │
  │                              │   └─ 401 if already revoked                │
  │                              │──────────────────── >│                     │
  │                              │                     │── LogoutCommand ────>│
  │                              │                     │   (userId, jti, ttl) │
  │                              │                     │                      │── Redis: SETEX bl:jti:<jti> <ttl>
  │                              │                     │                      │── DB: revokeAllByUserId()
  │                              │                     │<─────────────────────│
  │                              │                     │── clearAuthCookies() │
  │<── 200 { message } ─────────────────────────────── │                      │
```

**Immediate invalidation:** The access token's remaining TTL is calculated (`exp - now`) and
used as the Redis key TTL. The token cannot be reused even within its 15-minute window.

**All-device logout:** `revokeAllByUserId` revokes every refresh token across all devices
and sessions for that user. This is intentional for the MVP — per-device session management
can be added later.

---

## 8. Flow: Get Current User

```
Client                    JwtAccessStrategy      AuthController        MeHandler
  │                              │                     │                    │
  │── GET /auth/me ─────────────>│                     │                    │
  │   [access_token cookie]      │                     │                    │
  │                              │── verify JWT sig    │                    │
  │                              │── isBlacklisted(jti)│                    │
  │                              │──────────────────── >│                   │
  │                              │                     │── MeQuery ────────>│
  │                              │                     │                    │── userRepo.findById()
  │                              │                     │<── UserEntity ─────│
  │<── 200 { user } ────────────────────────────────── │                    │
```

---

## 9. Guards & Strategies

### `JwtAccessGuard` → `JwtAccessStrategy`

- Extracts the `access_token` cookie
- Verifies JWT signature against `JWT_ACCESS_SECRET`
- Checks Redis blacklist for the `jti` — rejects if present
- Injects `{ userId, email, role, jti, exp }` as `req.user`

### `JwtRefreshGuard` → `JwtRefreshStrategy`

- Extracts the `refresh_token` cookie (scoped to `/api/v1/auth`)
- Verifies JWT signature against `JWT_REFRESH_SECRET`
- Does **not** check DB at this stage — the `RefreshHandler` does the hash verification
- Injects `{ userId, family, jti }` as `req.user`

### `RolesGuard`

- Reads `@Roles(...)` metadata set on controller methods
- Compares against `req.user.role`
- Returns 403 if the role is insufficient

---

## 10. Infrastructure Adapters

| Port                      | Symbol                     | Adapter                        | Backend                |
| ------------------------- | -------------------------- | ------------------------------ | ---------------------- |
| `IUserRepository`         | `USER_REPOSITORY`          | `PrismaUserRepository`         | PostgreSQL             |
| `IRefreshTokenRepository` | `REFRESH_TOKEN_REPOSITORY` | `PrismaRefreshTokenRepository` | PostgreSQL             |
| `IPasswordHasher`         | `PASSWORD_HASHER`          | `Argon2HasherAdapter`          | argon2                 |
| `ITokenBlacklist`         | `TOKEN_BLACKLIST`          | `RedisTokenBlacklistAdapter`   | Redis (`bl:jti:*`)     |
| `ILoginLimiter`           | `LOGIN_LIMITER`            | `RedisLoginLimiterAdapter`     | Redis (`login:fail:*`) |
| `ICookieWriter`           | `COOKIE_WRITER`            | `ExpressCookieWriterAdapter`   | Express Response       |

### `TokenCleanupTask`

A background task (`OnModuleInit` + `setInterval`) that runs `deleteExpired()` every 24 hours
to purge expired refresh token rows from the database. Runs once on startup, then every 24h.

### Redis Key Namespaces

| Key Pattern          | TTL                        | Purpose                         |
| -------------------- | -------------------------- | ------------------------------- |
| `bl:jti:<jti>`       | Remaining access token TTL | Access token blacklist (logout) |
| `login:fail:<email>` | 900s (15 min)              | Failed login attempt counter    |

---

## 11. Security Properties

| Property              | Implementation                                                |
| --------------------- | ------------------------------------------------------------- |
| Password hashing      | Argon2id via `Argon2HasherAdapter`                            |
| Refresh token storage | Only Argon2 hash of `jti` stored — raw token never persisted  |
| Token rotation        | Old refresh token revoked atomically on every `/auth/refresh` |
| Reuse detection       | Missing active match → entire family revoked immediately      |
| Immediate logout      | Access token blacklisted in Redis for remaining TTL           |
| Login lockout         | 5 failed attempts → 15-minute lockout tracked in Redis        |
| Account suspension    | Enforced at both `/login` and `/refresh` — no silent re-mint  |
| XSS protection        | All tokens in HttpOnly cookies — not accessible to browser JS |
| CSRF protection       | `SameSite=Strict` on all auth cookies                         |
| Transport security    | `Secure=true` by default (`COOKIE_SECURE` env override)       |
| Refresh token scope   | `refresh_token` cookie limited to path `/api/v1/auth`         |

---

## 12. Known Limitations

### `UNVERIFIED` users can authenticate

`UserEntity.canLogin()` returns `true` for both `ACTIVE` and `UNVERIFIED` statuses.
There is no email verification flow implemented yet. Unverified users have full API access.

**Mitigation plan:** Implement an email verification endpoint and restrict `canLogin()` to
`ACTIVE` only once the email flow is in place. Alternatively, gate specific high-value
operations (checkout, seller registration) behind `isActive()` checks.

### Logout is global (all devices)

`/auth/logout` revokes all refresh token families for the user via `revokeAllByUserId`.
There is no per-session or per-device logout.

**Mitigation plan:** Store a `deviceId` or `sessionId` in the refresh token payload and
expose a `DELETE /auth/sessions/:id` endpoint for targeted revocation.

### No auth event audit log

Login, logout, refresh, and failure events are logged via NestJS Logger (structured JSON via
`nestjs-pino`) but are not persisted to an audit table or forwarded to an external SIEM.

**Mitigation plan:** Add an `AuthEvent` table or emit events to a BullMQ queue for async
audit log persistence.

---

## 13. Configuration Reference

| Environment Variable | Default      | Description                                                   |
| -------------------- | ------------ | ------------------------------------------------------------- |
| `JWT_ACCESS_SECRET`  | **required** | HMAC secret for access tokens                                 |
| `JWT_REFRESH_SECRET` | **required** | HMAC secret for refresh tokens (must differ from access)      |
| `JWT_ACCESS_EXPIRY`  | `15m`        | Access token lifetime (e.g. `15m`, `1h`)                      |
| `JWT_REFRESH_EXPIRY` | `7d`         | Refresh token lifetime (e.g. `7d`, `30d`)                     |
| `COOKIE_SECURE`      | `true`       | Set `Secure` flag on auth cookies — disable only in local dev |
| `COOKIE_DOMAIN`      | _(unset)_    | Cookie domain scope — leave unset for same-origin             |
| `REDIS_HOST`         | `localhost`  | Redis host for token blacklist and login limiter              |
| `REDIS_PORT`         | `6379`       | Redis port                                                    |
| `REDIS_PASSWORD`     | _(unset)_    | Redis password                                                |

> **Security note:** `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` must be cryptographically
> random strings of at least 32 bytes. They must be different values. Rotate them quarterly.
> Never commit them to source control.
