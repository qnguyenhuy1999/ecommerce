import { Progress } from '@ecom/core-ui/atoms/Progress'
import { Typography } from '@ecom/core-ui/atoms/Typography'
import { Card } from '@ecom/core-ui/molecules/Card'
import { Star } from 'lucide-react'
import { PromotionalBadge } from '../../atoms/PromotionalBadge'
import type { ProductCardProps } from './ProductCard.types'

export function ProductCard({ product, compact = false }: ProductCardProps) {
  return (
    <Card className="min-w-48 gap-0 py-0">
      <div className="relative aspect-square overflow-hidden">
        <img className="size-full object-cover" src={product.imageUrl} alt="" aria-hidden="true" />
        {product.discount && (
          <div className="absolute top-2 left-2">
            <PromotionalBadge label={product.discount} />
          </div>
        )}
        {product.flash && (
          <div className="absolute top-2 right-2">
            <PromotionalBadge kind="flash" label="FLASH" />
          </div>
        )}
        {product.stockLabel && (
          <div className="bg-foreground/70 text-background absolute inset-x-0 bottom-0 px-3 py-2">
            <div className="flex justify-between">
              <Typography variant="caption" className="font-medium">
                {product.stockLabel}
              </Typography>
              {product.sold && <Typography variant="caption">{product.sold}</Typography>}
            </div>
          </div>
        )}
      </div>
      <div className={compact ? 'space-y-2 p-3' : 'space-y-3 p-4'}>
        {!compact && (
          <Typography variant="body-sm" className="text-foreground line-clamp-2 font-medium">
            {product.name}
          </Typography>
        )}
        <div className="flex items-baseline gap-2">
          <Typography variant="label" className="text-primary font-semibold">
            {product.price}
          </Typography>
          {product.originalPrice && (
            <Typography variant="caption" className="text-muted-foreground line-through">
              {product.originalPrice}
            </Typography>
          )}
        </div>
        {typeof product.soldPercent === 'number' && (
          <Progress value={product.soldPercent} className="bg-primary-soft h-2" />
        )}
        {!compact && (
          <>
            <div className="flex flex-wrap gap-1">
              {product.mall && <PromotionalBadge kind="mall" label="MALL" />}
              {product.freeShipping && <PromotionalBadge kind="shipping" label="FREE SHIP" />}
            </div>
            {product.rating && (
              <div className="text-warning flex items-center gap-1">
                <Star className="size-4 fill-current" />
                <Typography variant="caption" className="text-foreground">
                  {product.rating}
                  {product.sold && <span className="text-muted-foreground"> | {product.sold}</span>}
                </Typography>
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  )
}
