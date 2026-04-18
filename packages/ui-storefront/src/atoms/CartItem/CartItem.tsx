'use client'

import { Trash2 } from 'lucide-react'

import { cn, Button } from '@ecom/ui'

import { PriceDisplay } from '../PriceDisplay/PriceDisplay'
import { QuantityStepper } from '../QuantityStepper/QuantityStepper'

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
      {/* Product image — token-based radius */}
      <div className="w-[var(--space-12)] h-[var(--space-12)] shrink-0 rounded-[var(--radius-md)] overflow-hidden bg-muted border">
        <img src={image} alt={title} className="w-full h-full object-cover" loading="lazy" />
      </div>

      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <div className="min-w-0 pr-2">
            {/* Title: token-based text size */}
            <h4 className="font-medium text-[var(--text-sm)] text-foreground line-clamp-2 leading-tight">
              {title}
            </h4>
            {(variant || options) && (
              <p className="text-[var(--text-micro)] text-muted-foreground mt-1 line-clamp-1">
                {variant || Object.values(options!).join(' / ')}
              </p>
            )}
          </div>

          {/* Delete button — reveals on group hover */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              'h-7 w-7 -mt-1 -mr-2 text-muted-foreground shrink-0',
              'opacity-0 group-hover:opacity-100',
              // Focus-visible keeps it accessible via keyboard
              'focus:opacity-100',
              // Transition using token duration
              'transition-opacity duration-[var(--motion-fast)]',
              'hover:text-destructive',
            )}
            onClick={onRemove}
            aria-label={`Remove ${title} from cart`}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>

        {/* Bottom row: quantity stepper + price */}
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
