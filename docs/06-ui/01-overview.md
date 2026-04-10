# UI Package Overview

**Version:** 0.1.0 | **Date:** 2026-04-10

---

## Package Roles

### `@ecom/ui` — Base Primitives

The foundational component library. All UI primitives live here.

**Atoms** (single HTML/custom element primitives):

- `Button`, `Badge`, `Card`, `Input`, `Label`, `Textarea`, `Select`, `Checkbox`
- `Avatar`, `Skeleton`, `Separator`, `Tooltip`

**Molecules** (composed of atoms):

- `Dialog`, `Dropdown`, `Tabs`, `Sheet`

**Organisms** (complex composites):

- `Pagination`

**Providers**: `ThemeProvider`

**Utilities**: `cn()` — the class name merger utility

### `@ecom/ui-admin` — Admin-Specific Components

Built on top of `@ecom/ui`. Contains business components specific to the admin dashboard.

- `StatCard`, `Breadcrumb` — atoms
- `DataTable` — molecules
- `Sidebar`, `AdminHeader` — organisms
- `AdminLayout` — layouts

### `@ecom/ui-storefront` — Storefront-Specific Components

Built on top of `@ecom/ui`. Contains business components specific to the storefront.

- `CartItem` — atoms
- `ProductCard`, `FilterSidebar` — molecules
- `ProductGrid`, `CartDrawer` — organisms
- `StorefrontHeader`, `StorefrontFooter`, `StorefrontShell` — layouts

---

## Design Principles

1. **Single source of truth** — shadcn primitives live only in `@ecom/ui`. Neither `ui-admin` nor `ui-storefront` duplicate base components.
2. **Downstream extension** — `ui-admin` and `ui-storefront` add business-specific components but do NOT modify base atoms/molecules.
3. **Apps consume domain packages** — `apps/admin` imports from `@ecom/ui-admin`, never directly from `@ecom/ui` for domain components.
4. **Atomic classification** — Every component is classified as atom, molecule, organism, or layout based on its composition complexity.
