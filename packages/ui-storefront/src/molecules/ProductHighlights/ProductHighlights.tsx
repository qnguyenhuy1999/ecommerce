import React from 'react'

import { cn } from '@ecom/ui'

export interface ProductHighlightsProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Product feature highlights */
  highlights?: string[]
  /** Free-form product description */
  description?: React.ReactNode
}

function ProductHighlights({
  highlights = [],
  description,
  className,
  ...props
}: ProductHighlightsProps) {
  if (highlights.length === 0 && !description) return null

  return (
    <div
      className={cn(
        'rounded-[var(--radius-xl)] border border-border/70 bg-card p-5 shadow-[var(--elevation-card)]',
        className,
      )}
      {...props}
    >
      {highlights.length > 0 && (
        <ul className="space-y-2.5 text-sm text-foreground/90">
          {highlights.map((highlight) => (
            <li key={highlight} className="flex gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      )}
      {description && (
        <div
          className={cn(
            'text-sm leading-relaxed text-muted-foreground',
            highlights.length > 0 && 'mt-5 border-t border-border/60 pt-5',
          )}
        >
          {description}
        </div>
      )}
    </div>
  )
}

export { ProductHighlights }
