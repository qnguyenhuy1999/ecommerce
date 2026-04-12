'use client'

import { ShoppingBag, ArrowRight } from 'lucide-react'

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  Button,
  Separator,
  Progress,
  Input,
  ScrollArea,
} from '@ecom/ui'

import { CartItem } from '../../atoms/cart-item'
import { PriceDisplay } from '../../atoms/price-display'

export interface CartDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  items: any[]
  subtotal: number
  freeShippingThreshold?: number
  onCheckout?: () => void
  onUpdateQuantity?: (id: string, quantity: number) => void
  onRemoveItem?: (id: string) => void
}

function CartDrawer({
  open,
  onOpenChange,
  items,
  subtotal,
  freeShippingThreshold = 100,
  onCheckout,
  onUpdateQuantity,
  onRemoveItem,
}: CartDrawerProps) {
  const percentToFreeShipping = Math.min((subtotal / freeShippingThreshold) * 100, 100)
  const remainingForFreeShipping = freeShippingThreshold - subtotal

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0 border-l border-border bg-background sm:rounded-l-[20px] shadow-[var(--elevation-modal)]">
        <SheetHeader className="p-6 border-b text-left">
          <SheetTitle className="text-xl font-semibold flex items-center gap-2 tracking-tight">
            <ShoppingBag className="w-5 h-5" />
            Your Cart ({items.length})
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Shipping Progress Indicator */}
          {items.length > 0 && (
            <div className="px-6 py-4 bg-muted/30 border-b">
              <p className="text-sm font-medium mb-3">
                {percentToFreeShipping >= 100 ? (
                  <span className="text-success flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-success"></span> You've unlocked
                    free shipping!
                  </span>
                ) : (
                  <span>
                    You're{' '}
                    <strong className="text-foreground">
                      ${remainingForFreeShipping.toFixed(2)}
                    </strong>{' '}
                    away from free shipping.
                  </span>
                )}
              </p>
              <Progress
                value={percentToFreeShipping}
                variant={percentToFreeShipping >= 100 ? 'success' : 'brand'}
                className="h-2"
              />
            </div>
          )}

          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mb-6">
                <ShoppingBag className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
              <p className="text-muted-foreground text-sm max-w-[250px] mb-8">
                Looks like you haven't added anything to your cart yet.
              </p>
              <Button
                className="w-full sm:w-auto px-8"
                onClick={() => {
                  onOpenChange(false)
                }}
                variant="outline"
              >
                Continue Shopping
              </Button>
            </div>
          ) : (
            <ScrollArea className="flex-1" orientation="vertical">
              <div className="flex flex-col gap-6 p-6">
                {items.map((item) => (
                  <CartItem
                    key={item.id}
                    {...item}
                    onUpdateQuantity={(qty) => onUpdateQuantity?.(item.id, qty)}
                    onRemove={() => onRemoveItem?.(item.id)}
                  />
                ))}
              </div>
            </ScrollArea>
          )}

          {items.length > 0 && (
            <div className="p-6 border-t bg-background mt-auto space-y-4">
              {/* Promo Code Input */}
              <div className="flex gap-2">
                <Input placeholder="Promo code" className="h-[42px]" />
                <Button variant="outline" className="h-[42px] shrink-0 font-semibold">
                  Apply
                </Button>
              </div>

              <Separator />

              <div className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">
                    {percentToFreeShipping >= 100 ? 'Free' : 'Calculated at checkout'}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold pt-2 border-t mt-2">
                  <span>Total</span>
                  <PriceDisplay price={subtotal} size="lg" />
                </div>
              </div>
              <Button className="w-full btn-brand group mt-2" size="xl" onClick={onCheckout}>
                Checkout
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

export { CartDrawer }
