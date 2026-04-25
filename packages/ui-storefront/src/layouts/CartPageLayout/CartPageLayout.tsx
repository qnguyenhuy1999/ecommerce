import React from 'react'

import { ShoppingBag, ArrowRight } from 'lucide-react'

import { Button, EmptyState, cn } from '@ecom/ui'

import { CartItem } from '../../atoms/CartItem/CartItem'
import type { CartItemProps } from '../../atoms/CartItem/CartItem'
import { OrderSummary } from '../../molecules/OrderSummary/OrderSummary'
import type { OrderDiscount } from '../../molecules/OrderSummary/OrderSummary'
import { EmptyStateCard } from '../shared/EmptyStateCard'
import { StorefrontPageShell } from '../shared/StorefrontPageShell'
import { StorefrontSection } from '../shared/StorefrontSection'
import type { StorefrontFooter } from '../StorefrontFooter/StorefrontFooter'
import type { StorefrontHeader } from '../StorefrontHeader/StorefrontHeader'

export interface CartPageLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  promoBar?: React.ReactNode
  header?: React.ReactNode
  footer?: React.ReactNode
  headerProps?: React.ComponentProps<typeof StorefrontHeader>
  footerProps?: React.ComponentProps<typeof StorefrontFooter>
  items: CartItemProps[]
  subtotal: number
  shipping: number | 'free' | 'calculated'
  tax?: number
  discount?: OrderDiscount
  total: number
  freeShippingThreshold?: number
  emptyState?: React.ReactNode
  recommendations?: React.ReactNode
  newsletter?: React.ReactNode
  onCheckout?: () => void
  onUpdateQuantity?: (id: string, quantity: number) => void
  onRemoveItem?: (id: string) => void
  onApplyPromo?: (code: string) => void
  promoLoading?: boolean
  promoError?: string
}

function CartPageLayout({
  promoBar,
  header,
  footer,
  headerProps,
  footerProps,
  items,
  subtotal,
  shipping,
  tax,
  discount,
  total,
  freeShippingThreshold,
  emptyState,
  recommendations,
  newsletter,
  onCheckout,
  onUpdateQuantity,
  onRemoveItem,
  onApplyPromo,
  promoLoading,
  promoError,
  className,
  ...props
}: CartPageLayoutProps) {
  const isEmpty = items.length === 0

  return (
    <StorefrontPageShell
      className={className}
      promoBar={promoBar}
      header={header}
      footer={footer}
      headerProps={headerProps}
      footerProps={footerProps}
      newsletter={newsletter}
      {...props}
    >
      <StorefrontSection eyebrow="Cart" title="Your Shopping Cart">
        {isEmpty ? (
          <EmptyStateCard>
            {emptyState ?? (
              <EmptyState
                icon={<ShoppingBag className="w-10 h-10 text-[var(--text-tertiary)]" />}
                title="Your cart is empty"
                description="Looks like you haven't added anything yet. Start shopping to fill it up!"
                action={{
                  label: 'Start Shopping',
                  onClick: () => {},
                  variant: 'default',
                }}
              />
            )}
          </EmptyStateCard>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
            {/* Cart items */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-[var(--text-sm)] text-[var(--text-secondary)]">
                  {items.length} {items.length === 1 ? 'item' : 'items'}
                </p>
                <button
                  type="button"
                  onClick={() => items.forEach((i) => onRemoveItem?.(i.id))}
                  className="text-[length:var(--text-xs)] text-[var(--text-tertiary)] hover:text-[var(--intent-destructive)] transition-colors"
                >
                  Remove all
                </button>
              </div>

              <div className="space-y-3">
                {items.map((item) => (
                  <CartItem
                    key={item.id}
                    {...item}
                    onUpdateQuantity={(qty) => onUpdateQuantity?.(item.id, qty)}
                    onRemove={() => onRemoveItem?.(item.id)}
                  />
                ))}
              </div>
            </div>

            {/* Order summary — sticky on desktop, anchored below the measured header */}
            <div className="lg:sticky lg:top-[calc(var(--storefront-header-total)+var(--space-6))] space-y-4">
              <OrderSummary
                subtotal={subtotal}
                shipping={shipping}
                tax={tax}
                discount={discount}
                total={total}
                freeShippingThreshold={freeShippingThreshold}
                onApplyPromo={onApplyPromo}
                promoLoading={promoLoading}
                promoError={promoError}
              />

              <Button
                size="lg"
                onClick={onCheckout}
                className={cn(
                  'w-full h-12 gap-2 group',
                  'bg-[var(--action-primary)] hover:bg-[var(--action-primary-hover)]',
                  'text-[var(--action-primary-foreground)]',
                  'rounded-[var(--radius-md)] font-semibold',
                  'shadow-md hover:shadow-lg transition-all duration-[var(--motion-normal)]',
                  'active:scale-[0.98]',
                )}
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Button>

              <p className="text-center text-[length:var(--text-xs)] text-[var(--text-tertiary)]">
                Secure checkout · Free returns · Safe payment
              </p>
            </div>
          </div>
        )}
      </StorefrontSection>

      {recommendations && (
        <StorefrontSection
          eyebrow="You May Also Like"
          title="Recommended for You"
          contentClassName="max-w-none"
        >
          {recommendations}
        </StorefrontSection>
      )}
    </StorefrontPageShell>
  )
}

export { CartPageLayout }
