# Commenting Guidelines

**Version:** 1.0.0 | **Date:** 2026-04-23

> Comments are part of the codebase. Treat them like code: keep them accurate, intentional, and easy to maintain.

---

## Core Principle

Write comments that explain **why** (intent, constraints, tradeoffs, business rules), not **what** (narration of obvious code).

---

## Remove (or Rewrite) Comments That...

- Restate obvious code (names/types already tell the story).
- Narrate step-by-step work (e.g., “set X”, “loop over Y”, “return response”).
- Are decorative-only (big separators, banners, or ASCII art).
- Are stale/misleading (describe behavior that is no longer true).
- Are commented-out code (delete it; use git history).

---

## Keep (and Prefer Improving) Comments That...

- Explain **why** something is done (constraints, rationale, tradeoffs).
- Document **business rules / invariants** (state machines, idempotency, concurrency rules).
- Clarify **edge cases** (SSR vs browser, retries, error-handling semantics).
- Explain **non-obvious UX logic** (animation timing, accessibility constraints).
- Provide **public API docs** for exported symbols (JSDoc on exported props/types/functions), especially in shared packages.

---

## Examples

### Bad → Good

- Bad: `// Request interceptor: attach JWT`
  - Good: `// Browser-only: attach access token from localStorage (SSR must not read localStorage).`

- Bad: `// Response interceptor: handle 401`
  - Good: `// Treat 401 as “session expired”: clear tokens and force re-auth to avoid repeated failed requests.`

- Bad: `// Types ───────────────────────────────`
  - Good: `// Types` (or delete if the structure is already obvious)

---

## TODO / FIXME / HACK Policy

Untracked TODOs rot quickly. If a TODO is worth keeping, it must be **actionable** and **traceable**.

Allowed formats:

- `TODO(#1234): ...` (GitHub issue)
- `TODO(ABC-123): ...` (ticket)
- `TODO(@name, YYYY-MM-DD): ...` (owner + date)

Not allowed:

- `TODO: implement`
- `FIXME: later`
- `HACK: ???`

---

## ESLint Disable Directives

Disable directives must be narrowly scoped and include a reason:

- Prefer: `// eslint-disable-next-line <rule> -- <reason tied to a constraint>`
- Avoid blanket disables (`/* eslint-disable */`) unless the file truly requires it; include a reason if used.

