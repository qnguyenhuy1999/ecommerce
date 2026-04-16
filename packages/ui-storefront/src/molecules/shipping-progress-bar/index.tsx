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
  const remaining = Math.max(0, threshold - current)
  const percent = Math.min((current / threshold) * 100, 100)
  const isUnlocked = current >= threshold

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  })

  return (
    <div className={cn('space-y-3', className)} {...props}>
      {/* Status message */}
      <p className={cn('text-[var(--text-sm)] font-medium flex items-center gap-2')}>
        {isUnlocked ? (
          <span className="text-success flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            Free shipping unlocked!
          </span>
        ) : (
          <span className="text-muted-foreground">
            You're{' '}
            <strong className="text-foreground font-semibold">{formatter.format(remaining)}</strong>{' '}
            away from free shipping.
          </span>
        )}
      </p>

      {/* Progress bar */}
      <Progress value={percent} variant={isUnlocked ? 'success' : 'brand'} className="h-1.5" />

      {/* Milestone markers */}
      {!isUnlocked && (
        <div className="flex items-center justify-between text-[var(--text-micro)] text-muted-foreground">
          <span>0</span>
          <div className="relative flex-1 mx-2">
            {/* "Free" milestone at 100% */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col items-center gap-0.5">
              <div
                className={cn(
                  'w-1.5 h-1.5 rounded-full border transition-colors',
                  isUnlocked
                    ? 'bg-success border-success'
                    : 'bg-muted-foreground/30 border-muted-foreground/30',
                )}
              />
              <span className="text-[var(--text-micro)] font-medium whitespace-nowrap">
                Free shipping
              </span>
            </div>
          </div>
          <span>{formatter.format(threshold)}</span>
        </div>
      )}
    </div>
  )
}

export { ShippingProgressBar }
