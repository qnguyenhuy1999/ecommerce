'use client'

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
  /** Apply a backdrop blur on the sticky header once the page is scrolled */
  blurHeaderOnScroll?: boolean
}

const StorefrontShell = React.forwardRef<HTMLDivElement, StorefrontShellProps>(
  (
    {
      header,
      footer,
      promoBar,
      children,
      className,
      stickyHeader = true,
      blurHeaderOnScroll = true,
    },
    ref,
  ) => {
    const [scrolled, setScrolled] = React.useState(false)

    React.useEffect(() => {
      if (!stickyHeader || !blurHeaderOnScroll) return
      const onScroll = () => setScrolled(window.scrollY > 4)
      onScroll()
      window.addEventListener('scroll', onScroll, { passive: true })
      return () => window.removeEventListener('scroll', onScroll)
    }, [stickyHeader, blurHeaderOnScroll])

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
              'w-full',
              stickyHeader && 'sticky top-0 z-[var(--layer-sticky)]',
              stickyHeader && blurHeaderOnScroll
                ? cn(
                    'transition-[background-color,box-shadow,backdrop-filter,border-color] duration-[var(--motion-normal)]',
                    scrolled
                      ? 'bg-[rgb(var(--surface-base-rgb,255_255_255)/0.78)] backdrop-blur-md backdrop-saturate-150 supports-[backdrop-filter]:bg-[rgb(var(--surface-base-rgb,255_255_255)/0.65)] border-b border-[var(--border-subtle)] shadow-[var(--elevation-card)]'
                      : 'bg-[var(--surface-base)] border-b border-transparent',
                  )
                : 'bg-[var(--surface-base)] border-b border-[var(--border-subtle)]',
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
