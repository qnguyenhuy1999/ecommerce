# Design System – Marketplace Platform

---

## 1. Visual Theme & Philosophy

Inspired by Airbnb's warm, photography-forward experience, adapted for a scalable modern marketplace platform.

It combines:

- **Emotional UX** — storefront surfaces that feel warm and premium
- **Functional clarity** — admin dashboard optimized for data density and speed
- **Token-driven theming** — no hardcoded values, all via CSS custom properties
- **High reusability** — 3-layer architecture across all applications

### 1.1 Core Principles

| Principle                               | Rationale                                                 |
| --------------------------------------- | --------------------------------------------------------- |
| Canvas is neutral, content is emotional | Photography and product imagery carry color               |
| Red is reserved for actions             | Brand CTA stands out; avoids visual noise                 |
| Avoid pure `#000000`                    | Use `#222222` for warm near-black that reads better       |
| Soft multi-layer shadows                | Depth without harshness                                   |
| Generous border radius                  | Friendly, approachable feel (Airbnb-inspired)             |
| Never hardcode colors in components     | All values via CSS tokens — enables theming and dark mode |

---

## 2. Architecture Overview

The system is structured into 3 layers:

```
Layer 1 — Core (packages/ui)
  └─ Reusable, domain-agnostic components

Layer 2 — Domain UI
  ├─ packages/ui-storefront   (customer-facing marketplace)
  └─ packages/ui-admin        (internal dashboard)

Layer 3 — Applications
  └─ Product apps consuming UI packages
```

**Single source of truth**: `packages/ui/src/theme/tokens.css` — all design tokens live here. The doc describes intent and documents usage; the CSS file is the authoritative implementation.

---

## 3. Token System

### 3.1 Token Philosophy

- No hardcoded values in components — always use tokens
- Primitive tokens → Semantic tokens → Component-level usage
- Dark theme: semantic tokens override inside `.dark {}` block
- Chart tokens: admin-only, heavier saturation for data visibility

### 3.2 Primitive Palette

```css
:root {
  /* Neutrals */
  --palette-white: #ffffff;
  --palette-black-soft: #222222;

  /* Extended Neutrals for Admin */
  --palette-gray-50: #f9fafb;
  --palette-gray-100: #f3f4f6;
  --palette-gray-200: #e5e7eb;
  --palette-gray-300: #d1d5db;
  --palette-gray-400: #9ca3af;
  --palette-gray-500: #6b7280;
  --palette-gray-600: #4b5563;
  --palette-gray-700: #374151;
  --palette-gray-800: #1f2937;
  --palette-gray-900: #111827;

  /* Brand Core */
  --palette-bg-primary-core: #ff385c;
  --palette-bg-tertiary-core: #e00b41;

  /* Brand Extended */
  --palette-bg-primary-luxe: #460479; /* purple accent */
  --palette-bg-primary-plus: #92174d; /* rose accent */
}
```

### 3.3 Semantic Tokens — Light Theme

```css
:root {
  /* ── Backgrounds ─────────────────────────────────────────── */
  --color-background: #ffffff; /* page background */
  --color-surface: #ffffff; /* card / sheet surface */
  --color-surface-secondary: #f2f2f2; /* muted panels */
  --color-secondary: #f2f2f2; /* secondary surfaces */
  --color-accent: #f2f2f2; /* subtle highlight */

  /* ── Foregrounds ─────────────────────────────────────────── */
  --color-foreground: #222222; /* primary text */
  --color-muted-foreground: #6a6a6a; /* secondary text */
  --color-disabled: rgba(0, 0, 0, 0.24); /* disabled text */

  /* ── Brand CTA (RED — actions only, NOT decorative accent) ── */
  --color-brand: #ff385c;
  --color-brand-admin: #ee2d50; /* better contrast for small text */
  --color-brand-foreground: #ffffff;
  --color-brand-hover: #e00b41;
  --color-brand-active: #c50b38;
  --color-brand-muted: rgba(255, 56, 92, 0.1);
  --color-brand-pressed: #e00b41;

  /* ── Status ──────────────────────────────────────────────── */
  --color-success: #00a67e;
  --color-success-foreground: #ffffff;
  --color-success-muted: rgba(0, 166, 126, 0.1);

  --color-warning: #f5a623;
  --color-warning-foreground: #222222;
  --color-warning-muted: rgba(245, 166, 35, 0.1);

  --color-info: #428bff;
  --color-info-foreground: #ffffff;
  --color-info-muted: rgba(66, 139, 255, 0.1);

  --color-destructive: #c13515;
  --color-destructive-foreground: #ffffff;

  /* ── Borders & Rings ─────────────────────────────────────── */
  --color-border: #c1c1c1;
  --color-input: #c1c1c1;
  --color-ring: #ff385c; /* focus ring matches brand */
}
```

### 3.4 Semantic Tokens — Dark Theme

```css
.dark {
  /* ── Backgrounds ─────────────────────────────────────────── */
  --color-background: #121212;
  --color-surface: #1c1c1c;
  --color-surface-secondary: #2a2a2a;
  --color-secondary: #2a2a2a;
  --color-accent: #2a2a2a;

  /* ── Foregrounds ─────────────────────────────────────────── */
  --color-foreground: #f7f7f7;
  --color-muted-foreground: #b3b3b3;
  --color-disabled: rgba(255, 255, 255, 0.3);

  /* ── Brand — stays identical across themes ───────────────── */
  --color-brand: #ff385c;
  --color-brand-admin: #ee2d50;
  --color-brand-foreground: #ffffff;
  --color-brand-hover: #e00b41;
  --color-brand-active: #c50b38;
  --color-brand-muted: rgba(255, 56, 92, 0.15);
  --color-brand-pressed: #e00b41;

  /* ── Status (dark-adapted saturation) ────────────────────── */
  --color-success: #34d399;
  --color-success-foreground: #121212;
  --color-success-muted: rgba(52, 211, 153, 0.15);

  --color-warning: #fbbf24;
  --color-warning-foreground: #121212;
  --color-warning-muted: rgba(251, 191, 36, 0.15);

  --color-info: #6ea8ff;
  --color-info-foreground: #121212;
  --color-info-muted: rgba(110, 168, 255, 0.15);

  --color-destructive: #ff6b5e;
  --color-destructive-foreground: #121212;

  /* ── Borders ─────────────────────────────────────────────── */
  --color-border: rgba(255, 255, 255, 0.08);
  --color-input: rgba(255, 255, 255, 0.08);
  --color-ring: #ff385c;
}
```

---

## 4. Typography System

### Font Stack

```
Airbnb Cereal VF, Circular, -apple-system, system-ui, Roboto, Helvetica Neue, sans-serif
```

Load Airbnb Cereal Variable from your CDN or local font asset. Falls back gracefully through the stack.

### Weight Usage

| Weight | Usage                                    |
| ------ | ---------------------------------------- |
| 400    | Body text, small labels, disabled states |
| 500    | Default UI text, paragraph content       |
| 600    | Emphasis, card headings, feature titles  |
| 700    | Section headings, hero text              |

**Avoid**: weights below 400 (thin/tracking feels dated).

### Type Scale

| Role            | rem       | px   | Weight  | Use                      |
| --------------- | --------- | ---- | ------- | ------------------------ |
| Section Heading | 1.75rem   | 28px | 700     | Page section titles      |
| Card Heading    | 1.375rem  | 22px | 600     | Product card titles      |
| Feature Title   | 1.25rem   | 20px | 600     | Feature sections         |
| UI Text         | 1rem      | 16px | 500     | Default interactive text |
| Body            | 0.875rem  | 14px | 400–500 | Paragraphs, descriptions |
| Small           | 0.8125rem | 13px | 400     | Captions, metadata       |
| Tag             | 0.75rem   | 12px | 500     | Badges, chips            |
| Badge           | 0.6875rem | 11px | 500     | Pill labels              |
| Micro           | 0.5rem    | 8px  | —       | Rarely used, icon labels |

---

## 5. Border Radius System

| Token           | Value  | Use                          |
| --------------- | ------ | ---------------------------- |
| `--radius-xs`   | 4px    | Small links, inline tags     |
| `--radius-sm`   | 8px    | Buttons, inputs, badges      |
| `--radius-md`   | 14px   | Badges, chips                |
| `--radius-lg`   | 20px   | Cards, sheets                |
| `--radius-xl`   | 32px   | Large containers, search bar |
| `--radius-full` | 9999px | Pills, avatars, toggles      |

**Note**: `--radius` is an alias for `--radius-sm` for backward compatibility. Use `--radius-sm` directly.

---

## 6. Elevation / Shadow System

| Level | Token                  | Use Case              | Shadow                                  |
| ----- | ---------------------- | --------------------- | --------------------------------------- |
| 0     | `--elevation-0`        | Flat surfaces         | `none`                                  |
| 1     | `--elevation-card`     | Product cards, sheets | 0px border + 2px/4px/8px layered shadow |
| 2     | `--elevation-hover`    | Hover state lift      | 4px/12px shadow                         |
| 3     | `--elevation-dropdown` | Dropdown, popover     | 4px/16px shadow                         |
| Modal | `--elevation-modal`    | Modal, drawer         | 16px/48px deep shadow                   |

### Shadow Philosophy

Use **multi-layer shadows** (border-pixel + 2–3 blur layers). This creates depth closer to real-world card stacking than single-layer shadows.

**Dark theme**: shadows use black with lower opacity and larger blur — deeper, more contrast, avoids the "floating in void" look.

---

## 7. Motion / Animation System

### Duration Tokens

| Token             | Value | Use                              |
| ----------------- | ----- | -------------------------------- |
| `--motion-fast`   | 150ms | Hover states, micro-interactions |
| `--motion-normal` | 250ms | State transitions, button press  |
| `--motion-slow`   | 400ms | Page transitions, panel slides   |

### Easing Curves

| Token                   | Curve                            | Use                       |
| ----------------------- | -------------------------------- | ------------------------- |
| `--motion-ease`         | `cubic-bezier(0.4,0,0.2,1)`      | Default, buttons          |
| `--motion-ease-in`      | `cubic-bezier(0.4,0,1,1)`        | Enter animations          |
| `--motion-ease-out`     | `cubic-bezier(0,0,0.2,1)`        | Exit animations           |
| `--motion-ease-bounce`  | `cubic-bezier(0.34,1.56,0.64,1)` | Celebration / success     |
| `--motion-ease-default` | `cubic-bezier(0.4,0,0.2,1)`      | Alias for `--motion-ease` |

### Scale Tokens

| Token                  | Value  | Use                   |
| ---------------------- | ------ | --------------------- |
| `--motion-scale-press` | `0.98` | Button press feedback |
| `--motion-scale-hover` | `1.02` | Card hover lift       |

### Interaction Motion Rules

| Interaction          | Duration                  | Easing              | Effect                  |
| -------------------- | ------------------------- | ------------------- | ----------------------- |
| Hover                | `--motion-fast` (150ms)   | `--motion-ease-out` | Color, shadow           |
| Button press         | `--motion-fast` (150ms)   | `--motion-ease`     | `scale(0.98)`           |
| Card hover lift      | `--motion-normal` (250ms) | `--motion-ease-out` | Shadow elevation        |
| Panel / Drawer slide | `--motion-slow` (400ms)   | `--motion-ease-out` | translateX/Y            |
| Modal                | `--motion-slow` (400ms)   | `--motion-ease-out` | scale(0.95→1) + opacity |
| Page transition      | `--motion-slow` (400ms)   | `--motion-ease-out` | fade + slide            |

**Avoid**: heavy animations that block interaction or play on loop without user trigger.

---

## 8. Focus Ring

All interactive elements must show a visible focus state:

```css
/* Applied via :focus-visible */
outline: 2px solid var(--color-ring); /* brand red */
outline-offset: 2px;
```

| Token                 | Value               |
| --------------------- | ------------------- |
| `--focus-ring-width`  | 2px                 |
| `--focus-ring-offset` | 2px                 |
| `--focus-ring-color`  | `var(--color-ring)` |

**Rule**: `:focus` (always shown) should NOT be used for accessibility — use `:focus-visible` so keyboard users get ring, mouse users don't.

---

## 9. Chart / Data Visualization Palette

Used in admin dashboard only — heavier saturation for readability against neutral backgrounds.

| Token             | Light     | Dark      | Semantic |
| ----------------- | --------- | --------- | -------- |
| `--color-chart-1` | `#ff385c` | `#ff6b87` | Brand    |
| `--color-chart-2` | `#428bff` | `#6ea8ff` | Info     |
| `--color-chart-3` | `#00a67e` | `#34d399` | Success  |
| `--color-chart-4` | `#f5a623` | `#fbbf24` | Warning  |
| `--color-chart-5` | `#460479` | `#a855f7` | Purple   |
| `--color-chart-6` | `#92174d` | `#f472b6` | Rose     |

---

## 10. Component Architecture

### Layer 1 — Core (`packages/ui`)

Domain-agnostic primitives:

```
Button · Input · Card · Badge · Avatar · Separator · Progress · ScrollArea · Sheet
```

### Layer 2 — Storefront (`packages/ui-storefront`)

Customer-facing marketplace patterns:

```
ProductCard · ListingCard · FilterPanel · CheckoutForm · CartDrawer · CartItem · PriceDisplay
```

### Layer 2 — Admin (`packages/ui-admin`)

Dashboard internal patterns:

```
DataTable · Sidebar · DashboardWidget · FormBuilder · StatCard
```

### Component API Pattern

```tsx
// Variants
<Button variant="primary" size="lg" />
<Button variant="secondary" size="md" />
<Button variant="outline" size="sm" />
<Button variant="ghost" size="sm" />

// Elevation
<Card elevation="1" />        {/* card */}
<Card elevation="2" interactive />  {/* hover lift */}

// Status
<Badge variant="success" />
<Badge variant="warning" />
<Badge variant="info" />
```

### Required Interaction States

Every interactive component must implement:

| State              | Implementation                              |
| ------------------ | ------------------------------------------- |
| **Hover**          | Color shift + shadow lift (`--elevation-2`) |
| **Active / Press** | `scale(0.98)` + `color-brand-active`        |
| **Focus Visible**  | `2px solid var(--color-ring)` outline       |
| **Disabled**       | `opacity: 0.5` + `cursor: not-allowed`      |

---

## 11. Layout System

### Spacing Scale (base: 8px)

```
4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64
```

Use multiples of 4px or 8px. Avoid arbitrary spacing values.

### Grid — Column Breakpoints

| Viewport   | Columns |
| ---------- | ------- |
| < 550px    | 1       |
| 550–900px  | 2       |
| 900–1200px | 3       |
| > 1200px   | 4–5     |

Use CSS Grid with `auto-fill` or Tailwind's responsive grid utilities.

### Container Max Width

| Surface       | Max Width |
| ------------- | --------- |
| Storefront    | 1280px    |
| Admin sidebar | 260px     |
| Admin content | fluid     |

---

## 12. Storefront UX Rules

| Rule                              | Rationale                                                            |
| --------------------------------- | -------------------------------------------------------------------- |
| **Image-first layout**            | Photography carries emotional weight — hero images fill the viewport |
| **Full-card clickable on mobile** | Larger tap targets, easier navigation                                |
| **Soft hover lift**               | `--elevation-2` shadow + `scale(1.02)` — subtle, not aggressive      |
| **Prioritize conversion**         | Primary CTA above the fold, secondary below                          |
| **Free shipping threshold**       | Show progress bar when cart < $100 to drive upsell                   |
| **Soft empty state**              | Friendly illustration + CTA, not a dead end                          |

---

## 13. Admin UX Rules

| Rule                         | Rationale                                                        |
| ---------------------------- | ---------------------------------------------------------------- |
| **Data density prioritized** | More information per viewport — admin users scan, not browse     |
| **Clear hierarchy**          | Headings, subheadings, and metadata at correct scale             |
| **Minimal decoration**       | Reduce visual noise — focus on the data                          |
| **Fast scanning**            | Monospace for numbers, left-aligned text, no decorative elements |
| **Dark sidebar**             | Sidebar `#121212` creates clear separation from content area     |

---

## 14. Accessibility

| Requirement         | Standard                                               |
| ------------------- | ------------------------------------------------------ |
| Color contrast      | WCAG AA (4.5:1 for text, 3:1 for UI)                   |
| Keyboard navigation | All interactive elements reachable via Tab             |
| Focus visible       | Ring must appear on `:focus-visible`                   |
| Tap target          | Minimum 44×44px                                        |
| Motion preference   | Respect `prefers-reduced-motion` — disable transitions |

---

## 15. Do & Don't

### ✅ Do

- Use semantic tokens (`var(--color-brand)`) — never hardcode `#ff385c` inline
- Use `--elevation-card` for card surfaces
- Keep UI soft and warm — generous radius, muted backgrounds
- Maintain consistency — one radius token per component type
- Reuse core components from `packages/ui` — avoid custom styles
- Support both light and dark themes — test both surfaces
- Use `--motion-*` tokens — not hardcoded `ms` values in CSS

### ❌ Don't

- Hardcode colors (`#222222`, `#ff385c`) directly in components
- Mix admin/storefront logic — separate packages exist for a reason
- Use pure `#000000` — use `--palette-black-soft` (`#222222`) instead
- Add random decorative colors — brand red is reserved for actions
- Use sharp corners on cards — `--radius-lg` (20px) minimum
- Hardcode pixel values — use `--motion-fast`, `--radius-sm` tokens
- Skip the focus ring — accessibility is not optional

---

## 16. Final Principle

```
Canvas is neutral.
Content is emotional.
Red is action.
System enables scale.
Consistency builds trust.
```

---

## Appendix: Token Cheatsheet

```
COLORS
  Brand:    --color-brand · --color-brand-hover · --color-brand-muted
  Status:   --color-success · --color-warning · --color-info · --color-destructive
  Surface:  --color-background · --color-surface · --color-surface-secondary
  Text:     --color-foreground · --color-muted-foreground · --color-disabled

TYPOGRAPHY
  Sizes:    --font-size-*
  Weights:  400 body · 500 default · 600 emphasis · 700 headings

RADIUS
  --radius-xs (4px) · --radius-sm (8px) · --radius-md (14px)
  --radius-lg (20px) · --radius-xl (32px) · --radius-full (9999px)

ELEVATION
  --elevation-0 · --elevation-card · --elevation-hover · --elevation-dropdown · --elevation-modal

MOTION
  Durations: --motion-fast (150ms) · --motion-normal (250ms) · --motion-slow (400ms)
  Easings:   --motion-ease · --motion-ease-in · --motion-ease-out · --motion-ease-bounce
  Scale:     --motion-scale-press (0.98) · --motion-scale-hover (1.02)

FOCUS
  --focus-ring-width (2px) · --focus-ring-offset (2px) · --focus-ring-color (--color-ring)
```

---

_Doc version: aligned with `packages/ui/src/theme/tokens.css` (authoritative source). Update this doc when tokens.css changes._
