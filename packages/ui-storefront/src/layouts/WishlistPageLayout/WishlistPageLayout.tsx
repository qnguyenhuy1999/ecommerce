import React from 'react'

import { Heart, Share2, ShoppingCart } from 'lucide-react'

import { Button, EmptyState, cn } from '@ecom/ui'

import { SortDropdown } from '../../atoms/SortDropdown/SortDropdown'
import type { SortOption } from '../../atoms/SortDropdown/SortDropdown'
import { AccountSidebar } from '../../molecules/AccountSidebar/AccountSidebar'
import type { AccountSidebarProps } from '../../molecules/AccountSidebar/AccountSidebar'
import { WishlistCard } from '../../molecules/WishlistCard/WishlistCard'
import type { WishlistCardProps } from '../../molecules/WishlistCard/WishlistCard'
import { StorefrontFooter } from '../StorefrontFooter/StorefrontFooter'
import { StorefrontHeader } from '../StorefrontHeader/StorefrontHeader'
import { StorefrontShell } from '../StorefrontShell/StorefrontShell'

export interface WishlistPageLayoutProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  promoBar?: React.ReactNode
  header?: React.ReactNode
  footer?: React.ReactNode
  headerProps?: React.ComponentProps<typeof StorefrontHeader>
  footerProps?: React.ComponentProps<typeof StorefrontFooter>
  /**
   * Optional account sidebar props. When provided, the wishlist renders inside
   * the dashboard chrome with the left-rail navigation. When omitted, the
   * layout falls back to the standalone storefront page (back-compat).
   */
  sidebarProps?: AccountSidebarProps
  items: WishlistCardProps[]
  sortValue?: string
  sortOptions?: SortOption[]
  onSortChange?: (value: string) => void
  onMoveAllToCart?: () => void
  onShareWishlist?: () => void
  /** Custom empty state. Falls back to a heart-themed EmptyState with an Explore CTA. */
  emptyState?: React.ReactNode
  onExploreProducts?: () => void
  newsletter?: React.ReactNode
}

const DEFAULT_SORT_OPTIONS: SortOption[] = [
  { value: 'added_desc', label: 'Recently added' },
  { value: 'price_asc', label: 'Price: low to high' },
  { value: 'price_desc', label: 'Price: high to low' },
  { value: 'name_asc', label: 'Name: A–Z' },
]

/**
 * Wishlist Dashboard — composes AccountSidebar + a wishlist content surface.
 * Cards reuse the upgraded WishlistCard with hover image swap, quick-add reveal,
 * heart→remove transform, and out-of-stock desaturation. The sidebar is optional
 * so existing consumers that don't pass `sidebarProps` keep the standalone page.
 */
function WishlistPageLayout({
  promoBar,
  header,
  footer,
  headerProps,
  footerProps,
  sidebarProps,
  items,
  sortValue = 'added_desc',
  sortOptions = DEFAULT_SORT_OPTIONS,
  onSortChange,
  onMoveAllToCart,
  onShareWishlist,
  emptyState,
  onExploreProducts,
  newsletter,
  className,
  ...props
}: WishlistPageLayoutProps) {
  const isEmpty = items.length === 0
  const inStockCount = items.filter((it) => it.product.inStock).length

  const headerControls = (
    <div className="flex flex-wrap items-center gap-[var(--space-2)]">
      {!isEmpty && onShareWishlist && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onShareWishlist}
          className="h-9 gap-[var(--space-1-5)] text-[length:var(--text-sm)]"
        >
          <Share2 className="h-4 w-4" aria-hidden="true" />
          Share
        </Button>
      )}
      {!isEmpty && onSortChange && (
        <SortDropdown
          value={sortValue}
          options={sortOptions}
          onChange={onSortChange}
          id="wishlist-sort"
        />
      )}
      {!isEmpty && onMoveAllToCart && inStockCount > 0 && (
        <Button
          variant="outline"
          size="sm"
          onClick={onMoveAllToCart}
          className="h-9 gap-[var(--space-1-5)] text-[length:var(--text-sm)]"
        >
          <ShoppingCart className="h-4 w-4" aria-hidden="true" />
          Move all to cart
        </Button>
      )}
    </div>
  )

  const wishlistBody = (
    <div className="flex flex-col gap-[var(--space-6)]">
      <header className="flex flex-wrap items-end justify-between gap-[var(--space-4)]">
        <div className="flex flex-col gap-[var(--space-1)]">
          <p className="text-[length:var(--text-xs)] font-semibold uppercase tracking-[0.14em] text-[var(--text-tertiary)]">
            My account
          </p>
          <h1
            className={cn(
              'text-[length:var(--font-size-heading-lg)] font-bold tracking-[-0.015em]',
              'leading-[var(--line-height-tight)] text-[var(--text-primary)]',
            )}
          >
            My wishlist{' '}
            {!isEmpty && (
              <span className="text-[var(--text-tertiary)] font-semibold">({items.length})</span>
            )}
          </h1>
          {!isEmpty && inStockCount < items.length && (
            <p className="text-[length:var(--text-sm)] text-[var(--text-secondary)]">
              {inStockCount} of {items.length} available now
            </p>
          )}
        </div>
        {headerControls}
      </header>

      {isEmpty ? (
        emptyState ?? (
          <div
            className={cn(
              'rounded-[var(--radius-2xl)] border border-dashed border-[var(--border-subtle)]',
              'bg-[var(--surface-subtle)]',
              'px-[var(--space-6)] py-[var(--space-12)]',
            )}
          >
            <EmptyState
              icon={
                <Heart
                  className="h-10 w-10 text-[var(--text-tertiary)]"
                  aria-hidden="true"
                />
              }
              title="Your wishlist is empty"
              description="Save items you love by tapping the heart on any product. We'll keep them here so you can come back, compare prices, or move them to your cart in one tap."
              action={
                onExploreProducts
                  ? {
                      label: 'Explore products',
                      onClick: onExploreProducts,
                      variant: 'default',
                    }
                  : undefined
              }
            />
          </div>
        )
      ) : (
        <div
          className={cn(
            'grid gap-[var(--space-5)]',
            'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
          )}
        >
          {items.map((item, i) => (
            <WishlistCard key={item.product.id ?? i} {...item} />
          ))}
        </div>
      )}
    </div>
  )

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
      <div
        className={cn(
          'mx-auto w-full max-w-[var(--storefront-content-max-width)]',
          'px-[var(--space-4)] sm:px-[var(--space-6)] lg:px-[var(--space-8)]',
          'py-[var(--space-8)] lg:py-[var(--space-12)]',
        )}
      >
        {sidebarProps ? (
          <div className="grid gap-[var(--space-8)] lg:grid-cols-[16rem_minmax(0,1fr)] lg:items-start">
            <div className="lg:sticky lg:top-28">
              <AccountSidebar {...sidebarProps} />
            </div>
            <div className="min-w-0">{wishlistBody}</div>
          </div>
        ) : (
          wishlistBody
        )}
      </div>
    </StorefrontShell>
  )
}

export { WishlistPageLayout }
