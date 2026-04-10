import {
  Button,
  Separator,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  cn,
} from '@ecom/ui'
import { ShoppingBag, ArrowRight } from 'lucide-react'
import { CartItem } from '../../atoms/cart-item'
import type { CartDrawerProps, CartItemData } from './types'

const formatPrice = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)

function CartDrawer({
  open,
  onClose,
  items,
  total,
  onCheckout,
  onRemoveItem,
  onUpdateQuantity,
  loading,
  className,
}: CartDrawerProps) {
  return (
    <Sheet
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose()
      }}
    >
      <SheetContent className={cn('flex flex-col', className)}>
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Shopping Cart
            {items.length > 0 && (
              <span className="text-sm font-normal text-muted-foreground">
                ({items.length} {items.length === 1 ? 'item' : 'items'})
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {/* Empty state */}
        {items.length === 0 && !loading && (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            <div>
              <p className="font-medium">Your cart is empty</p>
              <p className="text-sm text-muted-foreground mt-1">Add items to get started.</p>
            </div>
            <Button variant="outline" onClick={onClose}>
              Continue Shopping
            </Button>
          </div>
        )}

        {/* Items list */}
        {items.length > 0 && (
          <>
            <div className="flex-1 overflow-y-auto py-4">
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onQuantityChange={(qty) => onUpdateQuantity?.(item.id, qty)}
                  onRemove={() => onRemoveItem?.(item.id)}
                />
              ))}
            </div>

            <Separator />

            {/* Totals + checkout */}
            <SheetFooter className="flex-col gap-3 pt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Subtotal</span>
                <span className="font-semibold text-base">{formatPrice(total)}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Shipping and taxes calculated at checkout.
              </p>
              <Button variant="default" className="w-full gap-2" onClick={onCheckout}>
                Checkout
                <ArrowRight className="h-4 w-4" />
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}

export { CartDrawer }
export type { CartDrawerProps, CartItemData }
