import React from 'react'

import { Heart, Share2, ShoppingCart } from 'lucide-react'

import { Button, EmptyState, cn } from '@ecom/ui'

import { SortDropdown } from '../../atoms/SortDropdown/SortDropdown'
import type { SortOption } from '../../atoms/SortDropdown/SortDropdown'
import type { AccountSidebarProps } from '../../molecules/AccountSidebar/AccountSidebar'
import { WishlistCard } from '../../molecules/WishlistCard/WishlistCard'
import type { WishlistCardProps } from '../../molecules/WishlistCard/WishlistCard'
import { EmptyStateCard } from '../shared/EmptyStateCard'
import { PageHeader } from '../shared/PageHeader'
import { AccountPageLayout } from '../AccountPageLayout/AccountPageLayout'
import type { StorefrontFooter } from '../StorefrontFooter/StorefrontFooter'
import type { StorefrontHeader } from '../StorefrontHeader/StorefrontHeader'

export interface WishlistPageLayoutProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'title'
> {
  promoBar?: React.ReactNode
  header?: React.ReactNode
  footer?: React.ReactNode
  headerProps?: React.ComponentProps<typeof StorefrontHeader>
  footerProps?: React.ComponentProps<typeof StorefrontFooter>
  sidebarProps: AccountSidebarProps
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

  const headerActions = (
    <>
      {!isEmpty && onShareWishlist && (
        <Button variant="ghost" size="sm" onClick={onShareWishlist} className="h-9 gap-1.5 text-sm">
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
          className="h-9 gap-1.5 text-sm"
        >
          <ShoppingCart className="h-4 w-4" aria-hidden="true" />
          Move all to cart
        </Button>
      )}
    </>
  )

  const wishlistBody = (
    <>
      <PageHeader>
        <PageHeader.Eyebrow>My account</PageHeader.Eyebrow>
        <PageHeader.Title count={isEmpty ? undefined : items.length}>My wishlist</PageHeader.Title>
        {!isEmpty && inStockCount < items.length && (
          <PageHeader.Description>
            {inStockCount} of {items.length} available now
          </PageHeader.Description>
        )}
        <PageHeader.Actions>{headerActions}</PageHeader.Actions>
      </PageHeader>

      {isEmpty ? (
        (emptyState ?? (
          <EmptyStateCard>
            <EmptyState
              icon={<Heart className="h-10 w-10 text-[var(--text-tertiary)]" aria-hidden="true" />}
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
          </EmptyStateCard>
        ))
      ) : (
        <div className={cn('grid gap-5', 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4')}>
          {items.map((item, i) => (
            <WishlistCard key={item.product.id ?? i} {...item} />
          ))}
        </div>
      )}
    </>
  )

  return (
    <AccountPageLayout
      className={className}
      promoBar={promoBar}
      header={header}
      footer={footer}
      headerProps={headerProps}
      footerProps={footerProps}
      newsletter={newsletter}
      sidebarProps={sidebarProps}
      {...props}
    >
      {wishlistBody}
    </AccountPageLayout>
  )
}

export { WishlistPageLayout }
