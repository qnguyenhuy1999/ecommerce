import React from 'react'

import { cn } from '@ecom/ui'

export interface StorefrontSectionProps extends React.HTMLAttributes<HTMLElement> {
  eyebrow?: string
  title?: string
  description?: string
  action?: React.ReactNode
  contentClassName?: string
  /** Vertical spacing scale */
  spacing?: 'compact' | 'default' | 'comfortable'
}

const spacingClass = {
  compact: 'py-[var(--space-10)] md:py-[var(--space-12)]',
  default: 'py-[var(--space-12)] md:py-[var(--space-16)] lg:py-[var(--space-20)]',
  comfortable: 'py-[var(--space-14)] md:py-[var(--space-20)] lg:py-[var(--space-24)]',
} as const

const StorefrontSection = React.forwardRef<HTMLElement, StorefrontSectionProps>(
  (
    {
      eyebrow,
      title,
      description,
      action,
      className,
      contentClassName,
      spacing = 'default',
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <section
        ref={ref}
        className={cn(
          'px-[var(--space-4)] md:px-[var(--space-6)] lg:px-[var(--space-8)]',
          spacingClass[spacing],
          className,
        )}
        {...props}
      >
        {(eyebrow || title || description || action) && (
          <div className="mx-auto mb-[var(--space-8)] flex max-w-[var(--storefront-content-max-width)] flex-col gap-[var(--space-4)] md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl space-y-[var(--space-2)]">
              {eyebrow && (
                <p className="text-[length:var(--text-xs)] font-semibold uppercase tracking-[0.16em] text-[var(--text-brand)]">
                  {eyebrow}
                </p>
              )}
              {title && (
                <h2 className="text-[length:var(--font-size-heading-xl)] font-bold tracking-[-0.015em] text-foreground leading-[var(--line-height-tight)]">
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-[length:var(--font-size-body-md)] leading-[var(--line-height-relaxed)] text-[var(--text-secondary)]">
                  {description}
                </p>
              )}
            </div>
            {action && <div className="shrink-0">{action}</div>}
          </div>
        )}

        <div className={cn('mx-auto max-w-[var(--storefront-content-max-width)]', contentClassName)}>
          {children}
        </div>
      </section>
    )
  },
)

StorefrontSection.displayName = 'StorefrontSection'

export { StorefrontSection }
