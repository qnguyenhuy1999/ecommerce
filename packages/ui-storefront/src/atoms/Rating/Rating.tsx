import { Star } from 'lucide-react'

import { cn } from '@ecom/ui'

export interface RatingProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  max?: number
  size?: 'sm' | 'default' | 'lg'
  showCount?: boolean
  count?: number
}

function Rating({
  value,
  max = 5,
  size = 'default',
  showCount = false,
  count,
  className,
  ...props
}: RatingProps) {
  const safeValue = Math.min(Math.max(0, value), max)

  const iconSize = {
    sm: 'w-3 h-3',
    default: 'w-4 h-4',
    lg: 'w-5 h-5',
  }[size]

  return (
    <div className={cn('flex items-center gap-1.5', className)} {...props}>
      <div
        className="flex items-center gap-0.5"
        role="img"
        aria-label={`Rating: ${safeValue} out of ${max} stars`}
      >
        {Array.from({ length: max }).map((_, i) => {
          const isFilled = i < Math.floor(safeValue)
          const isHalf = i === Math.floor(safeValue) && safeValue % 1 >= 0.5

          return (
            <div key={i} className="relative">
              <Star className={cn(iconSize, 'text-muted-foreground/30 fill-muted/30')} />
              {(isFilled || isHalf) && (
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: isHalf ? 'var(--rating-half-width, 50%)' : 'var(--rating-full-width, 100%)' }}
                >
                  <Star
                    className={cn(
                      iconSize,
                      'rating-star fill-current text-[var(--color-rating-star)]',
                    )}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {showCount && count !== undefined && (
        <span className="text-[var(--text-micro)] text-muted-foreground font-medium ml-1 tabular-nums">
          ({count.toLocaleString()})
        </span>
      )}
    </div>
  )
}

export { Rating }
