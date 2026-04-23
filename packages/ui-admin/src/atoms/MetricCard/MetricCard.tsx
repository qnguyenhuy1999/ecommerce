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
    <Card className={cn('admin-metric-card p-[var(--space-5)]', className)} {...props}>
      <div className="flex items-center justify-between text-[var(--text-secondary)] pb-2">
        <span className="text-sm font-medium">{label}</span>
        {icon && <span className="[&>svg]:w-4 [&>svg]:h-4 opacity-70">{icon}</span>}
      </div>
      <div className="flex items-baseline gap-2">
        <h2 className="text-2xl font-bold tracking-tight">{formattedValue}</h2>
        {percentChange !== null && (
          <div
            className={cn(
              'flex items-center text-xs font-semibold',
              isPositive ? 'text-[var(--intent-success)]' : 'text-[var(--intent-danger)]',
            )}
          >
            {isPositive ? (
              <ArrowUpRight className="w-3 h-3 mr-0.5" />
            ) : (
              <ArrowDownRight className="w-3 h-3 mr-0.5" />
            )}
            {Math.abs(percentChange)}%
          </div>
        )}
      </div>
      {previousValue !== undefined && (
        <p className="text-[length:var(--text-sm)] text-[var(--text-secondary)] mt-1">
          vs previous period
        </p>
      )}
    </Card>
  )
}

export { MetricCard }
