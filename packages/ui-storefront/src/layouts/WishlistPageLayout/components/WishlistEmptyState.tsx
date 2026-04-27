import { Heart } from 'lucide-react'

import { EmptyState } from '@ecom/ui'

import { EmptyStateCard } from '../../shared/EmptyStateCard'

export interface WishlistEmptyStateProps {
  emptyState?: React.ReactNode
  onExploreProducts?: () => void
}

export function WishlistEmptyState({ emptyState, onExploreProducts }: WishlistEmptyStateProps) {
  if (emptyState) return <>{emptyState}</>

  return (
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
  )
}
