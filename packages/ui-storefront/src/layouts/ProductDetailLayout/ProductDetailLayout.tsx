import React from 'react'

import { Button, cn } from '@ecom/ui'

import { AddToCartButton } from '../../atoms/AddToCartButton/AddToCartButton'
import { PriceDisplay } from '../../atoms/PriceDisplay/PriceDisplay'
import { Rating } from '../../atoms/Rating/Rating'
import { StockBadge } from '../../atoms/StockBadge/StockBadge'
import { TrustBadgeGroup } from '../../atoms/TrustBadge/TrustBadge'
import type { TrustBadgeType } from '../../atoms/TrustBadge/TrustBadge'
import { VariantSelector } from '../../molecules/VariantSelector/VariantSelector'
import type { VariantSelectorProps } from '../../molecules/VariantSelector/VariantSelector'
import { ShippingProgressBar } from '../../molecules/ShippingProgressBar/ShippingProgressBar'
import type { ReviewCardProps } from '../../molecules/ReviewCard/ReviewCard'
import { ReviewCard } from '../../molecules/ReviewCard/ReviewCard'
import type { Product } from '../../organisms/ProductGrid/ProductGrid'
import { ProductCarousel } from '../../organisms/ProductCarousel/ProductCarousel'
import { ProductGallery } from '../../organisms/ProductGallery/ProductGallery'
import { NewsletterSignup } from '../../organisms/NewsletterSignup/NewsletterSignup'
import { StorefrontFooter } from '../StorefrontFooter/StorefrontFooter'
import { StorefrontHeader } from '../StorefrontHeader/StorefrontHeader'
import { StorefrontShell } from '../StorefrontShell/StorefrontShell'
import { StorefrontSection } from '../shared/StorefrontSection'

interface ProductVariantGroup extends Pick<VariantSelectorProps, 'name' | 'options' | 'value' | 'type' | 'error'> {
  onChange?: (value: string) => void
}

interface ShippingProgressConfig {
  current: number
  threshold: number
}

interface RelatedProductsSection {
  title: string
  subtitle?: string
  viewAllHref?: string
  products: Product[]
  onAddToCart?: (id: string) => void
}

export interface ProductDetailLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  promoBar?: React.ReactNode
  header?: React.ReactNode
  footer?: React.ReactNode
  headerProps?: React.ComponentProps<typeof StorefrontHeader>
  footerProps?: React.ComponentProps<typeof StorefrontFooter>
  breadcrumb?: React.ReactNode
  brand?: string
  title: string
  subtitle?: string
  price: number
  originalPrice?: number
  rating?: number
  reviewCount?: number
  status?: React.ComponentProps<typeof StockBadge>['status']
  statusCount?: number
  galleryImages: React.ComponentProps<typeof ProductGallery>['images']
  shippingProgress?: ShippingProgressConfig
  trustBadges?: TrustBadgeType[]
  variants?: ProductVariantGroup[]
  highlights?: string[]
  description?: React.ReactNode
  actions?: React.ReactNode
  reviews?: ReviewCardProps[]
  relatedProducts?: RelatedProductsSection
  newsletter?: React.ReactNode
  onAddToCart?: (id: string) => void
}

function ProductDetailLayout({
  promoBar,
  header,
  footer,
  headerProps,
  footerProps,
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
  galleryImages,
  shippingProgress,
  trustBadges = [],
  variants = [],
  highlights = [],
  description,
  actions,
  reviews = [],
  relatedProducts,
  newsletter,
  onAddToCart,
  className,
  ...props
}: ProductDetailLayoutProps) {
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
      <StorefrontSection>
        {breadcrumb && <div className="mb-6 text-sm text-muted-foreground">{breadcrumb}</div>}

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(22rem,0.85fr)]">
          <ProductGallery images={galleryImages}>
            <ProductGallery.Thumbnails />
            <ProductGallery.Main />
          </ProductGallery>

          <div className="space-y-6">
            <div className="space-y-4">
              {brand && (
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand/80">
                  {brand}
                </p>
              )}
              <div className="space-y-3">
                <h1 className="text-4xl font-bold tracking-tight text-foreground">{title}</h1>
                {subtitle && (
                  <p className="text-base leading-relaxed text-muted-foreground">{subtitle}</p>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <PriceDisplay price={price} originalPrice={originalPrice} size="lg" />
                {typeof rating === 'number' && (
                  <Rating value={rating} count={reviewCount} showCount size="default" />
                )}
                {status && <StockBadge status={status} count={statusCount} />}
              </div>
              {trustBadges.length > 0 && <TrustBadgeGroup types={trustBadges} />}
            </div>

            {shippingProgress && (
              <ShippingProgressBar
                current={shippingProgress.current}
                threshold={shippingProgress.threshold}
              />
            )}

            {variants.length > 0 && (
              <div className="space-y-5 rounded-[var(--radius-xl)] border border-border/70 bg-card p-5 shadow-[var(--elevation-card)]">
                {variants.map((variant) => (
                  <VariantSelector
                    key={variant.name}
                    name={variant.name}
                    options={variant.options}
                    value={variant.value}
                    type={variant.type}
                    error={variant.error}
                    onChange={variant.onChange}
                  />
                ))}
              </div>
            )}

            {actions ?? (
              <div className="flex flex-col gap-3 sm:flex-row">
                <AddToCartButton size="lg" className="flex-1" />
                <Button variant="outline" size="lg" className="sm:w-auto">
                  Save for later
                </Button>
              </div>
            )}

            {(highlights.length > 0 || description) && (
              <div className="rounded-[var(--radius-xl)] border border-border/70 bg-card p-5 shadow-[var(--elevation-card)]">
                {highlights.length > 0 && (
                  <ul className="space-y-2 text-sm text-foreground/85">
                    {highlights.map((highlight) => (
                      <li key={highlight} className="flex gap-2">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {description && (
                  <div className={cn('text-sm leading-relaxed text-muted-foreground', highlights.length > 0 && 'mt-5 border-t border-border/60 pt-5')}>
                    {description}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </StorefrontSection>

      {reviews.length > 0 && (
        <StorefrontSection
          eyebrow="Reviews"
          title="Customer feedback"
          description="Review cards, rating, and trust details can be assembled into a full product narrative."
        >
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {reviews.map((review, index) => (
              <ReviewCard key={`${review.author}-${index}`} {...review} />
            ))}
          </div>
        </StorefrontSection>
      )}

      {relatedProducts && (
        <StorefrontSection title={relatedProducts.title} description={relatedProducts.subtitle} contentClassName="max-w-none">
          <ProductCarousel
            title={relatedProducts.title}
            subtitle={relatedProducts.subtitle}
            viewAllHref={relatedProducts.viewAllHref}
            products={relatedProducts.products}
            onAddToCart={relatedProducts.onAddToCart ?? onAddToCart}
          />
        </StorefrontSection>
      )}

      {newsletter && footer && (
        <StorefrontSection>
          {newsletter ?? <NewsletterSignup />}
        </StorefrontSection>
      )}
    </StorefrontShell>
  )
}

export { ProductDetailLayout }
export type { ProductVariantGroup, ShippingProgressConfig, RelatedProductsSection }
