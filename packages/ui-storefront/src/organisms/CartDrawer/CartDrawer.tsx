'use client'

import React from 'react'

import { ShoppingBag, ArrowRight, Sparkles } from 'lucide-react'

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
  Badge,
  EmptyState,
} from '@ecom/ui'

import { CartItem } from '../../atoms/CartItem/CartItem'
import { PriceDisplay } from '../../atoms/PriceDisplay/PriceDisplay'

// ─── Types ───────────────────────────────────────────────────────────────────
export interface CartItemData {
  id: string
  title: string
  price: number
  originalPrice?: number
  image: string
  quantity: number
  variant?: string
  options?: Record<string, string>
}

export interface CartDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  items: CartItemData[]
  subtotal: number
  freeShippingThreshold?: number
  onCheckout?: () => void
  onUpdateQuantity?: (id: string, quantity: number) => void
  onRemoveItem?: (id: string) => void
}

// ─── Component ────────────────────────────────────────────────────────────────
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
  const [localItems, setLocalItems] = React.useState(items)
  React.useEffect(() => {
    setLocalItems(items)
  }, [items])

  const percentToFreeShipping = Math.min((subtotal / freeShippingThreshold) * 100, 100)
  const remainingForFreeShipping = freeShippingThreshold - subtotal
  const isFreeShippingUnlocked = percentToFreeShipping >= 100

  function handleUpdateQuantity(id: string, qty: number) {
    setLocalItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: qty } : item)),
    )
    onUpdateQuantity?.(id, qty)
  }

  function handleRemoveItem(id: string) {
    setLocalItems((prev) => prev.filter((item) => item.id !== id))
    onRemoveItem?.(id)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className="w-full sm:max-w-md flex flex-col p-0 border-l border-border bg-background sm:rounded-l-[var(--radius-xl)]
        shadow-[var(--elevation-modal)]"
      >
        {/* Header with item count badge */}
        <SheetHeader className="p-[var(--padding-card)] border-b text-left">
          <SheetTitle className="text-[var(--text-lg)] font-semibold flex items-center gap-2 tracking-tight">
            <ShoppingBag className="w-5 h-5" />
            Your Cart
            {localItems.length > 0 && (
              <Badge variant="sale" className="ml-1 text-[length:var(--text-micro)]">
                {items.length}
              </Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Free shipping progress */}
          {localItems.length > 0 && (
            <div className="px-[var(--padding-card)] py-4 bg-muted/30 border-b">
              <p className="text-[var(--text-sm)] font-medium mb-3 flex items-center gap-2">
                {isFreeShippingUnlocked ? (
                  <span className="text-success flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Free shipping unlocked!
                  </span>
                ) : (
                  <>
                    You're{' '}
                    <strong className="text-foreground font-semibold">
                      ${remainingForFreeShipping.toFixed(2)}
                    </strong>{' '}
                    away from free shipping.
                  </>
                )}
              </p>
              <Progress
                value={percentToFreeShipping}
                variant={isFreeShippingUnlocked ? 'success' : 'brand'}
                className="h-1.5"
              />
            </div>
          )}

          {/* Empty state */}
          {localItems.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-[var(--padding-card)]">
              <EmptyState
                icon={<ShoppingBag />}
                title="Your cart is empty"
                description="Looks like you haven't added anything yet."
                action={{
                  label: 'Continue Shopping',
                  onClick: () => onOpenChange(false),
                  variant: 'outline',
                }}
              />
            </div>
          ) : (
            /* Item list */
            <ScrollArea className="flex-1" orientation="vertical">
              <div className="flex flex-col gap-6 p-[var(--padding-card)]">
                {localItems.map((item) => (
                  <CartItem
                    key={item.id}
                    {...item}
                    onUpdateQuantity={(qty) => handleUpdateQuantity(item.id, qty)}
                    onRemove={() => handleRemoveItem(item.id)}
                  />
                ))}
              </div>
            </ScrollArea>
          )}

          {/* Footer: promo + totals + checkout */}
          {localItems.length > 0 && (
            <div className="p-[var(--padding-card)] border-t bg-background mt-auto space-y-4 shadow-[var(--elevation-dropdown)] z-10 relative">
              {/* Promo code */}
              <div className="flex gap-2">
                <Input placeholder="Promo code" className="h-10 flex-1" />
                <Button variant="outline" className="h-10 shrink-0 font-semibold px-5">
                  Apply
                </Button>
              </div>

              <Separator />

              {/* Totals */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[var(--text-sm)]">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[var(--text-sm)]">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">
                    {isFreeShippingUnlocked ? 'Free' : 'Calculated at checkout'}
                  </span>
                </div>
                <div className="flex justify-between text-[var(--text-base)] font-bold pt-2 border-t mt-2">
                  <span>Total</span>
                  <PriceDisplay price={subtotal} size="lg" />
                </div>
              </div>

              {/* Checkout CTA */}
              <Button className="w-full group" size="xl" onClick={onCheckout}>
                Checkout
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-[var(--motion-fast)]" />
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

export { CartDrawer }
