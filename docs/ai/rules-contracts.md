# AI rules — Contracts and OpenAPI

Contracts are shared truth. Do not invent second truth. Ugg.

## Applies to

```txt
packages/contracts
apps/api-storefront
apps/api-seller
apps/api-admin
frontend API consumers
```

## Goal

Keep API types, enums, and response shapes consistent across all apps.

Backend changes must update OpenAPI.

Frontend should consume generated/contract types where possible.

## Contract package owns

Use `@ecom/contracts` for:

- shared enums
- API response types
- request/response DTO types
- generated OpenAPI types
- stable public API shapes

## No redefine

Bad:

```ts
enum OrderStatus {
  Pending = 'PENDING',
}
```

Good:

```ts
import { OrderStatus } from '@ecom/contracts'
```

Same meaning = same contract.

## API response shape

Use common response shape.

```ts
import type { ApiResponse } from '@ecom/contracts'
```

Do not create random response wrappers in controllers/services.

Bad:

```ts
return {
  ok: true,
  result: data,
}
```

Good:

```ts
return {
  success: true,
  data,
}
```

Follow existing `ApiResponse` shape in repo.

## Swagger/OpenAPI

Swagger/OpenAPI is source of truth for API consumers.

After endpoint changes, run:

```bash
pnpm openapi:sync
pnpm contracts:check
```

Endpoint changes include:

- route path
- method
- query params
- body shape
- response shape
- auth requirement
- status code
- enum/status values

## DTO rule

DTOs must be clear and documented.

Use existing NestJS Swagger pattern.

Add decorators when needed for OpenAPI accuracy:

- required vs optional
- enum
- array
- nested object
- pagination query
- examples when useful

## Generated files

Do not manually edit generated contract files.

Run generator command instead.

## Consumer update

If generated type changes, update consumers in:

```txt
apps/storefront
apps/seller
apps/admin
packages/ui-storefront
packages/ui-seller
packages/ui-admin
```

Do not leave frontend using stale response shape.

## Final checks

Relevant checks:

```bash
pnpm openapi:sync
pnpm contracts:check
pnpm type-check
```

No fake green.
