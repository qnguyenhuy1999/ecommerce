import React from 'react'

import { Heart, ShoppingCart } from 'lucide-react'

import { Button, EmptyState, cn } from '@ecom/ui'

import { SortDropdown } from '../../atoms/SortDropdown/SortDropdown'
import type { SortOption } from '../../atoms/SortDropdown/SortDropdown'
import { WishlistCard } from '../../molecules/WishlistCard/WishlistCard'
import type { WishlistCardProps } from '../../molecules/WishlistCard/WishlistCard'
import { StorefrontFooter } from '../StorefrontFooter/StorefrontFooter'
import { StorefrontHeader } from '../StorefrontHeader/StorefrontHeader'
import { StorefrontShell } from '../StorefrontShell/StorefrontShell'
import { StorefrontSection } from '../shared/StorefrontSection'

export interface WishlistPageLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  promoBar?: React.ReactNode
  header?: React.ReactNode
  footer?: React.ReactNode
  headerProps?: React.ComponentProps<typeof StorefrontHeader>
  footerProps?: React.ComponentProps<typeof StorefrontFooter>
  items: WishlistCardProps[]
  sortValue?: string
  sortOptions?: SortOption[]
  onSortChange?: (value: string) => void
  onMoveAllToCart?: () => void
  onShareWishlist?: () => void
  emptyState?: React.ReactNode
  newsletter?: React.ReactNode
}

const DEFAULT_SORT_OPTIONS: SortOption[] = [
  { value: 'added_desc', label: 'Recently Added' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'name_asc', label: 'Name: A–Z' },
]

function WishlistPageLayout({
  promoBar,
  header,
  footer,
  headerProps,
  footerProps,
  items,
  sortValue = 'added_desc',
  sortOptions = DEFAULT_SORT_OPTIONS,
  onSortChange,
  onMoveAllToCart,
  emptyState,
  newsletter,
  className,
  ...props
}: WishlistPageLayoutProps) {
  const isEmpty = items.length === 0

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
      <StorefrontSection
        eyebrow="My Account"
        title="Wishlist"
        action={
          !isEmpty && onMoveAllToCart ? (
            <Button
              onClick={onMoveAllToCart}
              variant="outline"
              className="gap-2 h-9 text-[length:var(--text-sm)]"
            >
              <ShoppingCart className="w-4 h-4" />
              Move All to Cart
            </Button>
          ) : undefined
        }
      >
        {isEmpty ? (
          <div className="py-20">
            {emptyState ?? (
              <EmptyState
                icon={<Heart className="w-10 h-10 text-[var(--text-tertiary)]" />}
                title="Your wishlist is empty"
                description="Save items you love by clicking the heart icon on any product."
                action={{ label: 'Explore Products', onClick: () => {}, variant: 'default' }}
              />
            )}
          </div>
        ) : (
          <div className="space-y-5">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-[var(--text-sm)] text-[var(--text-secondary)]">
                {items.length} {items.length === 1 ? 'item' : 'items'} saved
              </p>
              {onSortChange && (
                <SortDropdown
                  value={sortValue}
                  options={sortOptions}
                  onChange={onSortChange}
                  id="wishlist-sort"
                />
              )}
            </div>

            {/* Grid */}
            <div className={cn('grid gap-5', 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4')}>
              {items.map((item, i) => (
                <WishlistCard key={item.product.id ?? i} {...item} />
              ))}
            </div>
          </div>
        )}
      </StorefrontSection>
    </StorefrontShell>
  )
}

export { WishlistPageLayout }
