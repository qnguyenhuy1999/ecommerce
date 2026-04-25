import React from 'react'

import { cn } from '@ecom/ui'

/**
 * Vertical breathing options. Pages anchor to a single rhythm so the storefront
 * feels cohesive top-to-bottom; this choice maps each option to the same token
 * scale used elsewhere (matches Home Page reference).
 */
type PageContainerPadding = 'none' | 'compact' | 'default' | 'comfortable'

const VERTICAL_PADDING: Record<PageContainerPadding, string> = {
  none: '',
  compact: 'py-[var(--space-6)] lg:py-[var(--space-8)]',
  default: 'py-[var(--space-8)] lg:py-[var(--space-12)]',
  comfortable: 'py-[var(--space-12)] lg:py-[var(--space-16)]',
}

export interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Vertical padding rhythm. Defaults to `default` (matches Home reference). */
  padding?: PageContainerPadding
  /**
   * Render the container without horizontal gutters — useful when the section
   * content already paints its own full-bleed band but still needs the centered
   * max-width.
   */
  bleed?: boolean
  as?: 'div' | 'section' | 'main' | 'article'
}

/**
 * Canonical content container for storefront pages. Centers content at
 * `--storefront-content-max-width`, applies the standard 4 / 6 / 8 horizontal
 * gutter scale, and lets callers pick the vertical rhythm. This is the single
 * source of truth — every page layout should compose this rather than
 * hand-rolling its own `max-w` + `px-` + `py-` triple.
 */
function PageContainer({
  padding = 'default',
  bleed = false,
  as: Tag = 'div',
  className,
  children,
  ...props
}: PageContainerProps) {
  return (
    <Tag
      className={cn(
        'mx-auto w-full max-w-[var(--storefront-content-max-width)]',
        !bleed && 'px-[var(--space-4)] sm:px-[var(--space-6)] lg:px-[var(--space-8)]',
        VERTICAL_PADDING[padding],
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}

export { PageContainer }
