# AI rules — NestJS apps

Backend cave. Keep layers clean. Ugg.

## Applies to

```txt
apps/api-storefront
apps/api-seller
apps/api-admin
apps/worker
```

## Goal

Keep APIs predictable, typed, documented, and safe.

Follow existing backend pattern. Do not invent new architecture.

## Layer rule

Usual flow:

```txt
controller -> service -> database/repository/client
```

Controller stays thin.

Service owns business logic.

Database layer owns persistence details.

## Controller

Controller should:

- define route
- parse query/body/params
- use DTO validation
- call service
- return contract-shaped response

Controller should not contain large business logic.

## Service

Service should contain:

- business rules
- stateful validation
- orchestration
- permission-sensitive decisions
- transaction decisions

## Database access

Follow existing Prisma/database pattern.

Use transactions for multi-write operations.

Avoid N+1 queries.

Use select/include intentionally.

## Common backend infra

Use `@ecom/nestjs-core` for:

- filters
- interceptors
- response helpers
- shared backend behavior

Do not create custom response/error wrapper if package already has one.

## Auth/RBAC

Auth and permission checks must be explicit.

Marketplace checks to remember:

- seller can access only own shop/resources
- admin actions require admin role/permission
- buyer cannot access seller/admin resources
- disabled seller should not mutate shop data

## Errors

Do not leak internals.

Bad:

```ts
throw new Error('Prisma failed with connection string ...')
```

Better:

```ts
throw new BadRequestException('Invalid order status')
```

Unexpected errors should go through existing global handling.

## OpenAPI

When endpoint shape changes, update Swagger/OpenAPI.

Run:

```bash
pnpm openapi:sync
pnpm contracts:check
```

## Final checks

Relevant checks:

```bash
pnpm --filter @ecom/api-seller type-check
pnpm --filter @ecom/api-admin type-check
pnpm --filter @ecom/api-storefront type-check
pnpm contracts:check
```

Run only relevant app checks when possible.

No fake green.
