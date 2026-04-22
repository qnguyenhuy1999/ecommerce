'use client'

import React from 'react'

import { X, Bookmark, ChevronDown } from 'lucide-react'

import { cn, Button, Badge } from '@ecom/ui'

import { PriceDisplay } from '../PriceDisplay/PriceDisplay'
import { QuantityStepper } from '../QuantityStepper/QuantityStepper'
import { WishlistButton } from '../WishlistButton/WishlistButton'

// ─── Types ───────────────────────────────────────────────────────────────────
export interface CartItemProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string
  title: string
  price: number
  originalPrice?: number
  image: string
  quantity: number
  /** Variant label shown in the dosage/option pill (e.g. "100mg", "250mg") */
  variant?: string
  options?: Record<string, string>
  /** Prescription / OTC status badge shown at top of the card */
  rxStatus?: 'rx-needed' | 'otc' | 'rx-free'
  wishlisted?: boolean
  onUpdateQuantity?: (quantity: number) => void
  onRemove?: () => void
  onWishlist?: (wishlisted: boolean) => void
  /** Called when the user clicks the bookmark / save-for-later button */
  onSave?: () => void
  /** Called when the user clicks the variant pill — open a variant picker, etc. */
  onVariantClick?: () => void
}

// ─── Rx badge config (maps status → label + Badge variant token) ──────────────
const RX_BADGE = {
  'rx-needed': { label: 'RX Needed', variant: 'destructive' },
  otc: { label: 'OTC', variant: 'warning' },
  'rx-free': { label: 'Rx Free', variant: 'success' },
} as const

// ─── Component ────────────────────────────────────────────────────────────────
function CartItem({
  title,
  price,
  originalPrice,
  image,
  quantity,
  variant,
  options,
  rxStatus,
  wishlisted = false,
  onUpdateQuantity,
  onRemove,
  onWishlist,
  onSave,
  onVariantClick,
  className,
  ...props
}: CartItemProps) {
  const rxBadge = rxStatus ? RX_BADGE[rxStatus] : null
  const variantLabel = variant ?? (options ? Object.values(options).join(' / ') : null)

  return (
    <div
      className={cn(
        // Card shell — all values from design tokens
        'relative flex flex-col',
        'gap-[var(--space-3)]',
        'bg-[var(--card-bg)]',
        'rounded-[var(--card-radius)]',
        'shadow-[var(--card-elevation)]',
        'p-[var(--space-4)]',
        // Hover elevation lift
        'transition-shadow duration-[var(--motion-normal)] ease-[var(--motion-ease-out)]',
        'hover:shadow-[var(--card-elevation-hover)]',
        className,
      )}
      {...props}
    >
      {/* ── Row 1: Rx badge + close button ───────────────────────────── */}
      <div className="flex items-center justify-between min-h-[var(--space-5)]">
        {rxBadge ? (
          <Badge variant={rxBadge.variant} size="sm">
            {rxBadge.label}
          </Badge>
        ) : (
          /* Keep the row height even when there's no badge */
          <span aria-hidden="true" />
        )}

        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'h-6 w-6 -mt-[var(--space-0-5)] -mr-[var(--space-1)]',
            'text-[var(--text-tertiary)]',
            'hover:text-[var(--text-primary)] hover:bg-[var(--state-hover)]',
            'transition-colors duration-[var(--motion-fast)]',
          )}
          onClick={onRemove}
          aria-label={`Remove ${title} from cart`}
        >
          <X className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* ── Row 2: image + content ────────────────────────────────────── */}
      <div className="flex gap-[var(--space-3)]">
        {/* Product thumbnail */}
        <div
          className={cn(
            'shrink-0',
            'w-[var(--space-16)] h-[var(--space-16)]',
            'rounded-[var(--radius-md)] overflow-hidden',
            'bg-[var(--surface-muted)]',
            'border border-[var(--border-subtle)]',
          )}
        >
          {image ? (
            <img src={image} alt={title} className="w-full h-full object-cover" loading="lazy" />
          ) : (
            <div className="w-full h-full bg-[var(--surface-elevated)]" aria-hidden="true" />
          )}
        </div>

        {/* Right-side content */}
        <div className="flex flex-col flex-1 min-w-0 gap-[var(--space-1)]">
          {/* Title */}
          <h4
            className={cn(
              'line-clamp-2',
              'text-[var(--text-sm)]',
              'font-[var(--font-weight-semibold)]',
              'text-[var(--text-primary)]',
              'leading-[var(--line-height-snug)]',
            )}
          >
            {title}
          </h4>

          {/* Price */}
          <PriceDisplay price={price} originalPrice={originalPrice} size="sm" />

          {/* Variant / dosage pill — clickable to open picker */}
          {variantLabel && (
            <button
              type="button"
              onClick={onVariantClick}
              className={cn(
                'inline-flex items-center self-start',
                'gap-[var(--space-1)]',
                'mt-[var(--space-1)]',
                'px-[var(--space-2)] py-[var(--space-1)]',
                'rounded-[var(--radius-full)]',
                'border border-[var(--border-subtle)]',
                'bg-[var(--surface-muted)]',
                'text-[length:var(--text-micro)]',
                'font-[var(--font-weight-medium)]',
                'text-[var(--text-secondary)]',
                'hover:bg-[var(--surface-active)] hover:border-[var(--border-default)]',
                'transition-colors duration-[var(--motion-fast)] ease-[var(--motion-ease-default)]',
                'cursor-pointer',
              )}
            >
              {variantLabel}
              <ChevronDown className="w-3 h-3 text-[var(--text-tertiary)] shrink-0" />
            </button>
          )}

          {/* ── Bottom action row: icons + stepper ─────────────── */}
          <div className="flex items-center justify-between mt-[var(--space-2)]">
            {/* Wishlist + Save-for-later */}
            <div className="flex items-center gap-[var(--space-1)]">
              <WishlistButton wishlisted={wishlisted} onToggle={onWishlist} size="sm" />

              <button
                type="button"
                onClick={onSave}
                aria-label="Save for later"
                className={cn(
                  'w-7 h-7 flex items-center justify-center',
                  'rounded-[var(--radius-full)]',
                  'bg-[var(--surface-base)]',
                  'shadow-[var(--elevation-xs)]',
                  'border border-[var(--border-subtle)]',
                  'text-[var(--text-tertiary)]',
                  'hover:text-[var(--text-primary)]',
                  'hover:shadow-[var(--elevation-floating)]',
                  'transition-all duration-[var(--motion-normal)] ease-[var(--motion-ease-default)]',
                  'active:scale-90',
                )}
              >
                <Bookmark className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quantity stepper */}
            <QuantityStepper value={quantity} onChange={onUpdateQuantity ?? (() => {})} size="sm" />
          </div>
        </div>
      </div>
    </div>
  )
}

export { CartItem }
