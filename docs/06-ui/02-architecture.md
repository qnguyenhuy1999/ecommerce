# UI Package Architecture

**Version:** 0.1.0 | **Date:** 2026-04-10

---

## Atomic Design Taxonomy

### Atoms (atoms/)

Single HTML/custom element primitives. Cannot be meaningfully decomposed.

**Examples:** Button, Input, Badge, Avatar, Skeleton, Separator

A component is an atom if:

- It renders a single DOM element (or a small, fixed set of elements)
- It has no meaningful sub-components that can be used independently
- It does not compose other atoms

### Molecules (molecules/)

Composed patterns built from atoms. Have semantic meaning as a unit.

**Examples:** Dialog (overlay + content + header + footer), Tabs (list + triggers + content), Sheet

A component is a molecule if:

- It is composed of two or more atoms or other molecules
- It can be described as a single functional unit
- Its sub-parts have no independent meaning outside the molecule

### Organisms (organisms/)

Complex composites that form a distinct section of the UI.

**Examples:** Pagination (buttons + page info), Sidebar (navigation groups + icons + badges), DataTable

A component is an organism if:

- It is composed of multiple molecules and/or atoms
- It forms a recognizable section of a page
- It may contain business logic

### Layouts (layouts/)

Structural wrappers that define page skeletons. Above organisms in the hierarchy.

**Examples:** AdminLayout (header + sidebar + content region), StorefrontShell (header + content + footer)

---

## Folder Structure

### `@ecom/ui`

```
packages/ui/src/
  atoms/
    button/
      index.tsx           ← component + buttonVariants
      button.stories.tsx  ← storybook story
    badge/
    card/
    input/
    avatar/
    skeleton/
    separator/
    tooltip/
    checkbox/
    label/
    textarea/
    select/
  molecules/
    dialog/
    dropdown/
    tabs/
    sheet/
  organisms/
    pagination/
  components/ui/          ← shadcn source files (dialog, sheet, tabs, etc.)
  lib/
    utils.ts              ← cn() utility
  providers/
    ThemeProvider.tsx
  theme/
    tokens.css            ← design tokens (CSS variables + @theme)
  index.ts                ← root barrel export
```

### `@ecom/ui-admin`

```
packages/ui-admin/src/
  atoms/
    breadcrumb/
    stat-card/
  molecules/
    data-table/
  organisms/
    sidebar/
    admin-header/
  layouts/
    admin-layout/
  lib/
    utils.ts              ← re-exports cn from @ecom/ui
  providers/              ← re-exports from @ecom/ui
  theme/
    theme.css             ← @import "@ecom/ui/styles" + admin overrides
  index.ts
```

### `@ecom/ui-storefront`

```
packages/ui-storefront/src/
  atoms/
    cart-item/
  molecules/
    product-card/
    filter-sidebar/
  organisms/
    product-grid/
    cart-drawer/
  layouts/
    storefront-header/
    storefront-footer/
    storefront-shell/
  lib/
    utils.ts              ← re-exports cn from @ecom/ui
  providers/
  theme/
    theme.css             ← @import "@ecom/ui/styles" + storefront overrides
  index.ts
```

---

## CSS Token Strategy

Tokens live in `@ecom/ui/src/theme/tokens.css` using Tailwind v4 `@theme` directive:

```css
@import 'tailwindcss';

@theme {
  --color-background: oklch(100% 0 0);
  --color-foreground: oklch(14.9% 0 0);
  --color-primary: oklch(9.1% 0 0);
  --color-destructive: oklch(59.7% 0.25 30.1);
  --color-border: oklch(89.8% 0 0);
  /* ... etc */
  --radius: 0.5rem;
}
```

Downstream packages (`ui-admin`, `ui-storefront`) import via `@import "@ecom/ui/styles"` in their own `theme.css` and override specific tokens as needed.
