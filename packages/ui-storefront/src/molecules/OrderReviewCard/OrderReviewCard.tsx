import React from 'react'

import { MapPin, CreditCard, ShoppingBag, Pencil } from 'lucide-react'

import { Button, Separator, cn } from '@ecom/ui'

import { PriceDisplay } from '../../atoms/PriceDisplay/PriceDisplay'
import type { ShippingAddress } from '../AddressForm/AddressForm'
import type { CartItemData } from '../../organisms/CartDrawer/CartDrawer'

export interface OrderTotals {
  subtotal: number
  shipping: number | 'free'
  tax?: number
  discount?: number
  total: number
}

export interface OrderReviewCardProps {
  shippingAddress: ShippingAddress
  paymentMethod: { label: string; last4?: string; icon?: React.ReactNode }
  items: CartItemData[]
  totals: OrderTotals
  onEdit?: (section: 'shipping' | 'payment' | 'items') => void
  className?: string
}

function OrderReviewCard({
  shippingAddress,
  paymentMethod,
  items,
  totals,
  onEdit,
  className,
}: OrderReviewCardProps) {
  return (
    <div className={cn('space-y-5', className)}>
      {/* Shipping */}
      <section className="rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--surface-base)] p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
            <MapPin className="w-4 h-4 text-[var(--action-primary)]" />
            Shipping Address
          </h3>
          {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit('shipping')}
              className="h-7 gap-1.5 text-[length:var(--text-xs)]"
            >
              <Pencil className="w-3 h-3" /> Edit
            </Button>
          )}
        </div>
        <address className="not-italic text-sm text-[var(--text-secondary)] space-y-0.5">
          <p className="font-semibold text-[var(--text-primary)]">{shippingAddress.fullName}</p>
          <p>{shippingAddress.addressLine1}</p>
          {shippingAddress.addressLine2 && <p>{shippingAddress.addressLine2}</p>}
          <p>
            {shippingAddress.city}, {shippingAddress.postalCode}
          </p>
          <p>{shippingAddress.country}</p>
          <p className="pt-1">{shippingAddress.phone}</p>
        </address>
      </section>

      {/* Payment */}
      <section className="rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--surface-base)] p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
            <CreditCard className="w-4 h-4 text-[var(--action-primary)]" />
            Payment Method
          </h3>
          {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit('payment')}
              className="h-7 gap-1.5 text-[length:var(--text-xs)]"
            >
              <Pencil className="w-3 h-3" /> Edit
            </Button>
          )}
        </div>
        <div className="flex items-center gap-3">
          {paymentMethod.icon && (
            <div className="w-9 h-9 rounded-[var(--radius-md)] bg-[var(--surface-muted)] flex items-center justify-center text-[var(--text-secondary)]">
              {paymentMethod.icon}
            </div>
          )}
          <div>
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              {paymentMethod.label}
            </p>
            {paymentMethod.last4 && (
              <p className="text-[length:var(--text-xs)] text-[var(--text-tertiary)] font-mono">
                •••• {paymentMethod.last4}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Items */}
      <section className="rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--surface-base)] p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
            <ShoppingBag className="w-4 h-4 text-[var(--action-primary)]" />
            Order Items ({items.length})
          </h3>
          {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit('items')}
              className="h-7 gap-1.5 text-[length:var(--text-xs)]"
            >
              <Pencil className="w-3 h-3" /> Edit
            </Button>
          )}
        </div>
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-[var(--radius-md)] overflow-hidden bg-[var(--surface-muted)] border border-[var(--border-subtle)] shrink-0">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                  {item.title}
                </p>
                {item.variant && (
                  <p className="text-[length:var(--text-xs)] text-[var(--text-tertiary)]">
                    {item.variant}
                  </p>
                )}
                <p className="text-[length:var(--text-xs)] text-[var(--text-secondary)]">
                  Qty: {item.quantity}
                </p>
              </div>
              <PriceDisplay price={item.price * item.quantity} size="sm" />
            </div>
          ))}
        </div>

        <Separator className="my-4 bg-[var(--border-subtle)]" />

        {/* Totals */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-[var(--text-secondary)]">Subtotal</span>
            <PriceDisplay price={totals.subtotal} size="sm" />
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--text-secondary)]">Shipping</span>
            <span
              className={cn(
                'font-medium',
                totals.shipping === 'free'
                  ? 'text-[var(--intent-success)]'
                  : 'text-[var(--text-primary)]',
              )}
            >
              {totals.shipping === 'free' ? 'Free' : `$${(totals.shipping as number).toFixed(2)}`}
            </span>
          </div>
          {totals.tax !== undefined && (
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Tax</span>
              <PriceDisplay price={totals.tax} size="sm" />
            </div>
          )}
          <Separator className="bg-[var(--border-subtle)]" />
          <div className="flex justify-between font-bold">
            <span className="text-[var(--text-primary)]">Total</span>
            <PriceDisplay price={totals.total} size="lg" />
          </div>
        </div>
      </section>
    </div>
  )
}

export { OrderReviewCard }
