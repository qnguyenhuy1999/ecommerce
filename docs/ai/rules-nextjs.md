# AI rules — Next.js apps

Rules for app caves.

## Applies to

```txt
apps/storefront
apps/seller
apps/admin
```

## Goal

Keep pages thin, fast, and server-first.

Next.js app wires data. UI packages render UI.

## Server-first rule

Prefer server components by default.

Use client components only for:

- local state
- effects
- browser APIs
- event handlers
- interactive forms
- animations
- drag/drop
- local UI behavior

Do not add `'use client'` to a full page because one button is interactive.

Move small interactive rock into small client component.

## Page responsibility

Page should mostly:

- load data
- check auth/access
- compose layout
- pass props to UI package components

Avoid giant page that mixes:

- fetching
- formatting
- permissions
- business logic
- JSX

Split rocks.

## Pure logic

Move pure logic into functions.

Good:

```ts
export function getProductHref(slug: string): string {
  return `/products/${slug}`
}
```

Good:

```ts
export function formatSoldCount(count: number): string {
  if (count >= 1000) return `${Math.floor(count / 100) / 10}k sold`
  return `${count} sold`
}
```

Do not hide pure logic inside large components.

## UI boundary

Good split:

```txt
apps/storefront
  routes, loading, auth, API calls, server actions

packages/ui-storefront
  visual components, sections, layouts, page composition
```

Same rule for seller/admin.

## Data fetching

Use existing app pattern.

Do not invent new API client/fetching layer if one exists.

Prefer server-side loading for SEO and performance when possible.

## Forms/actions

Keep server actions/API calls in app layer unless repo pattern says otherwise.

UI package owns form visuals and interaction.

App owns submit wiring and side effects.

## Performance

- Keep heavy work server-side when possible.
- Do not ship large client bundles without need.
- Do not make entire dashboard client-side by default.
- Use pagination for large lists.
- Use loading/empty/error states.

## Final checks

Relevant checks:

```bash
pnpm --filter @ecom/<app-name> type-check
pnpm --filter @ecom/<app-name> lint
pnpm --filter @ecom/<app-name> test
```

No fake green.
