import React from 'react'

import { cn } from '@ecom/ui'

export interface StorefrontSectionProps extends React.HTMLAttributes<HTMLElement> {
  eyebrow?: string
  title?: string
  description?: string
  action?: React.ReactNode
  contentClassName?: string
}

function StorefrontSection({
  eyebrow,
  title,
  description,
  action,
  className,
  contentClassName,
  children,
  ...props
}: StorefrontSectionProps) {
  return (
    <section className={cn('px-4 py-10 md:px-8 md:py-14', className)} {...props}>
      {(eyebrow || title || description || action) && (
        <div className="mx-auto mb-8 flex max-w-[var(--storefront-content-max-width)] flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl space-y-3">
            {eyebrow && (
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand/80">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="text-3xl font-bold tracking-tight text-foreground">{title}</h2>
            )}
            {description && (
              <p className="text-base leading-relaxed text-muted-foreground">{description}</p>
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
}

export { StorefrontSection }
