'use client'

import React from 'react'

import { CreditCard, Wallet, Building } from 'lucide-react'

import { cn } from '@ecom/ui'

export interface PaymentMethod {
  id: string
  label: string
  description?: string
  icon?: React.ReactNode
  disabled?: boolean
}

export interface PaymentMethodSelectorProps {
  methods: PaymentMethod[]
  selected: string
  onChange: (id: string) => void
  className?: string
}

const DEFAULT_ICONS: Record<string, React.ReactNode> = {
  card: <CreditCard className="w-5 h-5" />,
  paypal: <Wallet className="w-5 h-5" />,
  bank: <Building className="w-5 h-5" />,
}

function PaymentMethodSelector({
  methods,
  selected,
  onChange,
  className,
}: PaymentMethodSelectorProps) {
  return (
    <div className={cn('space-y-2', className)} role="radiogroup" aria-label="Payment method">
      {methods.map((method) => {
        const isSelected = method.id === selected
        return (
          <button
            key={method.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            disabled={method.disabled}
            onClick={() => !method.disabled && onChange(method.id)}
            className={cn(
              'w-full flex items-center gap-4 text-left',
              'px-[var(--space-4)] py-[var(--space-3-5)]',
              'rounded-[var(--radius-lg)] border-2',
              'transition-all duration-[var(--motion-fast)]',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--action-primary)]',
              isSelected
                ? 'border-[var(--action-primary)] bg-[var(--action-primary)]/5 shadow-[var(--elevation-card)]'
                : 'border-[var(--border-subtle)] bg-[var(--surface-base)] hover:border-[var(--border-default)]',
              method.disabled && 'opacity-50 cursor-not-allowed',
              !method.disabled && !isSelected && 'cursor-pointer',
            )}
          >
            <div
              className={cn(
                'w-10 h-10 rounded-[var(--radius-md)] flex items-center justify-center shrink-0 transition-all duration-[var(--motion-fast)]',
                isSelected
                  ? 'bg-[var(--action-primary)] text-[var(--action-primary-foreground)]'
                  : 'bg-[var(--surface-muted)] text-[var(--text-secondary)]',
              )}
            >
              {method.icon ?? DEFAULT_ICONS[method.id] ?? <CreditCard className="w-5 h-5" />}
            </div>
            <div className="flex-1 min-w-0">
              <p
                className={cn(
                  'text-[var(--text-sm)] font-semibold',
                  isSelected ? 'text-[var(--action-primary)]' : 'text-[var(--text-primary)]',
                )}
              >
                {method.label}
              </p>
              {method.description && (
                <p className="text-[length:var(--text-xs)] text-[var(--text-tertiary)] mt-0.5 truncate">
                  {method.description}
                </p>
              )}
            </div>
            <div
              className={cn(
                'w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center transition-all duration-[var(--motion-fast)]',
                isSelected ? 'border-[var(--action-primary)]' : 'border-[var(--border-default)]',
              )}
            >
              {isSelected && <div className="w-2 h-2 rounded-full bg-[var(--action-primary)]" />}
            </div>
          </button>
        )
      })}
    </div>
  )
}

export { PaymentMethodSelector }
