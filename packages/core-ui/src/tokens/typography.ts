/**
 * Typography tokens — font sizes and line heights.
 */
export const typography = {
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem',
  },
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },
  fontFamily: {
    sans: 'Inter Variable, ui-sans-serif, system-ui, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  },
} as const

export const typographyVariantRecipes = {
  h1: {
    element: 'h1',
    className: 'scroll-m-20 text-4xl font-extrabold tracking-tight text-balance',
  },
  h2: {
    element: 'h2',
    className: 'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0',
  },
  h3: {
    element: 'h3',
    className: 'scroll-m-20 text-2xl font-semibold tracking-tight',
  },
  h4: {
    element: 'h4',
    className: 'scroll-m-20 text-xl font-semibold tracking-tight',
  },
  body: {
    element: 'p',
    className: 'leading-7',
  },
  'body-sm': {
    element: 'p',
    className: 'text-sm leading-6',
  },
  caption: {
    element: 'p',
    className: 'text-xs leading-5',
  },
  label: {
    element: 'span',
    className: 'text-sm leading-none font-medium',
  },
  muted: {
    element: 'p',
    className: 'text-muted-foreground text-sm leading-6',
  },
  blockquote: {
    element: 'blockquote',
    className: 'mt-6 border-l-2 pl-6 italic',
  },
} as const

export type TypographyVariant = keyof typeof typographyVariantRecipes
