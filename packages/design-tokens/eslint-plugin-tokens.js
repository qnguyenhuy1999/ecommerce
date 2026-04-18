/**
 * @ecom/design-tokens — ESLint plugin
 * Enforces design token usage and blocks raw CSS values in component files.
 *
 * Rules:
 *   no-raw-design-values — blocks raw hex, bare px, raw Tailwind palette in strings
 *   tier-boundary        — catches raw Tailwind palette in JSX className attributes
 */

'use strict'

// ─── Exclusions ──────────────────────────────────────────────────────────────

// Tailwind semantic class names that ARE allowed (don't flag these)
const SEMANTIC_CLASSES = new Set([
  // Semantic color
  'text-foreground', 'text-background', 'text-primary', 'text-secondary',
  'text-muted-foreground', 'text-destructive', 'text-success', 'text-warning', 'text-info',
  'text-link', 'text-link-hover', 'text-brand', 'text-brand-foreground',
  'text-card-foreground', 'text-popover-foreground', 'text-accent-foreground',
  'text-secondary-foreground', 'text-input-foreground',
  'bg-foreground', 'bg-background', 'bg-primary', 'bg-secondary',
  'bg-muted', 'bg-destructive', 'bg-success', 'bg-warning', 'bg-info',
  'bg-brand', 'bg-brand-muted', 'bg-card', 'bg-popover', 'bg-accent',
  'bg-input', 'bg-border', 'bg-ring',
  'border-foreground', 'border-background', 'border-primary', 'border-secondary',
  'border-muted', 'border-destructive', 'border-success', 'border-warning', 'border-info',
  'border-brand', 'border-card', 'border-popover', 'border-accent',
  'border-input', 'border-ring',
  'ring-foreground', 'ring-background', 'ring-primary', 'ring-secondary',
  'ring-muted', 'ring-destructive', 'ring-success', 'ring-warning', 'ring-info',
  'ring-brand', 'ring-card', 'ring-popover', 'ring-accent',
  'ring-input', 'ring-border',
  // Semantic shadows
  'shadow-sm', 'shadow-md', 'shadow-lg', 'shadow-xl', 'shadow-2xl',
  'shadow-none',
  // Border radius (semantic)
  'rounded-none', 'rounded-sm', 'rounded-md', 'rounded-lg', 'rounded-xl',
  'rounded-2xl', 'rounded-full',
  // Opacity / state helpers
  'opacity-0', 'opacity-5', 'opacity-10', 'opacity-20', 'opacity-25',
  'opacity-30', 'opacity-40', 'opacity-50', 'opacity-60', 'opacity-70',
  'opacity-75', 'opacity-80', 'opacity-90', 'opacity-95', 'opacity-100',
  // Z-index helpers
  'z-0', 'z-10', 'z-20', 'z-30', 'z-40', 'z-50', 'z-auto',
  // Focus ring
  'focus-visible:ring-2', 'focus-visible:ring-offset-2',
])

// Regex: patterns to exclude from flagging even if they contain palette-like strings
const ALLOWED_TAILWIND_PREFIXES = [
  // Motion/animation in arbitrary brackets — keep as-is
  /(?:^|[\s"'])(?:duration|ease|scale|delay|translate|rotate|skew|blur|brightness|contrast|drop-shadow|grayscale|hue-rotate|invert|saturate|sepia|backdrop-blur|backdrop-brightness|backdrop-contrast|backdrop-grayscale|backdrop-hue-rotate|backdrop-invert|backdrop-opacity|backdrop-saturate|backdrop-sepia)-(\[[^\]]+\]|[\w-]+)/gi,
  // Animation names with specific semantic prefixes
  /(?:^|[\s"'])animate-(?:shimmer[_/]|fade[-/]|slide[-/]|spin|bounce|pulse|ping)/gi,
  // Shadow with elevation var in brackets
  /(?:^|[\s"'])shadow-\[var\(--elevation-[^)]+\)\]/gi,
  // Elevation tokens in brackets (component-level)
  /(?:^|[\s"'])\w+-\[var\(--(?:elevation|motion|transition|density)-[^\)]+\)\]/gi,
]

// Regex: raw hex color — matches #fff, #aabbcc, #12345678, etc.
const RAW_HEX = /#[0-9a-fA-F]{3,8}\b/

// Regex: bare px — digit(s) followed by px, NOT inside var()
const RAW_PX = /\b\d+(?:\.\d+)?px\b/

// Regex: Tailwind palette utilities (text-|bg-|border-|ring- with numeric shades)
const RAW_TW_PALETTE = /(?:^|[\s"'])(?:text|bg|border|ring|outline|shadow|stroke|fill)-(?:gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|white|black)-(?:[\d]+(?:-\d+)?(?:\/[0-9.]+)?)(?=\s|["']|$|[^a-z-])/gi

// Regex: URL/data URI context — never flag hex values inside these
const URL_LITERAL = /^https?:\/\//i
const DATA_URI = /^data:(?:image|font|audio|video)/i
const SRC_ATTR = /^(?:src|href|srcSet|poster|icon|itemProp)$/

/**
 * Returns true if the filename is inside the design-tokens package itself.
 * Those files are the source of truth and should not be linted for raw values.
 */
function isDesignTokensPackage(filename) {
  return /\bpackages[/\\]design-tokens[/\\]/.test(filename)
}

/**
 * Returns true if the literal value is a URL-like context (src, href, data URI, etc.)
 * where hex values should not be flagged.
 */
function isUrlContext(node) {
  // Check if this literal is inside a known URL attribute
  // The parent could be a JSXAttribute or a Property with specific names
  if (node.parent) {
    const parent = node.parent
    if (parent.type === 'JSXAttribute') {
      const attrName = parent.name && (parent.name.name || parent.name.expression && parent.name.expression.name)
      if (attrName && (SRC_ATTR.test(attrName) || /^(url|cite|formAction|value)$/i.test(attrName))) {
        return true
      }
    }
    if (parent.type === 'Property') {
      const keyName = parent.key && (parent.key.name || parent.key.value)
      if (keyName && SRC_ATTR.test(keyName)) return true
    }
  }
  return false
}

/**
 * Check if a class in a className string is a recognized semantic class.
 * E.g. "text-foreground" is allowed, "text-gray-500" is not.
 */
function containsRawPaletteClass(str) {
  const classes = str.split(/\s+/).filter(Boolean)
  for (const cls of classes) {
    // Remove variant prefixes (hover:, focus:, active:, etc.) to get the base class
    const base = cls.replace(/^(?:hover|focus|active|disabled|group-hover|peer-hover|aria-checked|data-[^:]+|last|first|odd|even|only|empty|root|file):/, '')
    if (!SEMANTIC_CLASSES.has(base) && RAW_TW_PALETTE.test(base)) {
      return true
    }
  }
  return false
}

/**
 * Returns true if the value is an allowed Tailwind/motion pattern
 * (animation name, motion bracket, etc.) that should not be flagged.
 */
function isAllowedPattern(str) {
  for (const pattern of ALLOWED_TAILWIND_PREFIXES) {
    if (pattern.test(str)) return true
  }
  return false
}

// ─── Rule: no-raw-design-values ─────────────────────────────────────────────

const noRawDesignValuesRule = {
  meta: {
    name: 'no-raw-design-values',
    version: '1.0.0',
    schema: [],
    messages: {
      rawHex: 'Raw hex color — use a design token (var(--*)) instead.',
      rawPx: 'Bare px value — use a design token (var(--space-*)) instead.',
      rawTwPalette: 'Raw Tailwind palette (e.g. "text-red-500") — use a semantic token (text-foreground, bg-muted, etc.) or design token var(--*) instead.',
    },
  },
  create(context) {
    const filename = context.filename || context.getFilename()

    // Skip the design-tokens package itself
    if (isDesignTokensPackage(filename)) return {}

    function checkLiteral(node) {
      if (typeof node.value !== 'string') return
      const val = node.value

      // Skip URL/data URI contexts — hex in href/src is legitimate
      if (isUrlContext(node)) return

      // Check for raw hex
      if (RAW_HEX.test(val)) {
        context.report({ node, messageId: 'rawHex' })
        return
      }

      // Skip allowed motion/animation patterns
      if (isAllowedPattern(val)) return

      // Check for bare px (but not inside var())
      if (!val.includes('var(') && RAW_PX.test(val)) {
        context.report({ node, messageId: 'rawPx' })
        return
      }

      // Check for raw Tailwind palette (reset lastIndex for global regex)
      RAW_TW_PALETTE.lastIndex = 0
      if (RAW_TW_PALETTE.test(val)) {
        context.report({ node, messageId: 'rawTwPalette' })
      }
    }

    function checkTemplateLiteral(node) {
      if (!node.quasi) return
      const raw = node.quasi.value.raw

      // Skip allowed motion/animation patterns
      if (isAllowedPattern(raw)) return

      // Check for raw hex
      if (RAW_HEX.test(raw)) {
        context.report({ node: node.quasi, messageId: 'rawHex' })
        return
      }

      // Check for bare px (but not inside var())
      if (!raw.includes('var(') && RAW_PX.test(raw)) {
        context.report({ node: node.quasi, messageId: 'rawPx' })
        return
      }

      // Check for raw Tailwind palette
      RAW_TW_PALETTE.lastIndex = 0
      if (RAW_TW_PALETTE.test(raw)) {
        context.report({ node: node.quasi, messageId: 'rawTwPalette' })
      }
    }

    return {
      Literal: checkLiteral,
      TemplateLiteral: checkTemplateLiteral,
    }
  },
}

// ─── Rule: tier-boundary ─────────────────────────────────────────────────────

const tierBoundaryRule = {
  meta: {
    name: 'tier-boundary',
    version: '1.0.0',
    schema: [],
    messages: {
      rawClassName: 'Raw Tailwind utility class — use design token or semantic class instead.',
    },
  },
  create(context) {
    const filename = context.filename || context.getFilename()

    if (isDesignTokensPackage(filename)) return {}

    return {
      JSXAttribute(node) {
        if (
          node.attribute &&
          node.attribute.type === 'JSXIdentifier' &&
          node.attribute.name === 'className' &&
          node.value &&
          node.value.type === 'Literal'
        ) {
          const val = node.value.value || ''
          if (isAllowedPattern(val)) return
          RAW_TW_PALETTE.lastIndex = 0
          if (RAW_TW_PALETTE.test(val)) {
            context.report({ node: node.value, messageId: 'rawClassName' })
          }
        }
      },
    }
  },
}

module.exports = {
  rules: {
    'no-raw-design-values': noRawDesignValuesRule,
    'tier-boundary': tierBoundaryRule,
  },
  meta: {
    name: '@ecom/eslint-plugin-tokens',
    version: '1.0.0',
  },
}
