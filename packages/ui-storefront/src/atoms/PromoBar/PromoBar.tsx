import React, { useState } from 'react'

import { cn } from '@ecom/ui'

import { PromoBarClient } from './PromoBarClient'

export interface PromoBarProps extends React.HTMLAttributes<HTMLDivElement> {
  message: React.ReactNode
  link?: string
  dismissible?: boolean
  variant?: 'brand' | 'info' | 'success' | 'dark'
}

const variantClass: Record<NonNullable<PromoBarProps['variant']>, string> = {
  brand: 'bg-[var(--action-primary)] text-[var(--action-primary-foreground)]',
  info: 'bg-[var(--intent-info)] text-[var(--intent-info-foreground)]',
  success: 'bg-[var(--intent-success)] text-[var(--intent-success-foreground)]',
  dark: 'bg-foreground text-background',
}

function PromoBar({
  message,
  link,
  dismissible = false,
  variant = 'brand',
  className,
  ...props
}: PromoBarProps) {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) {
    return null
  }

  return (
    <div
      className={cn(
        'relative flex w-full items-center justify-center',
        'min-h-[var(--space-9)] py-[var(--space-2)] px-[var(--space-4)]',
        'text-[length:var(--text-sm)] font-medium tracking-[0.005em]',
        variantClass[variant],
        className,
      )}
      {...props}
    >
      <div className="mx-auto flex w-full max-w-[var(--storefront-content-max-width)] items-center justify-center gap-[var(--space-3)]">
        {link ? (
          <a
            href={link}
            className="inline-flex items-center gap-[var(--space-2)] truncate underline-offset-4 hover:underline"
          >
            {message}
          </a>
        ) : (
          <span className="truncate">{message}</span>
        )}
      </div>
      {dismissible && (
        <div className="absolute right-[var(--space-2)] top-1/2 -translate-y-1/2">
          <PromoBarClient onDismiss={() => setIsVisible(false)} />
        </div>
      )}
    </div>
  )
}

export { PromoBar }
