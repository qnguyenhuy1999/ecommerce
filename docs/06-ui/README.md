# UI Package Documentation

**Version:** 0.1.0 | **Date:** 2026-04-10

---

## Overview

This section documents the shared UI component library for the ecommerce monorepo.

### Packages

| Package               | Purpose                                                                     |
| --------------------- | --------------------------------------------------------------------------- |
| `@ecom/ui`            | Atomic base primitives — atoms, molecules, organisms shared across all apps |
| `@ecom/ui-admin`      | Admin-specific components (sidebar, data-table, stat-card, etc.)            |
| `@ecom/ui-storefront` | Storefront-specific components (product card, cart drawer, etc.)            |

### Architecture

All UI packages follow **Atomic Design** principles:

```
atoms/      → Primitive building blocks (Button, Input, Badge, Avatar)
molecules/  → Composed patterns (Dialog, Tabs, Sheet, Dropdown)
organisms/  → Complex page-level patterns (Pagination, Sidebar)
layouts/     → Page structure wrappers (AdminLayout, StorefrontShell)
```

### Dependency Hierarchy

```
@ecom/ui (base primitives)
    ├── @ecom/ui-admin (admin-specific components)
    └── @ecom/ui-storefront (storefront-specific components)

apps/admin       → depends on @ecom/ui + @ecom/ui-admin
apps/storefront  → depends on @ecom/ui + @ecom/ui-storefront
```

---

## Table of Contents

| Document                                   | Description                                    |
| ------------------------------------------ | ---------------------------------------------- |
| [01-overview.md](./01-overview.md)         | Package roles, dependency graph                |
| [02-architecture.md](./02-architecture.md) | Atomic design layers, CSS token strategy       |
| [03-conventions.md](./03-conventions.md)   | Naming, exports, props, variants, forward refs |
| [04-storybook.md](./04-storybook.md)       | Story writing guidelines and templates         |
| [05-shadcn.md](./05-shadcn.md)             | shadcn integration and component migration     |
| [06-theming.md](./06-theming.md)           | CSS tokens and theme customization             |

---

_Maintained by the engineering team._
