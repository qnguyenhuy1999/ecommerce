import React from 'react'

import { StorefrontFooter } from '../StorefrontFooter/StorefrontFooter'
import { StorefrontHeader } from '../StorefrontHeader/StorefrontHeader'
import { StorefrontShell } from '../StorefrontShell/StorefrontShell'
import { StorefrontSection } from '../shared/StorefrontSection'
import type { HeroBannerProps } from '../../organisms/HeroBanner/HeroBanner'
import { HeroBanner } from '../../organisms/HeroBanner/HeroBanner'
import { CategoryGrid } from '../../organisms/CategoryGrid/CategoryGrid'
import { ProductCarousel } from '../../organisms/ProductCarousel/ProductCarousel'
import { NewsletterSignup } from '../../organisms/NewsletterSignup/NewsletterSignup'
import type { Product } from '../../organisms/ProductGrid/ProductGrid'

interface HomeProductRail {
  title: string
  subtitle?: string
  viewAllHref?: string
  products: Product[]
  onAddToCart?: (id: string) => void
}

export interface HomePageLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  promoBar?: React.ReactNode
  header?: React.ReactNode
  footer?: React.ReactNode
  headerProps?: React.ComponentProps<typeof StorefrontHeader>
  footerProps?: React.ComponentProps<typeof StorefrontFooter>
  hero: HeroBannerProps
  categories?: React.ComponentProps<typeof CategoryGrid>['categories']
  categorySectionEyebrow?: string
  categorySectionTitle?: string
  categorySectionDescription?: string
  categoryColumns?: React.ComponentProps<typeof CategoryGrid>['columns']
  featuredCollections?: HomeProductRail[]
  newsletter?: React.ReactNode
  onAddToCart?: (id: string) => void
}

function HomePageLayout({
  promoBar,
  header,
  footer,
  headerProps,
  footerProps,
  hero,
  categories = [],
  categorySectionEyebrow = 'Shop by category',
  categorySectionTitle = 'Built around how customers actually browse',
  categorySectionDescription = 'Use the existing category cards and hero to assemble a storefront landing page with minimal custom wiring.',
  categoryColumns = 4,
  featuredCollections = [],
  newsletter,
  onAddToCart,
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
        <HeroBanner {...hero} />

        {categories.length > 0 && (
          <StorefrontSection
            eyebrow={categorySectionEyebrow}
            title={categorySectionTitle}
            description={categorySectionDescription}
          >
            <CategoryGrid categories={categories} columns={categoryColumns} />
          </StorefrontSection>
        )}

        {featuredCollections.map((section) => (
          <ProductCarousel
            key={section.title}
            title={section.title}
            subtitle={section.subtitle}
            viewAllHref={section.viewAllHref}
            products={section.products}
            onAddToCart={section.onAddToCart ?? onAddToCart}
          />
        ))}

        {newsletter && footer && (
          <StorefrontSection>{newsletter ?? <NewsletterSignup />}</StorefrontSection>
        )}
      </div>
    </StorefrontShell>
  )
}

export { HomePageLayout }
export type { HomeProductRail }
