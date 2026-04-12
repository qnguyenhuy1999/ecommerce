'use client'

import { Trash2 } from 'lucide-react'

import { cn, Button } from '@ecom/ui'

import { PriceDisplay } from '../price-display'
import { QuantityStepper } from '../quantity-stepper'

export interface CartItemProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string
  title: string
  price: number
  originalPrice?: number
  image: string
  quantity: number
  variant?: string
  options?: Record<string, string>
  onUpdateQuantity?: (quantity: number) => void
  onRemove?: () => void
}

function CartItem({
  title,
  price,
  originalPrice,
  image,
  quantity,
  variant,
  options,
  onUpdateQuantity,
  onRemove,
  className,
  ...props
}: CartItemProps) {
  return (
    <div className={cn('flex gap-4 group', className)} {...props}>
      <div className="w-[84px] h-[100px] shrink-0 rounded-[12px] overflow-hidden bg-muted border">
        <img src={image} alt={title} className="w-full h-full object-cover" loading="lazy" />
      </div>

      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <div className="min-w-0 pr-2">
            <h4 className="font-medium text-sm text-foreground line-clamp-2 leading-tight">
              {title}
            </h4>
            {(variant || options) && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                {variant || Object.values(options!).join(' / ')}
              </p>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 -mt-1 -mr-2 text-muted-foreground hover:text-destructive shrink-0 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
            onClick={onRemove}
            aria-label={`Remove ${title} from cart`}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>

        <div className="mt-auto flex items-end justify-between pt-3">
          <QuantityStepper value={quantity} onChange={onUpdateQuantity || (() => {})} size="sm" />
          <PriceDisplay
            price={price * quantity}
            originalPrice={originalPrice ? originalPrice * quantity : undefined}
            size="default"
            className="flex-col items-end gap-0.5"
          />
        </div>
      </div>
    </div>
  )
}

export { CartItem }
