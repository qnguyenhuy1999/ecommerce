'use client'

import {
  Badge,
  Button,
  EmptyState,
  Input,
  ScrollArea,
  Separator,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  cn,
} from '@ecom/ui'
import { ArrowRight, ShoppingBag, Sparkles, Tag } from 'lucide-react'
import React from 'react'
import { CartItem } from '../../atoms/CartItem/CartItem'
import { PriceDisplay } from '../../atoms/PriceDisplay/PriceDisplay'

// Types
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

// Context
interface CartDrawerContextValue {
  localItems: CartItemData[]
  subtotal: number
  percentToFreeShipping: number
  remainingForFreeShipping: number
  isFreeShippingUnlocked: boolean
  onOpenChange: (open: boolean) => void
  onCheckout?: () => void
  handleUpdateQuantity: (id: string, qty: number) => void
  handleRemoveItem: (id: string) => void
}

const CartDrawerContext = React.createContext<CartDrawerContextValue | null>(null)

function useCartDrawer() {
  const ctx = React.useContext(CartDrawerContext)
  if (!ctx) throw new Error('useCartDrawer must be used within <CartDrawer>')
  return ctx
}

// Root
function CartDrawerRoot({
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
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal)
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
    <CartDrawerContext.Provider
      value={{
        localItems,
        subtotal,
        percentToFreeShipping,
        remainingForFreeShipping,
        isFreeShippingUnlocked,
        onOpenChange,
        onCheckout,
        handleUpdateQuantity,
        handleRemoveItem,
      }}
    >
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-[90vw] sm:max-w-sm flex flex-col p-0 border-l border-[var(--border-subtle)] bg-[var(--surface-base)] shadow-[var(--elevation-modal)]">
          <CartDrawer.Header />
          <div className="flex-1 overflow-hidden flex flex-col bg-[var(--surface-muted)]/30">
            <CartDrawer.ShippingProgress />
            <CartDrawer.Items />
            <CartDrawer.Footer />
          </div>
        </SheetContent>
      </Sheet>
    </CartDrawerContext.Provider>
  )
}

// Header
function CartDrawerHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { localItems } = useCartDrawer()
  return (
    <SheetHeader
      className={cn(
        'px-[var(--space-5)] py-[var(--space-4)] border-b border-[var(--border-subtle)]',
        className,
      )}
      {...props}
    >
      <SheetTitle className="text-[var(--text-lg)] font-semibold flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-[var(--text-primary)]" />
          <span className="tracking-tight text-[var(--text-primary)]">Your Cart</span>
        </div>
        {localItems.length > 0 && (
          <Badge variant="success" className="rounded-[var(--radius-full)] px-2 mr-8 font-medium">
            {localItems.length} {localItems.length === 1 ? 'item' : 'items'}
          </Badge>
        )}
      </SheetTitle>
    </SheetHeader>
  )
}
CartDrawerHeader.displayName = 'CartDrawer.Header'

// Shipping progress
function CartDrawerShippingProgress({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { localItems, percentToFreeShipping, remainingForFreeShipping, isFreeShippingUnlocked } =
    useCartDrawer()

  if (localItems.length === 0) return null

  return (
    <div
      className={cn(
        'px-[var(--space-5)] py-[var(--space-4)] bg-[var(--surface-base)] border-b border-[var(--border-subtle)] shadow-sm z-10 relative',
        className,
      )}
      {...props}
    >
      <p className="text-[var(--text-sm)] font-medium mb-2.5 flex items-center gap-2">
        {isFreeShippingUnlocked ? (
          <span className="text-[var(--intent-success)] flex items-center gap-1.5 transition-all duration-[var(--motion-normal)]">
            <Sparkles className="w-4 h-4" />
            You've unlocked free shipping!
          </span>
        ) : (
          <span className="text-[var(--text-secondary)]">
            You're{' '}
            <strong className="text-[var(--text-primary)] font-semibold">
              ${remainingForFreeShipping.toFixed(2)}
            </strong>{' '}
            away from free shipping
          </span>
        )}
      </p>
      <div className="h-1.5 w-full bg-[var(--surface-muted)] rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-[var(--motion-slow)] ease-out ${
            isFreeShippingUnlocked ? 'bg-[var(--intent-success)]' : 'bg-[var(--action-primary)]'
          }`}
          style={{ width: `${percentToFreeShipping}%` }}
        />
      </div>
    </div>
  )
}
CartDrawerShippingProgress.displayName = 'CartDrawer.ShippingProgress'

// Items
function CartDrawerItems({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { localItems, onOpenChange, handleUpdateQuantity, handleRemoveItem } = useCartDrawer()

  if (localItems.length === 0) {
    return (
      <div
        className={cn('flex-1 flex items-center justify-center p-[var(--space-6)]', className)}
        {...props}
      >
        <EmptyState
          icon={<ShoppingBag className="w-8 h-8 text-[var(--text-tertiary)]" />}
          title="Your cart is empty"
          description="Looks like you haven't added anything yet."
          action={{
            label: 'Start Shopping',
            onClick: () => onOpenChange(false),
            variant: 'outline',
          }}
        />
      </div>
    )
  }

  return (
    <ScrollArea className={cn('flex-1', className)} {...props}>
      <div className="flex flex-col gap-4 p-[var(--space-5)]">
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
  )
}
CartDrawerItems.displayName = 'CartDrawer.Items'

// Footer
function CartDrawerFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { localItems, subtotal, isFreeShippingUnlocked, onCheckout } = useCartDrawer()

  if (localItems.length === 0) return null

  return (
    <div
      className={cn(
        'bg-[var(--surface-base)] border-t border-[var(--border-subtle)] z-20 shadow-[var(--elevation-up-1)] relative p-[var(--space-5)] flex flex-col gap-[var(--space-4)]',
        className,
      )}
      {...props}
    >
      {/* Promo code */}
      <div className="relative group">
        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)] transition-colors group-focus-within:text-[var(--action-primary)]" />
        <Input
          placeholder="Promo code"
          className="pl-9 pr-[70px] h-10 w-full rounded-[var(--radius-md)] border-[var(--border-default)] focus:border-[var(--action-primary)] focus:ring-1 focus:ring-[var(--action-primary)] transition-all bg-[var(--surface-base)] shadow-sm"
        />
        <Button
          variant="ghost"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 px-3 text-[var(--action-primary)] font-semibold hover:bg-[var(--action-primary)]/10 hover:text-[var(--action-primary)] rounded-[var(--radius-sm)]"
        >
          Apply
        </Button>
      </div>

      {/* Totals */}
      <div className="space-y-2.5">
        <div className="flex justify-between text-[var(--text-sm)]">
          <span className="text-[var(--text-secondary)]">Subtotal</span>
          <span className="font-medium text-[var(--text-primary)]">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-[var(--text-sm)]">
          <span className="text-[var(--text-secondary)]">Shipping</span>
          <span
            className={`font-medium ${isFreeShippingUnlocked ? 'text-[var(--intent-success)]' : 'text-[var(--text-primary)]'}`}
          >
            {isFreeShippingUnlocked ? 'Free' : 'Calculated at checkout'}
          </span>
        </div>
        <Separator className="bg-[var(--border-subtle)] my-1" />
        <div className="flex justify-between items-center text-[var(--text-base)] font-bold">
          <span className="text-[var(--text-primary)]">Total</span>
          <PriceDisplay price={subtotal} size="lg" />
        </div>
      </div>

      {/* Checkout CTA */}
      <Button
        className="w-full group h-12 rounded-[var(--radius-md)] bg-[var(--action-primary)] hover:bg-[var(--action-primary-hover)] text-[var(--action-primary-foreground)] shadow-md hover:shadow-lg transition-all duration-[var(--motion-normal)] ease-[var(--motion-ease-out)] active:scale-[0.98]"
        size="lg"
        onClick={onCheckout}
      >
        <div className="flex items-center justify-between w-full px-2">
          <span className="font-semibold text-[length:var(--text-base)] tracking-wide">
            Secure Checkout
          </span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-[var(--motion-normal)]" />
        </div>
      </Button>
    </div>
  )
}
CartDrawerFooter.displayName = 'CartDrawer.Footer'

// Compound export
const CartDrawer = Object.assign(CartDrawerRoot, {
  Header: CartDrawerHeader,
  ShippingProgress: CartDrawerShippingProgress,
  Items: CartDrawerItems,
  Footer: CartDrawerFooter,
})

export { CartDrawer }
