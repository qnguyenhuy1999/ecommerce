'use client'

import React from 'react'

import { Lock, CreditCard, AlertCircle } from 'lucide-react'

import { Button, Input, Label } from '@ecom/ui'
import { cn } from '@ecom/ui/utils'

export interface PaymentFormProps {
  onSubmit: (data: { cardNumber: string; expiry: string; cvc: string; name: string }) => void
  loading?: boolean
  error?: string
  submitLabel?: string
  stripeSlot?: React.ReactNode
  className?: string
}

function formatCardNumber(val: string) {
  return val
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(.{4})/g, '$1 ')
    .trim()
}

function formatExpiry(val: string) {
  const digits = val.replace(/\D/g, '').slice(0, 4)
  if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`
  return digits
}

function PaymentForm({
  onSubmit,
  loading = false,
  error,
  submitLabel = 'Pay Now',
  stripeSlot,
  className,
}: PaymentFormProps) {
  const [values, setValues] = React.useState({ cardNumber: '', expiry: '', cvc: '', name: '' })

  function set(field: keyof typeof values, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit(values)
  }

  const inputClass = cn(
    'h-11 rounded-[var(--radius-md)] border-[var(--border-default)]',
    'focus:border-[var(--action-primary)] focus:ring-1 focus:ring-[var(--action-primary)]',
    'bg-[var(--surface-base)] transition-all',
  )

  return (
    <div className={cn('space-y-5', className)}>
      <div className="flex items-center gap-2 text-[length:var(--text-xs)] text-[var(--text-tertiary)]">
        <Lock className="w-3.5 h-3.5 text-[var(--intent-success)]" />
        <span>Your payment information is encrypted and secure</span>
      </div>

      {stripeSlot ? (
        <div className="space-y-4">{stripeSlot}</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Card holder */}
          <div>
            <Label htmlFor="pay-name" className="mb-1.5 text-sm">
              Cardholder Name
            </Label>
            <Input
              id="pay-name"
              placeholder="Jane Doe"
              value={values.name}
              onChange={(e) => set('name', e.target.value)}
              className={inputClass}
              required
            />
          </div>

          {/* Card number */}
          <div>
            <Label htmlFor="pay-card" className="mb-1.5 flex items-center gap-1.5 text-sm">
              <CreditCard className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
              Card Number
            </Label>
            <Input
              id="pay-card"
              placeholder="1234 5678 9012 3456"
              inputMode="numeric"
              value={values.cardNumber}
              onChange={(e) => set('cardNumber', formatCardNumber(e.target.value))}
              className={cn(inputClass, 'font-mono tracking-wider')}
              required
            />
          </div>

          {/* Expiry + CVC */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="pay-expiry" className="mb-1.5 text-sm">
                Expiry
              </Label>
              <Input
                id="pay-expiry"
                placeholder="MM/YY"
                inputMode="numeric"
                value={values.expiry}
                onChange={(e) => set('expiry', formatExpiry(e.target.value))}
                className={cn(inputClass, 'font-mono')}
                required
              />
            </div>
            <div>
              <Label htmlFor="pay-cvc" className="mb-1.5 text-sm">
                CVC
              </Label>
              <Input
                id="pay-cvc"
                placeholder="123"
                inputMode="numeric"
                value={values.cvc}
                onChange={(e) => set('cvc', e.target.value.replace(/\D/g, '').slice(0, 4))}
                className={cn(inputClass, 'font-mono')}
                required
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-[var(--radius-md)] bg-[var(--intent-destructive)]/10 border border-[var(--intent-destructive)]/20">
              <AlertCircle className="w-4 h-4 text-[var(--intent-destructive)] shrink-0" />
              <p className="text-[length:var(--text-xs)] text-[var(--intent-destructive)]">
                {error}
              </p>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 gap-2 bg-[var(--action-primary)] hover:bg-[var(--action-primary-hover)] text-[var(--action-primary-foreground)] rounded-[var(--radius-md)] font-semibold shadow-md hover:shadow-lg transition-all"
            size="lg"
          >
            <Lock className="w-4 h-4" />
            {loading ? 'Processing…' : submitLabel}
          </Button>
        </form>
      )}

      <div className="flex justify-center gap-3">
        {['VISA', 'MC', 'AMEX', 'PAYPAL'].map((method) => (
          <div
            key={method}
            className="h-6 px-2 bg-[var(--surface-muted)] border border-[var(--border-subtle)] rounded flex items-center justify-center text-[length:var(--text-micro)] font-bold text-[var(--text-tertiary)] tracking-wide"
          >
            {method}
          </div>
        ))}
      </div>
    </div>
  )
}

export { PaymentForm }
