import React from 'react'

import { StorefrontFooter } from '../StorefrontFooter/StorefrontFooter'
import { StorefrontHeader } from '../StorefrontHeader/StorefrontHeader'
import { StorefrontShell } from '../StorefrontShell/StorefrontShell'
import { StorefrontSection } from '../shared/StorefrontSection'

export interface HomePageLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  promoBar?: React.ReactNode
  header?: React.ReactNode
  footer?: React.ReactNode
  headerProps?: React.ComponentProps<typeof StorefrontHeader>
  footerProps?: React.ComponentProps<typeof StorefrontFooter>
  hero?: React.ReactNode
  categories?: React.ReactNode
  featured?: React.ReactNode
  newsletter?: React.ReactNode
}

function HomePageLayout({
  promoBar,
  header,
  footer,
  headerProps,
  footerProps,
  hero,
  categories,
  featured,
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
      <div className="space-y-2 pb-10">
        {hero}

        {categories && (
          <StorefrontSection>
            {categories}
          </StorefrontSection>
        )}

        {featured}

        {newsletter && (
          <StorefrontSection>{newsletter}</StorefrontSection>
        )}
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
