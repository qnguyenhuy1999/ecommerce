# AI rules — Testing

Bug fix without test is weak rock.

## Goal

Test behavior that can break business.

Do not test implementation noise.

## Add or update tests for

- bug fixes
- pure shared functions
- business rules
- permission/RBAC logic
- API contract behavior
- order/payment/refund flows
- coupon/discount logic
- stock/inventory logic
- data transformations
- edge cases

## Best test targets

Easy strong tests:

```txt
packages/shared
packages/contracts
controller utilities
service business rules
UI controller/utils
permission helpers
```

## UI tests

Test behavior-heavy UI:

- form validation
- disabled/loading states
- permission rendering
- empty states
- table filtering/sorting
- critical CTA visibility
- bug regression

Do not snapshot huge UI unless repo already uses that pattern.

## API tests

Test:

- success response shape
- validation error
- unauthorized/forbidden
- pagination metadata
- filtering/sorting
- state transitions
- edge cases

## Edge cases

For marketplace, think:

- seller owns/not owns resource
- empty cart
- multi-seller cart
- product out of stock
- coupon expired
- invalid status transition
- duplicate request
- partial failure
- deleted/disabled seller
- hidden/unpublished product

## Run focused first

```bash
pnpm --filter @ecom/<name> test
pnpm --filter @ecom/<name> type-check
pnpm --filter @ecom/<name> lint
```

Then wider when relevant:

```bash
pnpm test
pnpm type-check
pnpm lint
```

## Final response

Always report checks.

Good:

```txt
Checks run:
- pnpm --filter @ecom/api-seller test
- pnpm --filter @ecom/api-seller type-check
```

If not run:

```txt
Checks not run.
Reason: not available in this environment.
```

If failed, say failed and likely cause.

No fake green.
