import React, { useState } from 'react'

import { cn } from '@ecom/ui'

import { PromoBarClient } from './PromoBarClient'

// ─── Server: promo bar content, client handles dismiss ────────────────────────
export interface PromoBarProps extends React.HTMLAttributes<HTMLDivElement> {
  message: React.ReactNode
  link?: string
  dismissible?: boolean
  variant?: 'brand' | 'info' | 'success' | 'dark'
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
    return (
      <div className="min-h-[var(--space-9)] overflow-hidden transition-all duration-[var(--motion-normal)]" />
    )
  }

  const content = <div className="flex-1 text-center truncate px-4">{message}</div>

  const variantClass = {
    brand: 'promo-bar--brand',
    info: 'promo-bar--info',
    success: 'promo-bar--success',
    dark: 'bg-foreground text-background font-semibold text-sm py-2 text-center',
  }[variant]

  return (
    <div
      className={cn(
        'promo-bar relative flex items-center justify-center w-full min-min-h-[var(--space-9)]',
        variantClass,
        className,
      )}
      {...props}
    >
      {link ? (
        <a
          href={link}
          className="absolute inset-0 z-0 flex items-center justify-center hover:underline underline-offset-4 decoration-current/50"
        >
          <span className="sr-only">Promo link</span>
        </a>
      ) : null}

      <div className="relative z-10 flex items-center w-full max-w-7xl mx-auto px-4">
        <div className="w-6 shrink-0" />
        {content}
        <div className="w-6 shrink-0 flex justify-end">
          {dismissible && <PromoBarClient onDismiss={() => setIsVisible(false)} />}
        </div>
      </div>
    </div>
  )
}

export { PromoBar }
