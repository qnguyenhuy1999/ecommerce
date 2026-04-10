import * as React from 'react'
import { Button, cn } from '@ecom/ui'
import { Minus, Plus, Trash2 } from 'lucide-react'
import type { CartItemProps } from './types'

const formatPrice = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)

const CartItem = React.forwardRef<HTMLDivElement, CartItemProps>(
  ({ item, onQuantityChange, onRemove, className }, ref) => {
    return (
      <div ref={ref} className={cn('flex items-start gap-3 py-4', className)}>
        {/* Image */}
        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-muted">
          {item.image ? (
            <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground text-xs">
              No image
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-1 flex-col gap-1">
          <h4 className="text-sm font-medium leading-tight line-clamp-2">{item.name}</h4>
          <p className="text-sm text-muted-foreground">{formatPrice(item.price)}</p>

          {/* Quantity controls */}
          <div className="flex items-center gap-2 mt-1">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              aria-label="Decrease quantity"
              onClick={() => onQuantityChange?.(Math.max(1, item.quantity - 1))}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-6 text-center text-sm">{item.quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              aria-label="Increase quantity"
              onClick={() => onQuantityChange?.(item.quantity + 1)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Price + Remove */}
        <div className="flex flex-col items-end gap-2">
          <span className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-destructive hover:text-destructive"
            aria-label="Remove item"
            onClick={onRemove}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  },
)
CartItem.displayName = 'CartItem'

export { CartItem }
export type { CartItemProps }
