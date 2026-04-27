import React from 'react'

import { cn } from '@ecom/ui/utils'

import { StorefrontPageShell } from '../shared/StorefrontPageShell'
import type { StorefrontFooter } from '../StorefrontFooter/StorefrontFooter'
import type { StorefrontHeader } from '../StorefrontHeader/StorefrontHeader'

export interface HomePageLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  promoBar?: React.ReactNode
  header?: React.ReactNode
  footer?: React.ReactNode
  headerProps?: React.ComponentProps<typeof StorefrontHeader>
  footerProps?: React.ComponentProps<typeof StorefrontFooter>
  trustBanner?: React.ReactNode
  quickNav?: React.ReactNode
  hero?: React.ReactNode
  categories?: React.ReactNode
  flashSale?: React.ReactNode
  trending?: React.ReactNode
  bestSellers?: React.ReactNode
  /** Optional full-width visual banner — used as an emotional/branding break between sections. */
  visualBanner?: React.ReactNode
  recommended?: React.ReactNode
  brands?: React.ReactNode
  newArrivals?: React.ReactNode
  newsletter?: React.ReactNode
}

/**
 * Wraps a section in a coloured background band so consumers don't have to
 * remember to do it themselves. Uses subtle/muted surfaces from the design tokens
 * to keep visual rhythm without resorting to heavy borders.
 */
function Band({
  tone,
  children,
}: {
  tone: 'base' | 'subtle' | 'muted'
  children?: React.ReactNode
}) {
  if (!children) return null
  return (
    <div
      className={cn(
        tone === 'base' && 'bg-[var(--surface-base)]',
        tone === 'subtle' && 'bg-[var(--surface-subtle)]',
        tone === 'muted' && 'bg-[var(--surface-muted)]',
      )}
    >
      {children}
    </div>
  )
}

/**
 * Visual banner break — full-bleed within the page flow, with extra vertical
 * breathing room and a constrained content max-width.
 */
function VisualBannerRow({ children }: { children?: React.ReactNode }) {
  if (!children) return null
  return (
    <div className="bg-[var(--surface-base)] py-12 lg:py-16">
      <div className="mx-auto w-full max-w-[var(--storefront-content-max-width)] px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  )
}

function HomePageLayout({
  promoBar,
  header,
  footer,
  headerProps,
  footerProps,
  trustBanner,
  quickNav,
  hero,
  categories,
  flashSale,
  trending,
  bestSellers,
  visualBanner,
  recommended,
  brands,
  newArrivals,
  newsletter,
  className,
  ...props
}: HomePageLayoutProps) {
  return (
    <StorefrontPageShell
      className={className}
      promoBar={promoBar}
      header={header}
      footer={footer}
      headerProps={headerProps}
      footerProps={footerProps}
      newsletter={newsletter}
      {...props}
    >
      <div className="flex flex-col">
        {/* 1. Trust signals — flush below header, before hero */}
        <Band tone="base">{trustBanner}</Band>

        {/* 2. Hero — full bleed feature */}
        {hero}

        {/* 3. Quick category nav (chips) — clean white */}
        <Band tone="base">{quickNav}</Band>

        {/* 4. Featured categories — subtle band for separation */}
        <Band tone="subtle">{categories}</Band>

        {/* 5. Flash sale — distinct accent surface to draw the eye */}
        <Band tone="muted">{flashSale}</Band>

        {/* 6. Best sellers — back to clean white */}
        <Band tone="base">{bestSellers}</Band>

        {/* 7. Trending searches — compact strip on subtle band */}
        <Band tone="subtle">{trending}</Band>

        {/* 8. Visual banner break — emotional/branding section */}
        <VisualBannerRow>{visualBanner}</VisualBannerRow>

        {/* 9. Recommended — clean white */}
        <Band tone="base">{recommended}</Band>

        {/* 10. Brand showcase — subtle band */}
        <Band tone="subtle">{brands}</Band>

        {/* 11. New arrivals — final clean white surface */}
        <Band tone="base">{newArrivals}</Band>
      </div>
    </StorefrontPageShell>
  )
}

export { HomePageLayout }

// Kept for backward compatibility with root index.ts public API
export interface HomeProductRail {
  title: string
  subtitle?: string
  viewAllHref?: string
}
