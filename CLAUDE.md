# CLAUDE.md

## Repo

PNPM + Turborepo monorepo. Node `>=24`, pnpm `>=11`.

Apps:

- `storefront`, `seller`, `admin` (Next.js)
- `api-storefront`, `api-seller`, `api-admin` (NestJS)
- `worker`

Packages:

- `shared`, `contracts`, `nestjs-core`, `database`, `auth`, `redis`, `email`, `config`
- `core-ui`, `ui-storefront`, `ui-seller`, `ui-admin`, `eslint-config`

Architecture rules:

- `@ecom/shared` and `@ecom/contracts` are leaf packages. They import no internal packages.
- No circular dependencies. No app-to-app imports.
- Enums and shared types come from `@ecom/contracts`; never redefine them locally.
- API responses use `ApiResponse` from `@ecom/contracts`.
- Shared NestJS filters/interceptors come from `@ecom/nestjs-core`.
- Swagger/OpenAPI is the source of truth. After API changes, run `pnpm openapi:sync && pnpm contracts:check`.

## Commands

```bash
pnpm dev
pnpm build
pnpm lint
pnpm type-check
pnpm test
pnpm test:e2e
pnpm format
pnpm db:generate
pnpm db:migrate
pnpm openapi:sync
pnpm contracts:check
pnpm lint:circular
pnpm lint:deps
pnpm --filter @ecom/<name> <script>
```

## Workflow

- Keep thread scope narrow: current goal, relevant files, failing command output, and active constraints only.
- For non-trivial tasks, restate the working context in 10 bullets or fewer before editing.
- Name the expected deliverable early: changed file, passing command, or PR-sized outcome.
- If 10 minutes pass without an edit, or the same approach fails twice, stop and realign before retrying again.
- Point to exact files and line ranges when possible. Avoid re-reading the same file unless it changed or you need a new section.
- Before editing any file, read it first.
- Before changing a function, exported symbol, or contract, grep for callers/usages first.
- Find an existing pattern before inventing a new one.
- Prefer the smallest correct change and reuse existing code before extracting abstractions.
- Extract into `packages/shared` only when logic is pure and truly shared.

## Pattern Docs

Read the matching guide before changing related code:

```text
docs/ai/rules-engineering.md
docs/ai/rules-nextjs.md
docs/ai/rules-ui-packages.md
docs/ai/rules-nestjs.md
docs/ai/rules-contracts.md
docs/ai/rules-database.md
docs/ai/rules-testing.md
docs/ai/rules-graphify.md
docs/engineering-rules.md
docs/project-context.md
```

## Graphify

Before architecture questions, read `graphify-out/GRAPH_REPORT.md`.
Prefer `graphify-out/wiki/index.md` if it exists.

After editing code:

```bash
graphify update .
```

### Graphify Python Environment

Graphify installed via `uv` runs in its own Python environment.

Do NOT use:

```bash
python3 -c "import graphify"
```

Use:

```bash
/Users/mac/.local/share/uv/tools/graphifyy/bin/python
```

Or Graphify CLI commands:

```bash
graphify update .
graphify watch .
graphify extract .
```

### Watch Mode

If watch mode reports:

```text
error: watchdog not installed
```

Install `watchdog` into the Graphify uv environment, not the system Python:

```bash
uv pip install --python /Users/mac/.local/share/uv/tools/graphifyy/bin/python watchdog
```

### Rebuild Operations

Never run `_rebuild_code(Path('.'))` from the home directory.
Always execute Graphify commands inside the target repository root.

## Final Answer

State what changed.
State what checks ran.
If something was not run, say so explicitly.
