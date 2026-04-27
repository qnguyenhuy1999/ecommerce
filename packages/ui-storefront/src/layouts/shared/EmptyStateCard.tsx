import React from 'react'

import { cn } from '@ecom/ui/utils'

type EmptyStateCardTone = 'dashed' | 'subtle' | 'plain'

const TONE_CLASSES: Record<EmptyStateCardTone, string> = {
  dashed:
    'rounded-[var(--radius-2xl)] border border-dashed border-[var(--border-subtle)] bg-[var(--surface-subtle)]',
  subtle:
    'rounded-[var(--radius-2xl)] border border-[var(--border-subtle)] bg-[var(--surface-subtle)]',
  plain: 'rounded-[var(--radius-2xl)]',
}

export interface EmptyStateCardProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: EmptyStateCardTone
  size?: 'compact' | 'default' | 'comfortable'
}

const SIZE_PADDING = {
  compact: 'px-5 py-8',
  default: 'px-6 py-12',
  comfortable: 'px-8 py-16',
}

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
