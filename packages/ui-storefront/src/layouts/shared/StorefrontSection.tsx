import React from 'react'

import { cn } from '@ecom/ui/utils'

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
  compact: 'py-10 md:py-12',
  default: 'py-12 md:py-16 lg:py-20',
  comfortable: 'py-14 md:py-20 lg:py-24',
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
        className={cn('px-4 md:px-6 lg:px-8', spacingClass[spacing], className)}
        {...props}
      >
        {(eyebrow || title || description || action) && (
          <div className="mx-auto mb-8 flex max-w-[var(--storefront-content-max-width)] flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl space-y-2">
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

        <div
          className={cn('mx-auto max-w-[var(--storefront-content-max-width)]', contentClassName)}
        >
          {children}
        </div>
      </section>
    )
  },
)

StorefrontSection.displayName = 'StorefrontSection'

export { StorefrontSection }
