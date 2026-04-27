import { cn } from '@ecom/ui/utils'

import { WishlistCard } from '../../../molecules/WishlistCard/WishlistCard'
import type { WishlistCardProps } from '../../../molecules/WishlistCard/WishlistCard'

export interface WishlistGridProps {
  items: WishlistCardProps[]
}

export function WishlistGrid({ items }: WishlistGridProps) {
  return (
    <div className={cn('grid gap-5', 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4')}>
      {items.map((item, i) => (
        <WishlistCard key={item.product.id ?? i} {...item} />
      ))}
    </div>
  )
}
