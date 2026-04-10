# Theming Guide

**Version:** 0.1.0 | **Date:** 2026-04-10

---

## Design Tokens

Tokens live in `packages/ui/src/theme/tokens.css` using Tailwind v4's `@theme` directive:

```css
@import 'tailwindcss';

@theme {
  --color-background: oklch(100% 0 0);
  --color-foreground: oklch(14.9% 0 0);
  --color-card: oklch(100% 0 0);
  --color-card-foreground: oklch(14.9% 0 0);
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

All color variables use the **oklch** color space for perceptually uniform color manipulation.

---

## Token Categories

| Category        | Variables                                   |
| --------------- | ------------------------------------------- |
| **Base**        | `--background`, `--foreground`              |
| **Primary**     | `--primary`, `--primary-foreground`         |
| **Secondary**   | `--secondary`, `--secondary-foreground`     |
| **Muted**       | `--muted`, `--muted-foreground`             |
| **Accent**      | `--accent`, `--accent-foreground`           |
| **Destructive** | `--destructive`, `--destructive-foreground` |
| **Card**        | `--card`, `--card-foreground`               |
| **Popover**     | `--popover`, `--popover-foreground`         |
| **Input**       | `--input`                                   |
| **Border**      | `--border`                                  |
| **Ring**        | `--ring`                                    |
| **Radius**      | `--radius`                                  |

---

## Using Tokens in Components

```typescript
// Using Tailwind utility classes (preferred)
<div className="bg-background text-foreground border-border" />

// Using CSS directly (in .css files)
.custom-element {
  background-color: var(--background);
  color: var(--foreground);
  border: 1px solid var(--border);
  border-radius: var(--radius);
}
```

---

## Extending Theme in Downstream Packages

### `@ecom/ui-admin`

```css
/* packages/ui-admin/src/theme/theme.css */
@import '@ecom/ui/styles';

/* Admin overrides — darker header, branded accents */
:root {
  --background: oklch(99% 0 0);
  --primary: oklch(25% 0.15 250); /* brand blue */
}
```

### `@ecom/ui-storefront`

```css
/* packages/ui-storefront/src/theme/theme.css */
@import '@ecom/ui/styles';

/* Storefront overrides — warmer tones */
:root {
  --background: oklch(99.5% 0 0);
  --primary: oklch(45% 0.18 25); /* brand orange */
}
```

---

## Dark Mode

TODO: Configure dark mode strategy. Options:

1. **CSS class toggle** — `.dark` class on `<html>`
2. **CSS media query** — `@media (prefers-color-scheme: dark)`
3. **Tailwind dark mode** — `class` or `media` variant

Recommended: CSS class toggle for manual control, with `@media` fallback.

---

## Animations

shadcn components use **Tailwind animation utilities**:

- `animate-in` / `animate-out` — entrance/exit animations
- `fade-in-0`, `fade-out-0` — opacity transitions
- `zoom-in-95`, `zoom-out-95` — scale transitions
- `slide-in-from-*` — directional slide-ins

These are built-in to Tailwind and available via the shadcn component styles.
