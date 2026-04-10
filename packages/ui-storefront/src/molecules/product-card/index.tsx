import * as React from 'react'
import { cn } from '@ecom/ui'
import { Card, CardContent, CardFooter, Button } from '@ecom/ui'
import { Skeleton } from '@ecom/ui'
import { ShoppingCart } from 'lucide-react'
import type { ProductCardProps } from './types'

const formatPrice = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)

const ProductCard = React.forwardRef<HTMLDivElement, ProductCardProps>(
  ({ id, image, title, price, originalPrice, badge, onAddToCart, loading, className }, ref) => {
    const [imgError, setImgError] = React.useState(false)

    if (loading) {
      return (
        <Card ref={ref} className={cn('overflow-hidden', className)}>
          <Skeleton className="aspect-square w-full" />
          <CardContent className="p-4 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-5 w-1/3" />
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Skeleton className="h-9 w-full" />
          </CardFooter>
        </Card>
      )
    }

    return (
      <Card ref={ref} className={cn('group overflow-hidden', className)}>
        <CardContent className="p-0 relative">
          {/* Image */}
          <div className="aspect-square overflow-hidden bg-muted">
            {imgError ? (
              <div className="flex h-full w-full items-center justify-center text-muted-foreground text-sm">
                No image
              </div>
            ) : (
              <img
                src={image}
                alt={title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={() => setImgError(true)}
              />
            )}
          </div>

          {/* Badge slot */}
          {badge && <div className="absolute top-3 left-3">{badge}</div>}
        </CardContent>

        <CardFooter className="flex flex-col items-start gap-2 p-4">
          <div className="w-full">
            <h3 className="font-medium text-sm leading-snug line-clamp-2">{title}</h3>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-semibold text-base">{formatPrice(price)}</span>
              {originalPrice && originalPrice > price && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(originalPrice)}
                </span>
              )}
            </div>
          </div>

          <Button
            variant="default"
            size="sm"
            className="w-full gap-2"
            onClick={() => onAddToCart?.(id)}
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </Button>
        </CardFooter>
      </Card>
    )
  },
)
ProductCard.displayName = 'ProductCard'

export { ProductCard }
export type { ProductCardProps }
