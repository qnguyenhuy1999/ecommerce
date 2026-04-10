# shadcn/ui Integration

**Version:** 0.1.0 | **Date:** 2026-04-10

---

## Overview

`@ecom/ui` uses **shadcn/ui** as its component foundation. shadcn is NOT a component library — it provides copy-paste source code that lives in your repository. This gives full ownership and customizability.

**Key distinction:** shadcn components are installed as **source files** in `packages/ui/src/components/ui/`, not as npm package imports.

---

## Adding a New shadcn Component

### Step 1: Add via shadcn CLI

```bash
cd packages/ui
pnpm dlx shadcn@latest add <component-name>
```

For example:

```bash
pnpm dlx shadcn@latest add select
pnpm dlx shadcn@latest add checkbox
pnpm dlx shadcn@latest add popover
```

### Step 2: Move to Atomic Location

The CLI drops files into `src/components/ui/<component>.tsx`. Immediately move it:

```bash
# Example: adding 'select'
# 1. CLI creates: src/components/ui/select.tsx
# 2. Move to atomic location:
mv src/components/ui/select.tsx src/molecules/select/select.tsx
```

Then create the barrel:

```typescript
// src/molecules/select/index.tsx
export { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from './select'
```

### Step 3: Update Barrel Exports

Add to the appropriate layer barrel (`molecules/index.ts`) and root barrel (`src/index.ts`).

### Step 4: Add Story

Create `select.stories.tsx` next to the component.

### Step 5: Rebuild

```bash
pnpm --filter @ecom/ui build
```

---

## Radix UI Peer Dependencies

shadcn components are built on **Radix UI** primitives. The peer dependencies installed in `@ecom/ui`:

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

---

## CSS Import Path

shadcn components reference `cn()` from a utils module. In this monorepo, the shadcn source files use relative imports:

```typescript
import { cn } from '../../lib/utils'
```

The `@/` alias (from `components.json`) is NOT used in the actual source — it's only for the shadcn CLI's reference.

---

## Importing from shadcn Source Files

Internal shadcn source files are at:

```
packages/ui/src/components/ui/
  dialog.tsx
  dropdown-menu.tsx
  tabs.tsx
  sheet.tsx
  avatar.tsx
  separator.tsx
  tooltip.tsx
```

These are **raw shadcn source** — they should only be referenced from within the atomic wrappers in `molecules/` or `atoms/`. Consumers always import from the barrel exports (`@ecom/ui`).

---

## Migration: Self-Rolled → shadcn

When migrating a self-rolled component to shadcn:

1. **Install the shadcn component** via CLI
2. **Create a wrapper** in the appropriate atomic folder that:
   - Re-exports the shadcn component
   - Preserves the existing public API (prop names, types)
   - Provides backward compatibility for existing consumers
3. **Update barrel exports** — existing exports remain, pointing to the shadcn-backed implementation
4. **Verify types** — ensure all consuming code still compiles
5. **Add stories** — write Storybook stories for the migrated component

### Example: Dialog Migration

The original self-rolled Dialog used `onClose` on `DialogContent`. shadcn uses `onOpenChange` on the root `Dialog`. The migration creates a wrapper that maps the API:

```typescript
// molecules/dialog/index.tsx
import * as DialogPrimitive from "@radix-ui/react-dialog";

// Re-export primitives
export const Dialog = DialogPrimitive.Root;
// ...

// Custom Content that supports both APIs
const Content = React.forwardRef<..., DialogContentProps>(
  ({ className, children, onClose, ...props }, ref) => {
    return (
      <DialogPrimitive.Content
        ref={ref}
        onOpenChange={(open) => { if (!open) onClose?.(); }}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    );
  }
);
```

---

## When NOT to Use shadcn

Some components are **business-specific** and don't belong in shadcn:

- `StatCard` — specific to admin dashboard metrics
- `ProductCard` — ecommerce-specific product display
- `CartDrawer` — shopping cart logic
- `DataTable` — admin-specific data grid

These live in `ui-admin` and `ui-storefront` only, built on top of `@ecom/ui` atoms.
