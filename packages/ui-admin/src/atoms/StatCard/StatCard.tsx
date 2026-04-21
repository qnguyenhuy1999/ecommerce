import React from 'react'

import { cva, type VariantProps } from 'class-variance-authority'

import {
  cn,
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  Skeleton,
} from '@ecom/ui'

import { StatCardTrend , NumberCounter } from './StatCardTrend'

const statCardVariants = cva('admin-stat-card', {
  variants: {
    variant: {
      default: 'p-[var(--space-5)]',
      compact: 'p-[var(--space-3)]',
      prominent:
        'p-[var(--space-6)] ring-1 ring-[var(--border-default)] shadow-[var(--elevation-surface)]',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

interface StatCardProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof statCardVariants> {
  label: string
  value: string | number
  description?: string
  trend?: {
    value: string
    positive: boolean | null
  }
  icon?: React.ReactNode
  chart?: React.ReactNode
  periods?: string[]
  loading?: boolean
}

function StatCard({
  label,
  value,
  description,
  trend,
  icon,
  chart,
  periods,
  className,
  variant,
  loading = false,
  ...props
}: StatCardProps) {
  if (loading) {
    return (
      <div className={cn(statCardVariants({ variant }), className)} {...props}>
        <div className="flex flex-col h-full gap-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1 mr-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-32" />
            </div>
            <Skeleton className="h-10 w-10 rounded-[var(--radius-sm)]" />
          </div>
          <Skeleton className="h-4 w-40" />
        </div>
      </div>
    )
  }

  return (
    <div className={cn(statCardVariants({ variant }), className)} {...props}>
      <div className="flex flex-col h-full">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-muted-foreground tracking-wide">{label}</p>
            <p className="mt-1.5 text-2xl font-bold tracking-tight animate-in fade-in slide-in-from-bottom-2 duration-[var(--motion-normal)]">
              <NumberCounter value={value} />
            </p>
            {(description || trend) && (
              <div className="mt-2 flex items-center gap-2 flex-wrap">
                {trend && <StatCardTrend value={trend.value} positive={trend.positive} />}
                {description && (
                  <p className="text-[var(--text-sm)] text-muted-foreground">{description}</p>
                )}
              </div>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            {icon && (
              <div className="w-10 h-10 rounded-[var(--radius-md)] bg-gradient-to-br from-muted to-muted/50 border border-border/50 flex items-center justify-center shrink-0 [&>svg]:w-5 [&>svg]:h-5 text-foreground/70 shadow-sm">
                {icon}
              </div>
            )}
            {periods && periods.length > 0 && (
              <Select>
                <SelectTrigger className="text-xs h-auto py-0 px-0 bg-transparent border-none text-muted-foreground hover:text-foreground w-auto min-w-[auto]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent align="end">
                  {periods.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        {chart && (
          <div className="mt-4 pt-4 border-t h-[var(--space-12)] flex items-end animate-in fade-in duration-[var(--motion-slow)]">
            {chart}
          </div>
        )}
      </div>
    </div>
  )
}

export { StatCard }
export type { StatCardProps }
