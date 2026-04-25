import React from 'react'

import { cn } from '@ecom/ui'

type EmptyStateCardTone = 'dashed' | 'subtle' | 'plain'

const TONE_CLASSES: Record<EmptyStateCardTone, string> = {
  dashed:
    'rounded-[var(--radius-2xl)] border border-dashed border-[var(--border-subtle)] bg-[var(--surface-subtle)]',
  subtle: 'rounded-[var(--radius-2xl)] border border-[var(--border-subtle)] bg-[var(--surface-subtle)]',
  plain: 'rounded-[var(--radius-2xl)]',
}

export interface EmptyStateCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Visual treatment for the recovery container. Defaults to `dashed`. */
  tone?: EmptyStateCardTone
  /** Padding scale. `default` matches OrderHistory / Wishlist / Search recovery. */
  size?: 'compact' | 'default' | 'comfortable'
}

const SIZE_PADDING = {
  compact: 'px-[var(--space-5)] py-[var(--space-8)]',
  default: 'px-[var(--space-6)] py-[var(--space-12)]',
  comfortable: 'px-[var(--space-8)] py-[var(--space-16)]',
}

/**
 * Reusable recovery / empty-state surface. Standardises the dashed-border
 * panel that previously was duplicated in OrderHistory, Wishlist, and Search
 * "no results" flows. Wrap an `<EmptyState>` (or any custom recovery content)
 * inside this so the visual chrome is consistent.
 */
function EmptyStateCard({
  tone = 'dashed',
  size = 'default',
  className,
  children,
  ...props
}: EmptyStateCardProps) {
  return (
    <div className={cn(TONE_CLASSES[tone], SIZE_PADDING[size], className)} {...props}>
      {children}
    </div>
  )
}

export { EmptyStateCard }
