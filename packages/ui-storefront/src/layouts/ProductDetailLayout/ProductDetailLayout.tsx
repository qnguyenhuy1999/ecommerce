'use client'

import React, { useCallback, useRef } from 'react'

import { cn } from '@ecom/ui'

import type { TrustBadgeType } from '../../atoms/TrustBadge/TrustBadge'
import { ProductHighlights } from '../../molecules/ProductHighlights/ProductHighlights'
import type {
  ProductVariantGroup,
  ShippingProgressConfig,
} from '../../molecules/ProductPurchaseSection/ProductPurchaseSection'
import { ProductPurchaseSection } from '../../molecules/ProductPurchaseSection/ProductPurchaseSection'
import { ProductReviewsSection } from '../../molecules/ProductReviewsSection/ProductReviewsSection'
import { ProductStickyBar } from '../../molecules/ProductStickyBar/ProductStickyBar'
import type { ReviewCardProps } from '../../molecules/ReviewCard/ReviewCard'
import { StorefrontPageShell } from '../shared/StorefrontPageShell'
import { StorefrontSection } from '../shared/StorefrontSection'
import type { StorefrontFooter } from '../StorefrontFooter/StorefrontFooter'
import type { StorefrontHeader } from '../StorefrontHeader/StorefrontHeader'

// ─── Props ───────────────────────────────────────────────────────────────────
export interface ProductDetailLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  // Shell
  promoBar?: React.ReactNode
  header?: React.ReactNode
  footer?: React.ReactNode
  headerProps?: React.ComponentProps<typeof StorefrontHeader>
  footerProps?: React.ComponentProps<typeof StorefrontFooter>
  newsletter?: React.ReactNode

  // Breadcrumb
  breadcrumb?: React.ReactNode

  // Product info
  brand?: string
  title: string
  subtitle?: string
  price: number
  originalPrice?: number
  rating?: number
  reviewCount?: number
  status?: React.ComponentProps<
    typeof import('../../atoms/StockBadge/StockBadge').StockBadge
  >['status']
  statusCount?: number

  // Gallery
  gallery?: React.ReactNode

  // Purchase section customization
  trustBadges?: TrustBadgeType[]
  variants?: ProductVariantGroup[]
  shippingProgress?: ShippingProgressConfig
  ctaMicrocopy?: string
  actions?: React.ReactNode
  purchaseSupport?: React.ReactNode

  // Product details
  highlights?: string[]
  description?: React.ReactNode

  // Custom detail section override
  details?: React.ReactNode
  purchaseAside?: React.ReactNode

  // Reviews
  reviews?: ReviewCardProps[]
  reviewSummary?: React.ReactNode

  // Related products
  related?: React.ReactNode

  // Callbacks
  onAddToCart?: (id: string) => void

  // Mobile sticky bar
  showStickyBar?: boolean
}

// ─── Layout ──────────────────────────────────────────────────────────────────
function ProductDetailLayout({
  promoBar,
  header,
  footer,
  headerProps,
  footerProps,
  newsletter,
  breadcrumb,
  brand,
  title,
  subtitle,
  price,
  originalPrice,
  rating,
  reviewCount,
  status,
  statusCount,
  gallery,
  trustBadges = [],
  variants = [],
  shippingProgress,
  ctaMicrocopy,
  actions,
  purchaseSupport,
  highlights = [],
  description,
  details,
  purchaseAside,
  reviews = [],
  reviewSummary: _reviewSummary,
  related,
  onAddToCart,
  showStickyBar = true,
  className,
  ...props
}: ProductDetailLayoutProps) {
  const reviewsRef = useRef<HTMLDivElement>(null)

  const scrollToReviews = useCallback(() => {
    reviewsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  return (
    <StorefrontPageShell
      className={cn(showStickyBar && 'pb-20 lg:pb-0', className)}
      promoBar={promoBar}
      header={header}
      footer={footer}
      headerProps={headerProps}
      footerProps={footerProps}
      newsletter={newsletter}
      {...props}
    >
      {/* ─── Main Product Section ─────────────────────────────────────── */}
      <StorefrontSection spacing="compact">
        {/* Breadcrumb */}
        {breadcrumb && <div className="mb-6 text-sm text-muted-foreground">{breadcrumb}</div>}

        {/* Main Grid: Gallery | Purchase */}
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:gap-10 xl:gap-12">
          {/* Left: Product Gallery */}
          <div className="min-w-0">{gallery}</div>

          {/* Right: Purchase Section */}
          <div className="space-y-6 lg:sticky lg:top-[calc(var(--storefront-header-total)+var(--space-6))] lg:self-start">
            {details ?? (
              <>
                <ProductPurchaseSection
                  brand={brand}
                  title={title}
                  subtitle={subtitle}
                  price={price}
                  originalPrice={originalPrice}
                  rating={rating}
                  reviewCount={reviewCount}
                  status={status}
                  statusCount={statusCount}
                  trustBadges={trustBadges}
                  variants={variants}
                  shippingProgress={shippingProgress}
                  ctaMicrocopy={ctaMicrocopy}
                  actions={actions}
                  purchaseSupport={purchaseSupport}
                  onAddToCart={onAddToCart}
                  onReviewsClick={reviews.length > 0 ? scrollToReviews : undefined}
                />

                {/* Product Highlights / Description */}
                <ProductHighlights highlights={highlights} description={description} />

                {purchaseAside}
              </>
            )}
          </div>
        </div>
      </StorefrontSection>

      {/* ─── Reviews Section ──────────────────────────────────────────── */}
      {reviews.length > 0 && (
        <StorefrontSection
          ref={reviewsRef}
          eyebrow="Reviews"
          title="Customer feedback"
          description={`See what ${reviews.length.toLocaleString()} customers are saying`}
        >
          <ProductReviewsSection reviews={reviews} />
        </StorefrontSection>
      )}

      {/* ─── Related Products ─────────────────────────────────────────── */}
      {related && <StorefrontSection contentClassName="max-w-none">{related}</StorefrontSection>}

      {/* ─── Mobile Sticky Bar ────────────────────────────────────────── */}
      {showStickyBar && (
        <ProductStickyBar
          price={price}
          originalPrice={originalPrice}
          onAddToCart={() => onAddToCart?.('')}
          ctaLabel={ctaMicrocopy ? `Add to Cart • ${ctaMicrocopy}` : 'Add to Cart'}
        />
      )}
    </StorefrontPageShell>
  )
}

export { ProductDetailLayout }
export type { ProductVariantGroup, ShippingProgressConfig }

export interface RelatedProductsSection {
  title: string
  subtitle?: string
  viewAllHref?: string
}
