# AI rules — UI packages

Applies to: `packages/core-ui`, `ui-storefront`, `ui-seller`, `ui-admin`

## Package purpose

```txt
core-ui        # base primitives: Button, Input, Badge, Dialog, Table, etc.
ui-storefront  # buyer UI: ProductCard, CartSummary, CheckoutSection, etc.
ui-seller      # seller UI: ProductForm, OrderTable, SellerStatsCard, etc.
ui-admin       # admin UI: ModerationQueue, AuditLogTable, UserRiskBadge, etc.
```

````

Don't put feature UI in `core-ui`. Import direction: `apps/* → ui-* → core-ui`. No app imports inside UI packages. No circular imports.

## Component structure

```txt
ProductCard/
  ProductCard.tsx / .server.tsx / .client.tsx
  ProductCard.controller.ts   # derived view models, filtering, sorting, column builders
  ProductCard.types.ts / .fixtures.ts / .stories.tsx / .test.tsx
  index.ts
```

Only create files that are useful.

## Server/client split

Default to server-compatible. Add `'use client'` only for: local state, event handlers, effects, browser APIs, animations, rich interactions. Don't make a full page client for one interactive field.

## Controller

Move non-visual logic into `.controller.ts`: derived view models, filtering, sorting, form state helpers, table column builders. Component renders. Controller prepares.

## Context

Use only for: compound components, shared UI state across 3+ levels, page-level UI state. Avoid for simple props, server data, global app state. Keep provider values stable.

## Props & view models

Components take clear typed props. Prefer view models — don't expose raw backend shapes when UI needs only a subset. No `data: any`.

## Styling

Use existing design tokens and `core-ui` components first. Use Tailwind tokens (`text-primary`), never hardcoded values (`text-[#ff5722]`). Don't introduce new UI libraries without approval.

## States

Every component must handle: loading, empty, error, permission denied, long content, mobile. Empty states must suggest a next action, not just "No data".

## Tables & forms

**Tables:** search, filters, status tabs, sort, pagination, bulk actions, row actions, empty/loading/error states.

**Forms:** group fields by meaning, show required + inline validation, preserve drafts, separate danger zone, obvious CTA with loading/disabled state.

## Accessibility

Semantic HTML, visible focus, labels on inputs, keyboard navigation. Use `<button>` for actions, `<a>` for navigation. `aria-*` only when needed.

## Performance

`useMemo`/`useCallback` only for expensive computations, stable references for memoized children, or large list transformations. Paginate/virtualize large lists.

## Exports

Use package barrel exports. Never deep-import internal paths.

## Testing

Test: form validation, disabled states, permission rendering, table filtering/sorting, controller utilities, bug regressions.

## Final response

```txt
Changed: [component/file] · [pattern reused] · [server/client split if changed]
Checks run: [commands]
```

No fake green.

```

Cut ~65%. Removed cave flavor, collapsed redundant examples, merged related rules. All patterns preserved.
```
````
