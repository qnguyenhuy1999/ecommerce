# UI Package Documentation

**Version:** 0.1.0 | **Date:** 2026-04-12

This section documents the shared UI component library for the ecommerce monorepo.

---

## Packages

| Package               | Purpose                                                                     |
| --------------------- | --------------------------------------------------------------------------- |
| `@ecom/ui`            | Atomic base primitives — atoms, molecules, organisms shared across all apps |
| `@ecom/ui-admin`      | Admin-specific components (sidebar, data-table, stat-card, etc.)            |
| `@ecom/ui-storefront` | Storefront-specific components (product card, cart drawer, etc.)            |

### Dependency Hierarchy

```
@ecom/ui (base primitives)
    ├── @ecom/ui-admin (admin-specific components)
    └── @ecom/ui-storefront (storefront-specific components)

apps/admin       → @ecom/ui + @ecom/ui-admin
apps/storefront  → @ecom/ui + @ecom/ui-storefront
```

---

## Atomic Design Taxonomy

### Atoms (`atoms/`)

Single HTML/custom element primitives. Cannot be meaningfully decomposed.

**Examples:** Button, Input, Badge, Avatar, Skeleton, Separator, Checkbox, Label, Textarea, Select

A component is an atom if it renders a single DOM element and has no sub-components.

### Molecules (`molecules/`)

Composed patterns built from atoms. Have semantic meaning as a unit.

**Examples:** Dialog, Tabs, Sheet, Dropdown

A component is a molecule if it is composed of two or more atoms or molecules and can be described as a single functional unit.

### Organisms (`organisms/`)

Complex composites that form a distinct section of the UI.

**Examples:** Pagination, Sidebar, DataTable, ProductGrid

### Layouts (`layouts/`)

Structural wrappers that define page skeletons.

**Examples:** AdminLayout, StorefrontShell

---

## Folder Structure

### `@ecom/ui`

```
packages/ui/src/
  atoms/
    button/       index.tsx + *.stories.tsx + *.test.tsx
    badge/
    card/
    input/
    avatar/
    skeleton/
    separator/
    tooltip/
  molecules/
    dialog/
    tabs/
    sheet/
    dropdown/
  organisms/
    pagination/
  components/ui/   ← shadcn source files (raw, not for direct import)
  lib/
    utils.ts       ← cn() utility
  providers/
    ThemeProvider.tsx
  theme/
    tokens.css    ← design tokens (CSS variables via @theme)
  index.ts        ← root barrel export
```

### `@ecom/ui-admin`

```
packages/ui-admin/src/
  atoms/        breadcrumb/, stat-card/
  molecules/    data-table/
  organisms/    sidebar/, admin-header/
  layouts/      admin-layout/
  theme/
    theme.css   ← @import "@ecom/ui/styles" + admin overrides
  index.ts
```

### `@ecom/ui-storefront`

```
packages/ui-storefront/src/
  atoms/        cart-item/
  molecules/    product-card/, filter-sidebar/
  organisms/    product-grid/, cart-drawer/
  layouts/      storefront-header/, storefront-footer/, storefront-shell/
  theme/
    theme.css   ← @import "@ecom/ui/styles" + storefront overrides
  index.ts
```

---

## Design Principles

1. **Single source of truth** — shadcn primitives live only in `@ecom/ui`. Neither `ui-admin` nor `ui-storefront` duplicate base components.
2. **Downstream extension** — `ui-admin` and `ui-storefront` add business-specific components but do NOT modify base atoms/molecules.
3. **Apps consume domain packages** — `apps/admin` imports from `@ecom/ui-admin`, never directly from `@ecom/ui` for domain components.

---

## Component Conventions

### File Naming

| Pattern                     | Example                  | Purpose                      |
| --------------------------- | ------------------------ | ---------------------------- |
| `index.tsx`                 | `atoms/button/index.tsx` | Component implementation     |
| `ComponentName.stories.tsx` | `button.stories.tsx`     | Storybook story              |
| `ComponentName.test.tsx`    | `button.test.tsx`        | Unit test                    |
| `types.ts`                  | `data-table/types.ts`    | Shared types for a component |
| `index.ts` (layer barrel)   | `molecules/index.ts`     | Re-exports all molecules     |

### Props Interfaces

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
}
```

Always extend HTML attributes so consumers get all native props without importing React types.

### Variants (CVA)

```typescript
const buttonVariants = cva('base classes', {
  variants: {
    variant: { default: '...', destructive: '...' },
    size: { default: '...', sm: '...', lg: '...' },
  },
  defaultVariants: { variant: 'default', size: 'default' },
})

export { Button, buttonVariants }
export type { ButtonProps }
```

### Forward Refs

```typescript
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  )
);
Button.displayName = "Button";
```

Always set `displayName` for all forwardRef components.

### `cn()` Utility

Import `cn` from `@ecom/ui` or `../../lib/utils`. Never duplicate it.

```typescript
import { cn } from '@ecom/ui'
// or
import { cn } from '../../lib/utils'
```

### "use client" Directive

Mark all interactive components with `"use client"` at the top of every file that uses it.

---

## Storybook

### Running Storybook

```bash
pnpm storybook              # @ecom/ui (port 6006)
pnpm storybook:admin        # @ecom/ui-admin (port 6007)
pnpm storybook:storefront   # @ecom/ui-storefront (port 6008)
```

### Required Meta

```typescript
const meta = {
  title: 'Category/ComponentName', // e.g. 'Atoms/Button', 'Molecules/Dialog'
  component: Component,
  tags: ['autodocs'],
  parameters: { layout: 'centered' | 'padded' | 'fullscreen' },
  argTypes: {
    /* expose key props as controls */
  },
} satisfies Meta<typeof Component>

export default meta
type Story = StoryObj<typeof meta>
```

### Story Types

**1. Default (args-based):** Simple prop passing

```typescript
export const Default = {
  args: { children: 'Click me' },
}
```

**2. Showcase (render-based):** Variant grids, all-states displays

```typescript
export const AllVariants = {
  render: () => (
    <div className="flex gap-4 flex-wrap">
      {(["default", "destructive", "outline"] as const).map((v) => (
        <Button key={v} variant={v}>{v}</Button>
      ))}
    </div>
  ),
};
```

**3. Interactive (state-based):** Components with internal state

```typescript
export const Default = () => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button>Open Dialog</Button></DialogTrigger>
      <DialogContent>
        <DialogTitle>Title</DialogTitle>
        <DialogDescription>Description</DialogDescription>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
```

**4. Variants (story objects):** Size/variant combinations

```typescript
export const Small = { args: { children: 'Small', size: 'sm' } }
export const Large = { args: { children: 'Large', size: 'lg' } }
```

### Best Practices

1. Use `satisfies Meta` for type safety on the meta object
2. Export `type Story = StoryObj<typeof meta>` for TypeScript autocomplete
3. Use `asChild` for trigger components
4. Use realistic content — no "Lorem ipsum"
5. Test at different viewport sizes
6. Export all key props as `argTypes` controls

---

## shadcn/ui Integration

`@ecom/ui` uses **shadcn/ui** as its component foundation — copy-paste source code that lives in your repository, giving full ownership.

### Adding a New Component

```bash
cd packages/ui
pnpm dlx shadcn@latest add <component-name>
```

Immediately move the CLI output from `src/components/ui/<component>.tsx` to the appropriate atomic location:

```bash
mv src/components/ui/select.tsx src/molecules/select/select.tsx
```

Then create the barrel in `src/molecules/select/index.tsx` and update layer + root barrel exports.

### Radix UI Peer Dependencies

| shadcn Component | Radix Dependency                  |
| ---------------- | --------------------------------- |
| `dialog`         | `@radix-ui/react-dialog`          |
| `dropdown-menu`  | `@radix-ui/react-dropdown-menu`   |
| `tabs`           | `@radix-ui/react-tabs`            |
| `sheet`          | `@radix-ui/react-dialog` (shared) |
| `avatar`         | `@radix-ui/react-avatar`          |
| `separator`      | `@radix-ui/react-separator`       |
| `tooltip`        | `@radix-ui/react-tooltip`         |
| `slot`           | `@radix-ui/react-slot`            |

### When NOT to Use shadcn

Business-specific components live in `ui-admin` and `ui-storefront` only:

- `StatCard`, `DataTable` — admin-specific
- `ProductCard`, `CartDrawer` — ecommerce-specific

---

## Theming

### Design Tokens

Tokens live in `packages/ui/src/theme/tokens.css` using Tailwind v4's `@theme` directive:

```css
@import 'tailwindcss';

@theme {
  --color-background: oklch(100% 0 0);
  --color-foreground: oklch(14.9% 0 0);
  --color-primary: oklch(9.1% 0 0);
  --color-primary-foreground: oklch(98.8% 0 0);
  --color-secondary: oklch(96.1% 0 0);
  --color-secondary-foreground: oklch(9% 0 0);
  --color-muted: oklch(96.1% 0 0);
  --color-muted-foreground: oklch(45.1% 0 0);
  --color-accent: oklch(96.1% 0 0);
  --color-accent-foreground: oklch(9% 0 0);
  --color-destructive: oklch(59.7% 0.25 30.1);
  --color-destructive-foreground: oklch(98% 0 0);
  --color-border: oklch(89.8% 0 0);
  --color-input: oklch(89.8% 0 0);
  --color-ring: oklch(14.9% 0 0);
  --radius: 0.5rem;
}
```

All color variables use **oklch** for perceptually uniform color manipulation.

### Token Categories

| Category         | Variables                                   |
| ---------------- | ------------------------------------------- |
| **Base**         | `--background`, `--foreground`              |
| **Primary**      | `--primary`, `--primary-foreground`         |
| **Secondary**    | `--secondary`, `--secondary-foreground`     |
| **Muted**        | `--muted`, `--muted-foreground`             |
| **Accent**       | `--accent`, `--accent-foreground`           |
| **Destructive**  | `--destructive`, `--destructive-foreground` |
| **Card**         | `--card`, `--card-foreground`               |
| **Input/Border** | `--input`, `--border`, `--ring`             |
| **Radius**       | `--radius`                                  |

### Using Tokens

```typescript
// Tailwind utility classes (preferred)
<div className="bg-background text-foreground border-border" />

// CSS directly
.custom-element {
  background-color: var(--background);
  color: var(--foreground);
  border-radius: var(--radius);
}
```

### Extending Theme in Downstream Packages

```css
/* packages/ui-admin/src/theme/theme.css */
@import '@ecom/ui/styles';

:root {
  --primary: oklch(25% 0.15 250); /* admin brand blue */
}
```

### Dark Mode

TODO: Configure. Recommended: CSS class toggle (`.dark` on `<html>`) with `@media` fallback.

---

## Visual Design System — Airbnb Inspired

Photography-forward, warm, minimal. Red is action. Never pure black.

### Color Philosophy

| Role              | Token                            | Light   | Dark    |
| ----------------- | -------------------------------- | ------- | ------- |
| Page background   | `--palette-bg-page`              | #ffffff | #121212 |
| Card background   | `--palette-bg-surface`           | #ffffff | #1c1c1c |
| Secondary surface | `--palette-bg-surface-secondary` | #f2f2f2 | #2a2a2a |
| Primary accent    | `--palette-bg-primary-core`      | #ff385c | #ff385c |
| Text primary      | `--palette-text-primary`         | #222222 | #f7f7f7 |
| Text secondary    | `--palette-text-secondary`       | #6a6a6a | #b3b3b3 |

Brand red stays identical across themes.

### Typography

| Role            | Size | Weight  | Line Height |
| --------------- | ---- | ------- | ----------- |
| Section Heading | 28px | 700     | 1.43        |
| Card Heading    | 22px | 600     | 1.18        |
| Feature Title   | 20px | 600     | 1.20        |
| UI Text         | 16px | 500-600 | 1.25        |
| Body            | 14px | 400-500 | 1.43        |
| Small           | 13px | 400     | 1.23        |
| Tag             | 12px | 400-700 | 1.33        |
| Badge           | 11px | 600     | 1.18        |

Font: Airbnb Cereal VF, Circular, -apple-system, system-ui, Roboto, Helvetica Neue

### Border Radius Scale

| Usage            | Radius |
| ---------------- | ------ |
| Small links      | 4px    |
| Buttons          | 8px    |
| Badges           | 14px   |
| Cards            | 20px   |
| Large containers | 32px   |
| Circular         | 50%    |

### Elevation (Shadow)

| Level   | Use             |
| ------- | --------------- |
| Level 0 | Flat background |
| Level 1 | Cards, search   |
| Level 2 | Hover lift      |
| Level 3 | Active / focus  |

Three-layer shadows for natural lift — never heavy or dramatic.

### Spacing Scale

Base unit: 8px. Allowed: 2, 3, 4, 6, 8, 10, 11, 12, 15, 16, 22, 24, 32

### Grid Breakpoints

| Breakpoint  | Columns |
| ----------- | ------- |
| <375px      | 1       |
| 375–550px   | 1       |
| 550–744px   | 2       |
| 950–1128px  | 3       |
| 1128–1440px | 4       |
| 1440–1920px | 5       |

### Do's and Don'ts

**Do:** Use `#222222` / `#f7f7f7` text · Use red sparingly · Soft three-layer shadows · Warm typography · Generous radius

**Don't:** Pure black (#000000) · Red as surface · New brand colors · Sharp corners · Heavy shadows · Hardcoded colors

---

_Maintained by the engineering team._
