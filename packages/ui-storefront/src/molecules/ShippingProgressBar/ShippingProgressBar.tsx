'use client'

import React from 'react'

import { Sparkles } from 'lucide-react'

import { cn, Progress } from '@ecom/ui'

export interface ShippingProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  current: number
  threshold: number
  currency?: string
  currencySymbol?: string
}

function ShippingProgressBar({
  current,
  threshold,
  currency = 'USD',
  className,
  ...props
}: ShippingProgressBarProps) {
  const normalizedCurrent = Math.max(0, current)
  const normalizedThreshold = Math.max(0, threshold)
  const isUnlocked = normalizedThreshold === 0 || normalizedCurrent >= normalizedThreshold
  const remaining = Math.max(0, normalizedThreshold - normalizedCurrent)
  const percent =
    normalizedThreshold === 0 ? 100 : Math.min((normalizedCurrent / normalizedThreshold) * 100, 100)

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  })

  return (
    <div
      className={cn(
        'rounded-[var(--radius-lg)] border border-border/70 bg-gradient-to-r from-muted/40 via-card to-muted/20',
        'p-4 shadow-[var(--elevation-card)] space-y-3',
        className,
      )}
      {...props}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-[var(--text-sm)] font-medium leading-relaxed">
          {isUnlocked ? (
            <span className="text-success flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              Free shipping unlocked!
            </span>
          ) : (
            <span className="text-muted-foreground">
              You're{' '}
              <strong className="text-foreground font-semibold">
                {formatter.format(remaining)}
              </strong>{' '}
              away from free shipping.
            </span>
          )}
        </p>

        <span
          className={cn(
            'inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-[var(--text-micro)] font-semibold',
            isUnlocked ? 'bg-success/15 text-success' : 'bg-brand/10 text-brand',
          )}
        >
          {Math.round(percent)}%
        </span>
      </div>

      <Progress
        value={percent}
        size="sm"
        variant={isUnlocked ? 'success' : 'brand'}
        className="gap-0"
      />

      <div className="flex items-center justify-between text-[var(--text-micro)] text-muted-foreground">
        <span>{formatter.format(0)}</span>
        <span className={cn('font-medium', isUnlocked && 'text-success')}>
          Free shipping at {formatter.format(normalizedThreshold)}
        </span>
      </div>
    </div>
  )
}

export { ShippingProgressBar }
