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
    const rootRef = React.useRef<HTMLDivElement | null>(null)
    const headerRef = React.useRef<HTMLElement | null>(null)

    // Bridge the forwarded ref so consumers still receive the root element
    // while the shell keeps an internal handle for header measurement.
    const setRootRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        rootRef.current = node
        if (typeof ref === 'function') ref(node)
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node
      },
      [ref],
    )

    React.useEffect(() => {
      if (!stickyHeader || !blurHeaderOnScroll) return
      const onScroll = () => setScrolled(window.scrollY > 4)
      onScroll()
      window.addEventListener('scroll', onScroll, { passive: true })
      return () => window.removeEventListener('scroll', onScroll)
    }, [stickyHeader, blurHeaderOnScroll])

    /**
     * Publish the measured sticky-header height on the shell root as
     * `--storefront-header-total`. Layouts use this for `position: sticky`
     * top offsets so that content sits flush below the entire header — even
     * when the header renders an optional category-nav row, a promo bar,
     * announcement banner, or anything else taller than `--storefront-header-height`.
     */
    React.useEffect(() => {
      const root = rootRef.current
      const headerEl = headerRef.current
      if (!root || !headerEl) return

      const apply = () => {
        root.style.setProperty('--storefront-header-total', `${headerEl.offsetHeight}px`)
      }
      apply()

      if (typeof ResizeObserver === 'undefined') {
        window.addEventListener('resize', apply)
        return () => window.removeEventListener('resize', apply)
      }
      const ro = new ResizeObserver(apply)
      ro.observe(headerEl)
      return () => ro.disconnect()
      // The ResizeObserver on the DOM node already handles content-driven
      // size changes, so we deliberately do NOT depend on `header` (a
      // ReactNode that gets a fresh reference on every parent render and
      // would otherwise tear down / recreate the observer each render).
      // `stickyHeader` controls whether the <header> element renders at
      // all, so we re-run the effect when it toggles.
    }, [stickyHeader])

    return (
      <div
        ref={setRootRef}
        className={cn(
          'flex min-h-screen flex-col bg-background text-foreground',
          'antialiased selection:bg-[rgb(var(--brand-500-rgb)/0.18)] selection:text-foreground',
          className,
        )}
      >
        {promoBar}
        {header && (
          <header
            ref={headerRef}
            className={cn(
              'w-full',
              stickyHeader && 'sticky top-0 z-[var(--layer-sticky)]',
              stickyHeader && blurHeaderOnScroll
                ? cn(
                    'transition-[background-color,box-shadow,backdrop-filter,border-color] duration-[var(--motion-normal)]',
                    scrolled
                      ? 'bg-[color-mix(in_srgb,var(--surface-base)_82%,transparent)] supports-[backdrop-filter]:bg-[color-mix(in_srgb,var(--surface-base)_65%,transparent)] backdrop-blur-md backdrop-saturate-150 border-b border-[var(--border-subtle)] shadow-[var(--elevation-card)]'
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
