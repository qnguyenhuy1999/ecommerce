'use client'

import { CheckCircle, ShoppingBag, Truck, ArrowRight, Mail } from 'lucide-react'

import { Button, Separator } from '@ecom/ui'
import { cn } from '@ecom/ui/utils'

import { PriceDisplay } from '../../atoms/PriceDisplay/PriceDisplay'
import type { CartItemData } from '../CartDrawer/CartDrawer'
import type { OrderTotals } from '../../molecules/OrderReviewCard/OrderReviewCard'

export interface OrderConfirmationProps {
  orderNumber: string
  email: string
  estimatedDelivery?: string
  totals: OrderTotals
  items: CartItemData[]
  onContinueShopping?: () => void
  onTrackOrder?: () => void
  className?: string
}

function OrderConfirmation({
  orderNumber,
  email,
  estimatedDelivery,
  totals,
  items,
  onContinueShopping,
  onTrackOrder,
  className,
}: OrderConfirmationProps) {
  return (
    <div className={cn('mx-auto max-w-2xl text-center space-y-10', className)}>
      {/* Success icon */}
      <div className="flex flex-col items-center gap-5">
        <div className="relative flex items-center justify-center">
          <div
            className="absolute w-24 h-24 rounded-full bg-[var(--intent-success)]/15 animate-ping"
            style={{ animationDuration: '2s' }}
          />
          <div className="relative w-20 h-20 rounded-full bg-[var(--intent-success)]/20 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-[var(--intent-success)]" strokeWidth={1.5} />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">
            Order Confirmed!
          </h1>
          <p className="text-[var(--text-secondary)] text-[length:var(--text-base)]">
            Thank you for your purchase. We've sent a confirmation to{' '}
            <span className="font-semibold text-[var(--text-primary)]">{email}</span>
          </p>
        </div>
      </div>

      {/* Order info */}
      <div className="rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--surface-base)] shadow-[var(--elevation-card)] text-left overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-[var(--surface-muted)]/50 border-b border-[var(--border-subtle)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[length:var(--text-xs)] text-[var(--text-tertiary)] uppercase tracking-wide font-medium">
                Order Number
              </p>
              <p className="text-[length:var(--text-base)] font-bold text-[var(--text-primary)] font-mono mt-0.5">
                #{orderNumber}
              </p>
            </div>
            {estimatedDelivery && (
              <div className="text-right">
                <p className="text-[length:var(--text-xs)] text-[var(--text-tertiary)] uppercase tracking-wide font-medium flex items-center justify-end gap-1.5">
                  <Truck className="w-3.5 h-3.5" />
                  Estimated Delivery
                </p>
                <p className="text-sm font-semibold text-[var(--text-primary)] mt-0.5">
                  {estimatedDelivery}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Items */}
        <div className="px-6 py-5 space-y-3">
          <h2 className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2">
            <ShoppingBag className="w-4 h-4" /> Items ({items.length})
          </h2>
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
                    Qty {item.quantity}
                  </p>
                </div>
                <PriceDisplay price={item.price * item.quantity} size="sm" />
              </div>
            ))}
          </div>
        </div>

        <Separator className="bg-[var(--border-subtle)]" />

        {/* Totals */}
        <div className="px-6 py-5 space-y-2.5 text-sm">
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
          <div className="flex justify-between font-bold text-[length:var(--text-base)]">
            <span className="text-[var(--text-primary)]">Total Paid</span>
            <PriceDisplay price={totals.total} size="lg" />
          </div>
        </div>
      </div>

      {/* Email note */}
      <p className="text-[length:var(--text-xs)] text-[var(--text-tertiary)] flex items-center justify-center gap-1.5">
        <Mail className="w-3.5 h-3.5" />A receipt has been sent to {email}
      </p>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {onTrackOrder && (
          <Button
            onClick={onTrackOrder}
            className="gap-2 h-11 px-6 bg-[var(--action-primary)] hover:bg-[var(--action-primary-hover)] text-[var(--action-primary-foreground)] rounded-[var(--radius-md)] font-semibold shadow-md hover:shadow-lg transition-all"
          >
            <Truck className="w-4 h-4" />
            Track Order
          </Button>
        )}
        {onContinueShopping && (
          <Button
            variant="outline"
            onClick={onContinueShopping}
            className="gap-2 h-11 px-6 rounded-[var(--radius-md)] group"
          >
            Continue Shopping
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Button>
        )}
      </div>
    </div>
  )
}

export { OrderConfirmation }
