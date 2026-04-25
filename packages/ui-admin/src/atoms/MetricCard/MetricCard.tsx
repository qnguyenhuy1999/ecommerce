import React from 'react'

import { ArrowUpRight, ArrowDownRight } from 'lucide-react'

import { cn, Card } from '@ecom/ui'

export interface MetricCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  value: number
  previousValue?: number
  format?: 'number' | 'currency' | 'percent'
  icon?: React.ReactNode
}

function MetricCard({
  label,
  value,
  previousValue,
  format = 'number',
  icon,
  className,
  ...props
}: MetricCardProps) {
  const formattedValue = React.useMemo(() => {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          maximumFractionDigits: 0,
        }).format(value)
      case 'percent':
        return new Intl.NumberFormat('en-US', { style: 'percent' }).format(value / 100)
      default:
        return new Intl.NumberFormat('en-US').format(value)
    }
  }, [value, format])

  const percentChange = React.useMemo(() => {
    if (previousValue === undefined || previousValue === 0) return null
    return Math.round(((value - previousValue) / previousValue) * 100)
  }, [value, previousValue])

  const isPositive = percentChange !== null && percentChange >= 0

  return (
    <Card interactive className={cn('admin-metric-card p-[var(--space-5)]', className)} {...props}>
      <div className="flex items-center justify-between pb-[var(--space-3)]">
        <span className="text-[length:var(--text-xs)] font-semibold uppercase tracking-[0.1em] text-[var(--text-secondary)]">
          {label}
        </span>
        {icon && (
          <span className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] bg-[rgb(var(--brand-500-rgb)/0.08)] text-[var(--text-brand)] [&>svg]:h-4 [&>svg]:w-4">
            {icon}
          </span>
        )}
      </div>
      <div className="flex items-baseline gap-[var(--space-2)] flex-wrap">
        <h2 className="text-[length:var(--font-size-heading-xl)] font-bold tracking-[-0.015em] leading-[var(--line-height-tight)] tabular-nums text-[var(--text-primary)]">
          {formattedValue}
        </h2>
        {percentChange !== null && (
          <span
            className={cn(
              'inline-flex items-center gap-[2px] rounded-[var(--radius-sm)] px-[var(--space-1-5)] py-[var(--space-0-5)]',
              'text-[length:var(--text-xs)] font-semibold',
              isPositive
                ? 'text-[var(--intent-success)] bg-[var(--intent-success-muted)]'
                : 'text-[var(--intent-danger)] bg-[var(--intent-danger-muted)]',
            )}
          >
            {isPositive ? (
              <ArrowUpRight className="w-3 h-3" />
            ) : (
              <ArrowDownRight className="w-3 h-3" />
            )}
            {Math.abs(percentChange)}%
          </span>
        )}
      </div>
      {previousValue !== undefined && (
        <p className="text-[length:var(--text-sm)] text-[var(--text-tertiary)] mt-[var(--space-1)]">
          vs previous period
        </p>
      )}
    </Card>
  )
}

export { MetricCard }
