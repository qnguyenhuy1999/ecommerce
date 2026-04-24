import { cn } from '@ecom/ui'

import { Rating } from '../../atoms/Rating/Rating'
import { useProductCard } from './ProductCard'

interface ProductCardRatingProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  count?: number
}

export function ProductCardRating({ value, count, className, ...props }: ProductCardRatingProps) {
  const { view } = useProductCard()

  return (
    <Rating
      value={value}
      size="sm"
      showCount
      count={count}
      className={cn(view === 'list' ? 'mt-0' : 'mt-1.5', className)}
      {...props}
    />
  )
}
