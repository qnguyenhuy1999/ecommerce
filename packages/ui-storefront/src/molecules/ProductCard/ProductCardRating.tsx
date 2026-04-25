import { cn } from '@ecom/ui'

import { Rating } from '../../atoms/Rating/Rating'

interface ProductCardRatingProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  count?: number
}

export function ProductCardRating({ value, count, className, ...props }: ProductCardRatingProps) {
  return (
    <Rating
      value={value}
      size="sm"
      showCount
      count={count}
      className={cn(className)}
      {...props}
    />
  )
}
