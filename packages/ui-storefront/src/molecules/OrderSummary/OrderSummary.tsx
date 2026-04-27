'use client'

import React from 'react'

import { Tag, Truck, ShieldCheck } from 'lucide-react'

import { Button, Input, Separator, cn, createStrictContext } from '@ecom/ui'

import { PriceDisplay } from '../../atoms/PriceDisplay/PriceDisplay'

export interface OrderDiscount {
  code: string
  amount: number
}

export interface OrderSummaryProps {
  subtotal: number
  shipping: number | 'free' | 'calculated'
  tax?: number
  discount?: OrderDiscount
  total: number
  freeShippingThreshold?: number
  onApplyPromo?: (code: string) => void
  promoLoading?: boolean
  promoError?: string
  className?: string
  children?: React.ReactNode
}

interface OrderSummaryContextValue {
  subtotal: number
  shipping: number | 'free' | 'calculated'
  tax?: number
  discount?: OrderDiscount
  total: number
  freeShippingThreshold?: number
  onApplyPromo?: (code: string) => void
  promoLoading?: boolean
  promoError?: string
}

const [OrderSummaryProvider, useOrderSummary] =
  createStrictContext<OrderSummaryContextValue>('OrderSummary')

function OrderSummaryRoot({
  subtotal,
  shipping,
  tax,
  discount,
  total,
  freeShippingThreshold,
  onApplyPromo,
  promoLoading,
  promoError,
  className,
  children,
}: OrderSummaryProps) {
  return (
    <OrderSummaryProvider
      value={{
        subtotal,
        shipping,
        tax,
        discount,
        total,
        freeShippingThreshold,
        onApplyPromo,
        promoLoading,
        promoError,
      }}
    >
      <div
        className={cn(
          'rounded-[var(--radius-lg)] border border-[var(--border-subtle)]',
          'bg-[var(--surface-base)] shadow-[var(--elevation-card)]',
          'p-5 flex flex-col gap-4',
          className,
        )}
      >
        <h2 className="text-[length:var(--text-base)] font-semibold text-[var(--text-primary)] flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[var(--intent-success)]" />
          Order Summary
        </h2>
        {children ?? <OrderSummaryDefaults />}
      </div>
    </OrderSummaryProvider>
  )
}
OrderSummaryRoot.displayName = 'OrderSummary'

// Default layout — used when no children are provided
function OrderSummaryDefaults() {
  const { onApplyPromo } = useOrderSummary()
  return (
    <>
      <OrderSummaryLines />
      {onApplyPromo && <OrderSummaryPromoInput />}
      <Separator className="bg-[var(--border-subtle)]" />
      <OrderSummaryTotal />
    </>
  )
}

function OrderSummaryLines({ className }: { className?: string }) {
  const { subtotal, shipping, tax, discount, freeShippingThreshold } = useOrderSummary()

  const shippingLabel =
    shipping === 'free' ? 'Free' : shipping === 'calculated' ? 'Calculated at checkout' : undefined

  const isFreeShipping = shipping === 'free' || shipping === 0

  return (
    <div className={cn('space-y-2.5 text-sm', className)}>
      <OrderSummaryLineItem label="Subtotal" value={<PriceDisplay price={subtotal} size="sm" />} />

      <OrderSummaryLineItem
        label={
          <span className="flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5" />
            Shipping
          </span>
        }
        value={
          shippingLabel ? (
            <span className={cn(isFreeShipping && 'text-[var(--intent-success)] font-semibold')}>
              {shippingLabel}
            </span>
          ) : (
            <PriceDisplay price={shipping as number} size="sm" />
          )
        }
      />

      {freeShippingThreshold && typeof shipping === 'number' && shipping > 0 && (
        <p className="text-[length:var(--text-xs)] text-[var(--text-tertiary)] pl-5">
          Add ${Math.max(0, freeShippingThreshold - subtotal).toFixed(2)} more for free shipping
        </p>
      )}

      {typeof tax === 'number' && (
        <OrderSummaryLineItem label="Tax" value={<PriceDisplay price={tax} size="sm" />} />
      )}

      {discount && (
        <OrderSummaryLineItem
          label={
            <span className="flex items-center gap-1.5 text-[var(--intent-success)]">
              <Tag className="w-3.5 h-3.5" />
              {discount.code}
            </span>
          }
          value={
            <span className="text-[var(--intent-success)] font-semibold">
              −${discount.amount.toFixed(2)}
            </span>
          }
        />
      )}
    </div>
  )
}
OrderSummaryLines.displayName = 'OrderSummary.Lines'

interface OrderSummaryLineItemProps {
  label: React.ReactNode
  value: React.ReactNode
  className?: string
}

function OrderSummaryLineItem({ label, value, className }: OrderSummaryLineItemProps) {
  return (
    <div className={cn('flex items-center justify-between gap-4', className)}>
      <span className="text-[var(--text-secondary)]">{label}</span>
      <span className="text-[var(--text-primary)] font-medium tabular-nums">{value}</span>
    </div>
  )
}
OrderSummaryLineItem.displayName = 'OrderSummary.LineItem'

function OrderSummaryTotal({ className }: { className?: string }) {
  const { total } = useOrderSummary()
  return (
    <div className={cn('flex items-center justify-between', className)}>
      <span className="text-[length:var(--text-base)] font-bold text-[var(--text-primary)]">
        Total
      </span>
      <PriceDisplay price={total} size="lg" />
    </div>
  )
}
OrderSummaryTotal.displayName = 'OrderSummary.Total'

function OrderSummaryPromoInput({ className }: { className?: string }) {
  const [code, setCode] = React.useState('')
  const { onApplyPromo, promoLoading, promoError } = useOrderSummary()

  function handleApply() {
    if (code.trim()) onApplyPromo?.(code.trim())
  }

  return (
    <div className={cn('space-y-1.5', className)}>
      <div className="relative group">
        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)] transition-colors group-focus-within:text-[var(--action-primary)]" />
        <Input
          id="promo-code"
          placeholder="Promo or gift code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleApply()}
          className="pl-9 pr-[72px] h-10 rounded-[var(--radius-md)] border-[var(--border-default)] focus:border-[var(--action-primary)] bg-[var(--surface-base)]"
        />
        <Button
          variant="ghost"
          onClick={handleApply}
          disabled={!code.trim() || promoLoading}
          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 px-3 text-[var(--action-primary)] font-semibold hover:bg-[var(--action-primary)]/10 rounded-[var(--radius-sm)]"
        >
          {promoLoading ? '…' : 'Apply'}
        </Button>
      </div>
      {promoError && (
        <p className="text-[length:var(--text-xs)] text-[var(--intent-destructive)]">
          {promoError}
        </p>
      )}
    </div>
  )
}
OrderSummaryPromoInput.displayName = 'OrderSummary.PromoInput'

const OrderSummary = Object.assign(OrderSummaryRoot, {
  Lines: OrderSummaryLines,
  LineItem: OrderSummaryLineItem,
  Total: OrderSummaryTotal,
  PromoInput: OrderSummaryPromoInput,
})

export { OrderSummary }
export type { OrderSummaryLineItemProps }
