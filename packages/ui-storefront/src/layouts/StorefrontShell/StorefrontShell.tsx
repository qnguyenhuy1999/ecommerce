import React from 'react'

import { cn } from '@ecom/ui'

export interface StorefrontShellProps {
  header?: React.ReactNode
  footer?: React.ReactNode
  promoBar?: React.ReactNode
  children: React.ReactNode
  className?: string
  /** Make the header sticky when scrolling */
  stickyHeader?: boolean
}

const StorefrontShell = React.forwardRef<HTMLDivElement, StorefrontShellProps>(
  ({ header, footer, promoBar, children, className, stickyHeader = true }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex min-h-screen flex-col bg-background text-foreground',
          'antialiased selection:bg-[rgb(var(--brand-500-rgb)/0.18)] selection:text-foreground',
          className,
        )}
      >
        {promoBar}
        {header && (
          <header
            className={cn(
              'w-full border-b border-[var(--border-subtle)] bg-[var(--surface-base)]',
              stickyHeader && 'sticky top-0 z-[var(--layer-sticky)]',
            )}
          >
            {header}
          </header>
        )}
        <main className="flex-1">{children}</main>
        {footer && (
          <footer className="border-t border-[var(--border-subtle)] bg-[var(--surface-subtle)]">
            {footer}
          </footer>
        )}
      </div>
    )
  },
)
StorefrontShell.displayName = 'StorefrontShell'

export { StorefrontShell }
