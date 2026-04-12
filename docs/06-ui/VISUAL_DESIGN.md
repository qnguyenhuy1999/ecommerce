# Design System – Airbnb Inspired (Light & Dark Theme)

---

# 1. Visual Theme & Atmosphere

This design system is inspired by Airbnb’s warm, photography-forward marketplace experience. It feels like flipping through a travel magazine where every page invites exploration and booking.

The foundation is minimal and restrained:

- Photography-first
- Single brand accent (Rausch Red)
- Warm typography
- Soft, natural elevation
- Generous border radius
- Token-based color system

The interface is designed for browsing, not commanding.

---

## 1.1 Core Brand Philosophy

- Start with white (light) or charcoal (dark)
- Let photography provide the emotional color
- Use red only for primary actions
- Never use pure black (#000000)
- Use warm near-black for text
- Use multi-layer shadows for natural lift
- Always use generous rounding

---

# 2. Theme Architecture

The system supports:

- ✅ Light Theme (default)
- ✅ Dark Theme (system or user toggled)
- ✅ Token-driven color switching
- ✅ No hardcoded colors in components

All components must use semantic tokens.

---

# 3. Color System (Token-Based)

Use semantic variables:
--palette-\*

---

# 3.1 Light Theme

## Background & Surfaces

| Role            | Token                          | Value   |
| --------------- | ------------------------------ | ------- |
| Page Background | --palette-bg-page              | #ffffff |
| Card Background | --palette-bg-surface           | #ffffff |
| Light Surface   | --palette-bg-surface-secondary | #f2f2f2 |
| Border          | --palette-border-default       | #c1c1c1 |

---

## Brand

| Role           | Token                      | Value   |
| -------------- | -------------------------- | ------- |
| Primary Accent | --palette-bg-primary-core  | #ff385c |
| Pressed Accent | --palette-bg-tertiary-core | #e00b41 |
| Luxe Tier      | --palette-bg-primary-luxe  | #460479 |
| Plus Tier      | --palette-bg-primary-plus  | #92174d |

---

## Text

| Role          | Token                        | Value            |
| ------------- | ---------------------------- | ---------------- |
| Primary       | --palette-text-primary       | #222222          |
| Focused       | --palette-text-focused       | #3f3f3f          |
| Secondary     | --palette-text-secondary     | #6a6a6a          |
| Disabled      | --palette-text-disabled      | rgba(0,0,0,0.24) |
| Link Disabled | --palette-text-link-disabled | #929292          |
| Legal         | --palette-text-legal         | #428bff          |
| Error         | --palette-text-primary-error | #c13515          |

---

## Shadows (Light)

**Card Shadow (Level 1)**
rgba(0,0,0,0.02) 0px 0px 0px 1px,
rgba(0,0,0,0.04) 0px 2px 6px,
rgba(0,0,0,0.1) 0px 4px 8px

**Hover Shadow (Level 2)**
rgba(0,0,0,0.08) 0px 4px 12px

---

# 3.2 Dark Theme

Dark mode preserves warmth. It is NOT pure black UI.

## Background & Surfaces

| Role              | Token                          | Value                  |
| ----------------- | ------------------------------ | ---------------------- |
| Page Background   | --palette-bg-page              | #121212                |
| Card Background   | --palette-bg-surface           | #1c1c1c                |
| Secondary Surface | --palette-bg-surface-secondary | #2a2a2a                |
| Border            | --palette-border-default       | rgba(255,255,255,0.08) |

---

## Brand

Brand red remains identical:

| Role           | Token                      | Value   |
| -------------- | -------------------------- | ------- |
| Primary Accent | --palette-bg-primary-core  | #ff385c |
| Pressed Accent | --palette-bg-tertiary-core | #e00b41 |

---

## Text (Dark)

| Role          | Token                        | Value                 |
| ------------- | ---------------------------- | --------------------- |
| Primary       | --palette-text-primary       | #f7f7f7               |
| Secondary     | --palette-text-secondary     | #b3b3b3               |
| Focused       | --palette-text-focused       | #ffffff               |
| Disabled      | --palette-text-disabled      | rgba(255,255,255,0.3) |
| Link Disabled | --palette-text-link-disabled | #777777               |
| Legal         | --palette-text-legal         | #6ea8ff               |
| Error         | --palette-text-primary-error | #ff6b5e               |

---

## Shadows (Dark)

**Card Shadow (Dark Level 1)**
rgba(255,255,255,0.02) 0px 0px 0px 1px,
rgba(0,0,0,0.6) 0px 6px 16px

**Hover Shadow (Dark Level 2)**
rgba(0,0,0,0.8) 0px 8px 24px

---

# 4. Typography System

## Font Family

Airbnb Cereal VF,
Circular,
-apple-system,
system-ui,
Roboto,
Helvetica Neue

OpenType:
font-feature-settings: "salt";

---

## Weight Philosophy

- 500 (Medium) – Default UI
- 600 (Semibold) – Emphasis
- 700 (Bold) – Primary headings
- ❌ Never use 300 or thin weights for headings

---

## Hierarchy

| Role            | Size | Weight  | Line Height | Letter Spacing |
| --------------- | ---- | ------- | ----------- | -------------- |
| Section Heading | 28px | 700     | 1.43        | normal         |
| Card Heading    | 22px | 600     | 1.18        | -0.44px        |
| Sub Heading     | 21px | 700     | 1.43        | normal         |
| Feature Title   | 20px | 600     | 1.20        | -0.18px        |
| UI Text         | 16px | 500–600 | 1.25        | normal         |
| Body            | 14px | 400–500 | 1.43        | normal         |
| Small           | 13px | 400     | 1.23        | normal         |
| Tag             | 12px | 400–700 | 1.33        | normal         |
| Badge           | 11px | 600     | 1.18        | normal         |
| Micro Uppercase | 8px  | 700     | 1.25        | 0.32px         |

---

# 5. Border Radius Scale

| Usage             | Radius |
| ----------------- | ------ |
| Small links       | 4px    |
| Buttons           | 8px    |
| Badges            | 14px   |
| Cards             | 20px   |
| Large containers  | 32px   |
| Circular controls | 50%    |

No sharp corners on cards.

---

# 6. Elevation System

| Level   | Use                 |
| ------- | ------------------- |
| Level 0 | Flat background     |
| Level 1 | Cards, search       |
| Level 2 | Hover lift          |
| Level 3 | Active / Focus ring |

Shadows must feel natural and soft.

---

# 7. Component Guidelines

## 7.1 Buttons

Primary Button:

Light:

- Background: #222222
- Text: #ffffff

Dark:

- Background: #f7f7f7
- Text: #121212

Radius: 8px  
Padding: 0 24px  
Hover: transition to brand red  
Focus: 2px focus ring + slight scale

---

## 7.2 Cards

- Radius: 20px
- Three-layer shadow
- Photography occupies top 60–70%
- Content below image

Dark mode:

- Subtle glow border
- Reduced heavy shadow

---

## 7.3 Search Bar

- Prominent placement
- 32px radius container
- Red circular search CTA
- Expands on desktop
- Compact on mobile

---

## 7.4 Listing Card

Structure:

1. Image (16:10 ratio)
2. Wishlist icon (top-right overlay)
3. Title (16px, 600)
4. Description (14px, secondary)
5. Price tag (12–14px)

Full card tap target on mobile.

---

# 8. Layout System

## Spacing Scale

Base unit: 8px

Allowed spacing:
2, 3, 4, 6, 8, 10, 11, 12, 15, 16, 22, 24, 32

---

## Grid Behavior

| Breakpoint  | Columns |
| ----------- | ------- |
| <375px      | 1       |
| 375–550px   | 1       |
| 550–744px   | 2       |
| 950–1128px  | 3       |
| 1128–1440px | 4       |
| 1440–1920px | 5       |

---

# 9. Image Treatment

- Photography-first
- Generous height
- Swipe carousel on mobile
- Dot indicators
- 8–14px image radius
- Heart icon overlay
- Maintain aspect ratio

Images are hero. UI supports.

---

# 10. Do’s and Don’ts

## Do

- Use #222222 (light text)
- Use #f7f7f7 (dark text)
- Use red sparingly
- Use soft three-layer shadows
- Use warm typography
- Use generous radius

## Don’t

- Don’t use pure black (#000000)
- Don’t use red as background surface
- Don’t introduce new brand colors
- Don’t use sharp 0px corners
- Don’t use heavy dramatic shadows
- Don’t hardcode colors (use tokens)

---

# Final Principle

White (or charcoal) is canvas.  
Photography is color.  
Red is action.  
Warmth is identity.  
Soft depth creates trust.
