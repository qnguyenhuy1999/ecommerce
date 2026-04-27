'use client'

import React from 'react'

import { cn } from '@ecom/ui/utils'

import { StorefrontShellProvider } from '../context/StorefrontShellContext'
import { StorefrontShellFooter } from './StorefrontShellFooter'
import { StorefrontShellHeader } from './StorefrontShellHeader'
import { StorefrontShellMain } from './StorefrontShellMain'
import { StorefrontShellPromoBar } from './StorefrontShellPromoBar'

/**
 * StorefrontShellRoot — Page-level shell that orders chrome zones.
 *
 * Layer: Template
 * RSC: No — requires 'use client'
 * Props: Controls sticky header behavior and composes promo/header/main/footer.
 */
export interface StorefrontShellRootProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Make the header sticky when scrolling */
  stickyHeader?: boolean
  /** Apply a backdrop blur on the sticky header once the page is scrolled */
  blurHeaderOnScroll?: boolean
  children: React.ReactNode
}

export const StorefrontShellRoot = React.forwardRef<HTMLDivElement, StorefrontShellRootProps>(
  ({ children, className, stickyHeader = true, blurHeaderOnScroll = true, ...props }, ref) => {
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
    }, [stickyHeader])

    const childArray = React.useMemo(() => React.Children.toArray(children), [children])

    const promoBarChild = childArray.find(
      (c) => React.isValidElement(c) && (c.type as React.ComponentType<unknown>) === StorefrontShellPromoBar,
    ) as React.ReactElement<React.ComponentProps<typeof StorefrontShellPromoBar>> | undefined

    const headerChild = childArray.find(
      (c) => React.isValidElement(c) && (c.type as React.ComponentType<unknown>) === StorefrontShellHeader,
    ) as React.ReactElement<React.ComponentProps<typeof StorefrontShellHeader>> | undefined

    const footerChild = childArray.find(
      (c) => React.isValidElement(c) && (c.type as React.ComponentType<unknown>) === StorefrontShellFooter,
    ) as React.ReactElement<React.ComponentProps<typeof StorefrontShellFooter>> | undefined

    const mainChild = childArray.find(
      (c) => React.isValidElement(c) && (c.type as React.ComponentType<unknown>) === StorefrontShellMain,
    ) as React.ReactElement<React.ComponentProps<typeof StorefrontShellMain>> | undefined

    const remaining = childArray.filter((c) => {
      if (!React.isValidElement(c)) return true
      const t = c.type as React.ComponentType<unknown>
      return (
        t !== StorefrontShellPromoBar &&
        t !== StorefrontShellHeader &&
        t !== StorefrontShellFooter &&
        t !== StorefrontShellMain
      )
    })

    const resolvedMain = mainChild ?? <StorefrontShellMain>{remaining}</StorefrontShellMain>

    return (
      <StorefrontShellProvider
        value={{
          stickyHeader,
          blurHeaderOnScroll,
          scrolled,
          headerRef,
        }}
      >
        <div
          ref={setRootRef}
          className={cn(
            'flex min-h-screen flex-col bg-background text-foreground',
            'antialiased selection:bg-[rgb(var(--brand-500-rgb)/0.18)] selection:text-foreground',
            className,
          )}
          {...props}
        >
          {promoBarChild}
          {headerChild}
          {resolvedMain}
          {footerChild}
        </div>
      </StorefrontShellProvider>
    )
  },
)

StorefrontShellRoot.displayName = 'StorefrontShell'

