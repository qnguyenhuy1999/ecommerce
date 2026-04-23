import React from 'react'

import { StorefrontFooter } from '../StorefrontFooter/StorefrontFooter'
import { StorefrontHeader } from '../StorefrontHeader/StorefrontHeader'
import { StorefrontShell } from '../StorefrontShell/StorefrontShell'

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
  recommended?: React.ReactNode
  brands?: React.ReactNode
  newArrivals?: React.ReactNode
  newsletter?: React.ReactNode
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
  recommended,
  brands,
  newArrivals,
  newsletter,
  className,
  ...props
}: HomePageLayoutProps) {
  return (
    <StorefrontShell
      className={className}
      header={
        header ?? (
          <div>
            {promoBar}
            <StorefrontHeader {...headerProps} />
          </div>
        )
      }
      footer={footer ?? <StorefrontFooter newsletter={newsletter} {...footerProps} />}
      {...props}
    >
      <div className="flex flex-col pb-12">
        {trustBanner}
        {quickNav}
        {hero}
        {categories}
        {flashSale}
        {trending}
        {bestSellers}
        {recommended}
        {brands}
        {newArrivals}
      </div>
    </StorefrontShell>
  )
}

export { HomePageLayout }

// Kept for backward compatibility with root index.ts public API
export interface HomeProductRail {
  title: string
  subtitle?: string
  viewAllHref?: string
}
