# Storybook Guidelines

**Version:** 0.1.0 | **Date:** 2026-04-10

---

## Running Storybook

```bash
# Root level
pnpm storybook              # @ecom/ui (port 6006)
pnpm storybook:admin        # @ecom/ui-admin (port 6007)
pnpm storybook:storefront   # @ecom/ui-storefront (port 6008)

# Per-package
cd packages/ui && pnpm storybook
```

---

## Story File Location

Stories live **co-located** with their component:

```
atoms/button/
  index.tsx              ← component
  button.stories.tsx      ← story
  button.test.tsx          ← unit test
```

---

## Story Naming Convention

- File: `ComponentName.stories.tsx`
- Title in Storybook: `"Atoms/Button"`, `"Molecules/Dialog"`, `"Organisms/Sidebar"`, `"Layouts/AdminLayout"`

---

## Required Exports

Every story file must export:

```typescript
import type { Meta, StoryObj } from '@storybook/react'
import { Component } from './index'

const meta = {
  title: 'Category/ComponentName',
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

---

## Story Types

### 1. Default / Basic (args-based)

```typescript
export const Default = {
  args: { children: 'Click me' },
}
```

Use `args` for simple prop passing. Avoid complex objects in args.

### 2. Showcase (render-based)

For variant grids, all-states displays:

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

Use `render` for stories that don't map 1:1 to props.

### 3. Interactive (state-based)

For components with internal state (Dialog open/close, Tabs switching):

```typescript
export const Default = () => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
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

### 4. Variants (story objects)

For size/variant combinations:

```typescript
export const Small = {
  args: { children: 'Small', size: 'sm' },
}

export const Large = {
  args: { children: 'Large', size: 'lg' },
}
```

---

## Controls

Expose key props as controls. Use `argTypes` for non-boolean controls:

```typescript
argTypes: {
  variant: {
    control: "select",
    options: ["default", "destructive", "outline", "secondary", "ghost", "link"],
  },
  disabled: { control: "boolean" },
}
```

---

## Best Practices

1. **Use `satisfies Meta`** — ensures type safety on the meta object
2. **Export `type Story = StoryObj<typeof meta>`** — enables TypeScript autocomplete on story args
3. **Use `"use client"` in stories** — Storybook runs in client context
4. **Use `asChild`** — for trigger components wrapping other elements
5. **Realistic content** — use real-looking text, not "Lorem ipsum"
6. **Responsive layouts** — test stories at different viewport sizes
