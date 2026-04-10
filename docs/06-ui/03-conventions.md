# Component Conventions

**Version:** 0.1.0 | **Date:** 2026-04-10

---

## File Naming

| Pattern                     | Example                  | Purpose                      |
| --------------------------- | ------------------------ | ---------------------------- |
| `index.tsx`                 | `atoms/button/index.tsx` | Component implementation     |
| `ComponentName.stories.tsx` | `button.stories.tsx`     | Storybook story              |
| `ComponentName.test.tsx`    | `button.test.tsx`        | Unit test                    |
| `types.ts`                  | `data-table/types.ts`    | Shared types for a component |
| `index.ts` (layer barrel)   | `molecules/index.ts`     | Re-exports all molecules     |

### Component Location

- Co-locate story and test files next to the component
- One component per directory
- The component itself lives in `index.tsx`

---

## Props Interfaces

Always use explicit interface names:

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
}
```

Always extend HTML attributes so consumers get all native props without importing React types.

---

## Variants (CVA)

Use `class-variance-authority` for variant-based components:

```typescript
const buttonVariants = cva('base classes', {
  variants: {
    variant: { default: '...', destructive: '...' },
    size: { default: '...', sm: '...', lg: '...' },
  },
  defaultVariants: { variant: 'default', size: 'default' },
})
```

Export both the component and the `*Variants` type:

```typescript
export { Button, buttonVariants };
export type { ButtonProps };
```

---

## Forward Refs

All components that need DOM refs must use `React.forwardRef`:

```typescript
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  )
);
Button.displayName = "Button";
```

Always set `displayName` for all forwardRef components.

---

## `cn()` Utility

Always import `cn` from `@ecom/ui` (via workspace dep, never duplicate):

```typescript
import { cn } from "@ecom/ui";
// or from the local lib/utils
import { cn } from "../../lib/utils";
```

Never create your own `cn()` implementation. The utility uses `clsx` + `tailwind-merge`.

---

## "use client" Directive

Mark all interactive components with `"use client"` at the top of the file:

```typescript
'use client'

import * as React from 'react'

// ...
```

---

## Storybook Stories

Each component requires a `.stories.tsx` file with these stories:

### Required Stories by Type

**Atom (Button):**

- `Default` — basic usage
- `Variants` — showcase all variants (render prop, not args)
- `WithProps` — additional states (disabled, loading, etc.)

**Molecule (Dialog):**

- `Default` — interactive open/close story
- Additional stories for variants (with form, confirmation, etc.)

**Organism (Pagination):**

- `Default`, `FirstPage`, `LastPage`, `FewPages`

### Story Template

```typescript
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./index";

const meta = {
  title: "Atoms/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {
  args: { children: "Click me", variant: "default" },
};

export const AllVariants = {
  render: () => (
    <div className="flex gap-4">
      {(["default", "destructive", "outline"] as const).map((v) => (
        <Button key={v} variant={v}>{v}</Button>
      ))}
    </div>
  ),
};
```

See [04-storybook.md](./04-storybook.md) for full story writing guidelines.
