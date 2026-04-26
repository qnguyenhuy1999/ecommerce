'use client'

import React from 'react'

import { formatCurrency } from '@ecom/shared/utils/formatters'
import { cn } from '@ecom/ui'

import { AddToCartButton } from '../../atoms/AddToCartButton/AddToCartButton'

export interface ProductStickyBarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Current price */
  price: number
  /** Original price for sale display */
  originalPrice?: number
  /** Currency code */
  currency?: string
  /** Callback when add to cart is clicked */
  onAddToCart?: () => void
  /** CTA label override */
  ctaLabel?: string
  /** Disable the CTA */
  disabled?: boolean
}

function ProductStickyBar({
  price,
  originalPrice,
  currency = 'USD',
  onAddToCart,
  ctaLabel = 'Add to Cart',
  disabled,
  className,
  ...props
}: ProductStickyBarProps) {
  const hasSale = originalPrice !== undefined && originalPrice > price

  return (
    <div
      className={cn(
        // Only show on mobile/tablet
        'fixed bottom-0 inset-x-0 z-40 lg:hidden',
        // Styling
        'border-t border-border/70 bg-background/95 backdrop-blur-lg',
        'px-4 py-3 shadow-[0_-4px_16px_rgb(0_0_0/0.08)]',
        'safe-area-inset-bottom',
        className,
      )}
      {...props}
    >
      <div className="mx-auto flex max-w-[var(--storefront-content-max-width)] items-center gap-4">
        {/* Price */}
        <div className="flex flex-col min-w-0 shrink-0">
          <span className="text-lg font-bold tracking-tight text-foreground">
            {formatCurrency(price, currency)}
          </span>
          {hasSale && (
            <span className="text-xs text-muted-foreground line-through tabular-nums">
              {formatCurrency(originalPrice, currency)}
            </span>
          )}
        </div>

        {/* CTA */}
        <AddToCartButton
          size="lg"
          label={ctaLabel}
          className="flex-1 h-12 text-sm font-semibold"
          onAddToCart={onAddToCart}
          disabled={disabled}
        />
      </div>
    </div>
  )
}

export { ProductStickyBar }
