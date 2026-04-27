import type React from 'react'

import { ProductHighlights } from '../../../molecules/ProductHighlights/ProductHighlights'
import { ProductPurchaseSection } from '../../../molecules/ProductPurchaseSection/ProductPurchaseSection'
import type {
  ProductVariantGroup,
  ShippingProgressConfig,
} from '../../../molecules/ProductPurchaseSection/ProductPurchaseSection'
import { StorefrontSection } from '../../shared/StorefrontSection'

export interface ProductDetailMainSectionProps {
  breadcrumb?: React.ReactNode
  gallery?: React.ReactNode
  details?: React.ReactNode
  purchaseAside?: React.ReactNode
  reviewsCount: number
  onReviewsClick: () => void
  brand?: string
  title: string
  subtitle?: string
  price: number
  originalPrice?: number
  rating?: number
  reviewCount?: number
  status?: React.ComponentProps<
    typeof import('../../../atoms/StockBadge/StockBadge').StockBadge
  >['status']
  statusCount?: number
  trustBadges?: React.ComponentProps<typeof ProductPurchaseSection>['trustBadges']
  variants?: ProductVariantGroup[]
  shippingProgress?: ShippingProgressConfig
  ctaMicrocopy?: string
  actions?: React.ReactNode
  purchaseSupport?: React.ReactNode
  onAddToCart?: (id: string) => void
  highlights?: string[]
  description?: React.ReactNode
}

export function ProductDetailMainSection({
  breadcrumb,
  gallery,
  details,
  purchaseAside,
  reviewsCount,
  onReviewsClick,
  brand,
  title,
  subtitle,
  price,
  originalPrice,
  rating,
  reviewCount,
  status,
  statusCount,
  trustBadges = [],
  variants = [],
  shippingProgress,
  ctaMicrocopy,
  actions,
  purchaseSupport,
  onAddToCart,
  highlights = [],
  description,
}: ProductDetailMainSectionProps) {
  return (
    <StorefrontSection spacing="compact">
      {breadcrumb && <div className="mb-6 text-sm text-muted-foreground">{breadcrumb}</div>}

      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:gap-10 xl:gap-12">
        <div className="min-w-0">{gallery}</div>

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
                onReviewsClick={reviewsCount > 0 ? onReviewsClick : undefined}
              />

              <ProductHighlights highlights={highlights} description={description} />

              {purchaseAside}
            </>
          )}
        </div>
      </div>
    </StorefrontSection>
  )
}
