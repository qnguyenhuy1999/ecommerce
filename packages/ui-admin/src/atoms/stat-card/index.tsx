'use client'

import React, { useEffect, useState } from 'react'

import { cva, type VariantProps } from 'class-variance-authority'

import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

import {
  cn,
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  Skeleton,
} from '@ecom/ui'

const statCardVariants = cva('admin-stat-card bg-card text-card-foreground', {
  variants: {
    variant: {
      default: 'p-5',
      compact: 'p-3',
      prominent: 'p-6 ring-1 ring-border shadow-lg',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

function NumberCounter({ value, duration = 1000 }: { value: string | number; duration?: number }) {
  const [displayValue, setDisplayValue] = useState(0)

  // Try to extract a pure number from strings like "$1,234.50"
  const stringVal = String(value)
  const isNumeric = /^[\d.,$€£]+$/.test(stringVal)
  const numericVal = isNumeric ? parseFloat(stringVal.replace(/[^\d.-]/g, '')) : NaN

  useEffect(() => {
    if (isNaN(numericVal)) return

    let startTime: number
    let animationFrame: number

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      const easeProgress = 1 - Math.pow(1 - progress, 3) // easeOutCubic

      setDisplayValue(numericVal * easeProgress)

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [numericVal, duration])

  if (isNaN(numericVal)) return <>{value}</>

  // Try to preserve original formatting
  const formatted = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: stringVal.includes('.') ? 2 : 0,
  }).format(displayValue)

  // Keep original prefix/suffix if present
  const prefix = stringVal.match(/^[^\d]+/) ? stringVal.match(/^[^\d]+/)?.[0] : ''
  const suffix = stringVal.match(/[^\d]+$/) ? stringVal.match(/[^\d]+$/)?.[0] : ''

  return (
    <>
      {prefix}
      {formatted}
      {suffix}
    </>
  )
}

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
            <div className="space-y-2 flex-1">
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
            <p className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              {label}
            </p>
            <p className="mt-1 text-2xl font-semibold tracking-[-0.44px] animate-in fade-in slide-in-from-bottom-2 duration-[var(--motion-normal)]">
              <NumberCounter value={value} />
            </p>
            {(description || trend) && (
              <div className="mt-2 flex items-center gap-2">
                {trend && (
                  <span
                    className={cn(
                      'inline-flex items-center text-[var(--text-micro)] font-semibold px-1.5 py-0.5 rounded-[var(--radius-sm)]',
                      trend.positive === true
                        ? 'bg-success/10 text-success'
                        : trend.positive === false
                          ? 'bg-destructive/10 text-destructive'
                          : 'bg-muted text-muted-foreground',
                    )}
                  >
                    {trend.positive === true ? (
                      <TrendingUp className="w-3 h-3 mr-1" />
                    ) : trend.positive === false ? (
                      <TrendingDown className="w-3 h-3 mr-1" />
                    ) : (
                      <Minus className="w-3 h-3 mr-1" />
                    )}
                    {trend.value}
                  </span>
                )}
                {description && <p className="text-[13px] text-muted-foreground">{description}</p>}
              </div>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            {icon && (
              <div className="w-10 h-10 rounded-[8px] bg-muted/50 flex items-center justify-center shrink-0 [&>svg]:w-5 [&>svg]:h-5 text-muted-foreground">
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
          <div className="mt-4 pt-4 border-t h-[60px] flex items-end animate-in fade-in duration-[var(--motion-slow)]">
            {chart}
          </div>
        )}
      </div>
    </div>
  )
}

export { StatCard }
export type { StatCardProps }
