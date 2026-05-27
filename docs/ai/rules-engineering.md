# AI rules — Engineering

## Work style

Search first. Code second. No new architecture unless asked.

1. Search nearby files and same feature/bug across apps.
2. Follow current repo pattern. Reuse existing code.
3. Make smallest correct change. Run focused checks.

Existing pattern beats clever pattern.

## TypeScript

Strict only. No exceptions.

- No `any` — use `unknown` + validate if input is truly unknown.
- No fake casts (`as SomeType`) — parse/validate instead.
- No unsafe optional access. No duplicated types when contract exists.
- Explicit return types on exported functions. Narrow types over broad.

## Shared code (`packages/shared`)

Only move logic there if it is pure, reusable, and agnostic to framework/app/database/request.

```ts
// Good
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

// Bad
export async function createUserFromRequest(req: Request) {}
```

````

## Constants

- Contract enums/status/API types → `@ecom/contracts`
- Generic reusable constants → `@ecom/shared/constants`
- Feature-only values → local

Never hardcode business values inline. Use `OrderStatus.PENDING`, not `'PENDING'`.

## Dependencies

No circular deps. No app-to-app imports. Move shared logic to `packages/*`.

```txt
apps/* -> packages/ui-* -> packages/core-ui
       -> packages/auth/config/redis/email/database/nestjs-core
       -> packages/contracts/shared
```

`@ecom/shared` and `@ecom/contracts` import no internal packages.

## Duplication

Search before adding any helper/component/type. Reuse if found. Extract only when duplicated in 2+ places and truly reusable. Don't abstract too early.

## Error handling

Never swallow silently. Log and rethrow. Don't leak internals to users. Follow existing app error pattern.

## Performance

Avoid: repeated expensive work in render, unnecessary client components, N+1 queries, huge payloads. Prefer pagination. Use memoization only when it measurably helps.

## Refactor rule

Only refactor to: remove duplication, improve type safety, fix bug root cause, align with repo pattern, or prepare for a requested feature. Behavior must stay the same unless the task says otherwise. Don't reformat unrelated files.

## Checks

```bash
# Focused first
pnpm --filter @ecom/<name> type-check
pnpm --filter @ecom/<name> test
pnpm --filter @ecom/<name> lint

# Wider when relevant
pnpm type-check / test / lint / lint:circular / lint:deps
```

## Final response

State: what changed · why · checks run · checks not run (if any). If checks fail, say so with likely cause. No fake green.

```

Cut ~55% — removed redundant good/bad pairs that restate the rule, collapsed bullet groups, trimmed cave flavor. All rules intact.
```
````
