'use client'

import React from 'react'

import { Bookmark } from 'lucide-react'

import { Button, cn } from '@ecom/ui'

import { AddToCartButton } from '../../atoms/AddToCartButton/AddToCartButton'
import { PriceDisplay } from '../../atoms/PriceDisplay/PriceDisplay'
import { Rating } from '../../atoms/Rating/Rating'
import { StockBadge } from '../../atoms/StockBadge/StockBadge'
import type { TrustBadgeType } from '../../atoms/TrustBadge/TrustBadge'
import { TrustBadgeGroup } from '../../atoms/TrustBadge/TrustBadge'
import { ShippingProgressBar } from '../ShippingProgressBar/ShippingProgressBar'
import type { VariantSelectorProps } from '../VariantSelector/VariantSelector'
import { VariantSelector } from '../VariantSelector/VariantSelector'

// ─── Types ───────────────────────────────────────────────────────────────────
export interface ProductVariantGroup extends Pick<
  VariantSelectorProps,
  'name' | 'options' | 'value' | 'type' | 'error'
> {
  onChange?: (value: string) => void
}

export interface ShippingProgressConfig {
  current: number
  threshold: number
}

export interface ProductPurchaseSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Product brand name */
  brand?: string
  /** Product title */
  title: string
  /** Product subtitle / short description */
  subtitle?: string
  /** Current price */
  price: number
  /** Original price (for sale display) */
  originalPrice?: number
  /** Rating value (0-5) */
  rating?: number
  /** Number of reviews */
  reviewCount?: number
  /** Stock status */
  status?: React.ComponentProps<typeof StockBadge>['status']
  /** Stock count for low-stock */
  statusCount?: number
  /** Trust badge types to display */
  trustBadges?: TrustBadgeType[]
  /** Variant groups */
  variants?: ProductVariantGroup[]
  /** Shipping progress configuration */
  shippingProgress?: ShippingProgressConfig
  /** Callback when add to cart is clicked */
  onAddToCart?: (id: string) => void
  /** Callback when review count is clicked */
  onReviewsClick?: () => void
  /** CTA microcopy (e.g., "Ships today") */
  ctaMicrocopy?: string
  /** Custom actions slot (replaces default CTA) */
  actions?: React.ReactNode
  /** Additional content below CTA */
  purchaseSupport?: React.ReactNode
}

function ProductPurchaseSection({
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
  onAddToCart,
  onReviewsClick,
  ctaMicrocopy,
  actions,
  purchaseSupport,
  className,
  ...props
}: ProductPurchaseSectionProps) {
  return (
    <div
      className={cn(
        'rounded-[var(--radius-xl)] border border-border/70',
        'bg-[var(--surface-elevated)]/95 backdrop-blur-[10px]',
        'p-6 shadow-[var(--elevation-dropdown)]',
        'space-y-5',
        className,
      )}
      {...props}
    >
      {/* 1. Brand + Title */}
      <div className="space-y-2">
        {brand && (
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand/80">{brand}</p>
        )}
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-[2rem]">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">{subtitle}</p>
        )}
      </div>

      {/* 2. Price Section — Dominant */}
      <PriceDisplay price={price} originalPrice={originalPrice} size="lg" />

      {/* 3. Rating + Review Count */}
      {typeof rating === 'number' && (
        <div className="flex items-center gap-3">
          <Rating value={rating} count={reviewCount} showCount size="default" />
          {typeof reviewCount === 'number' && reviewCount > 0 && onReviewsClick && (
            <button
              type="button"
              onClick={onReviewsClick}
              className="text-xs font-medium text-brand hover:text-brand/80 underline underline-offset-2 transition-colors"
            >
              Read reviews
            </button>
          )}
        </div>
      )}

      {/* 4. Stock / Urgency */}
      {status && (
        <div className="flex items-center gap-2">
          <StockBadge status={status} count={statusCount} />
          {status === 'in-stock' && (
            <span className="text-xs text-muted-foreground">
              Usually ships in 1-2 business days
            </span>
          )}
        </div>
      )}

      {/* 5. Trust Signals */}
      {trustBadges.length > 0 && (
        <div className="rounded-[var(--radius-lg)] border border-border/50 bg-background/60 p-3.5">
          <TrustBadgeGroup types={trustBadges} size="sm" />
        </div>
      )}

      {/* 6. Variant Selectors */}
      {variants.length > 0 && (
        <div className="space-y-4 pt-1">
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

      {/* 7. Shipping Progress */}
      {shippingProgress && (
        <ShippingProgressBar
          current={shippingProgress.current}
          threshold={shippingProgress.threshold}
        />
      )}

      {/* 8. CTA — Add to Cart (CRITICAL) */}
      {actions ?? (
        <div className="space-y-3 pt-1">
          <AddToCartButton
            size="lg"
            className="w-full h-13 text-base font-semibold"
            label={ctaMicrocopy ? `Add to Cart • ${ctaMicrocopy}` : 'Add to Cart'}
            onAddToCart={() => {
              onAddToCart?.('')
            }}
          />
          <Button variant="outline" size="lg" className="w-full h-11 gap-2 text-sm font-medium">
            <Bookmark className="w-4 h-4" />
            Save for later
          </Button>
        </div>
      )}

      {/* Additional purchase support content */}
      {purchaseSupport && (
        <div className="rounded-[var(--radius-lg)] border border-border/50 bg-background/60 p-4 text-sm text-muted-foreground">
          {purchaseSupport}
        </div>
      )}
    </div>
  )
}

export { ProductPurchaseSection }
