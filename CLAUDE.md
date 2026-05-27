Here's a tightened `CLAUDE.md` — cuts ~60% of the text while keeping all actionable info:

````md
# CLAUDE.md — ecommerce-v2

## Repo

PNPM + Turborepo monorepo. Node >=24, pnpm >=11.

**Apps:** `storefront`, `seller`, `admin` (Next.js) · `api-storefront`, `api-seller`, `api-admin` (NestJS) · `worker`

**Packages:** `shared`, `contracts`, `nestjs-core`, `database`, `auth`, `redis`, `email`, `config`, `core-ui`, `ui-storefront`, `ui-seller`, `ui-admin`, `eslint-config`

**Leaf rule:** `@ecom/shared` and `@ecom/contracts` import no internal packages.

## Commands

```bash
pnpm dev / build / lint / type-check / test / test:e2e / format
pnpm db:generate / db:migrate
pnpm openapi:sync / contracts:check
pnpm lint:circular / lint:deps
pnpm --filter @ecom/<name> <script>
```
````

## Must follow

- TypeScript strict. No `any`. No fake casts.
- No circular deps. No app-to-app imports.
- Enums/types from `@ecom/contracts`. Never redefine them.
- API responses use `ApiResponse` from `@ecom/contracts`.
- Common filters/interceptors from `@ecom/nestjs-core`.
- Swagger/OpenAPI is source of truth. After API changes: `pnpm openapi:sync && pnpm contracts:check`.

## Before coding

1. Find similar feature/bug. Follow current pattern.
2. Reuse existing code. Smallest correct change.
3. Extract to `packages/shared` only if pure + truly shared.

## Pattern docs

Read proper document before changing related code:

```
docs/ai/rules-engineering.md   docs/ai/rules-nextjs.md
docs/ai/rules-ui-packages.md   docs/ai/rules-nestjs.md
docs/ai/rules-contracts.md     docs/ai/rules-database.md
docs/ai/rules-testing.md       docs/ai/rules-graphify.md
docs/engineering-rules.md      docs/project-context.md
```

## Graphify

Before architecture questions, read `graphify-out/GRAPH_REPORT.md` (prefer `graphify-out/wiki/index.md` if it exists).

After editing code:

```bash
python3 -c "from graphify.watch import _rebuild_code; from pathlib import Path; _rebuild_code(Path('.'))"
```

## Final answer rule

State what changed. State checks run. If not run, say so. No fake green.

```

```
