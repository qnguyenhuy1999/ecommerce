'use client'

import * as React from 'react'
import { cn } from '@ecom/ui'

interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  value: string | number
  description?: string
  trend?: {
    value: string
    positive: boolean
  }
  icon?: React.ReactNode
}

function StatCard({ label, value, description, trend, icon, className, ...props }: StatCardProps) {
  return (
    <div
      className={cn('rounded-lg border bg-card p-5 text-card-foreground shadow-sm', className)}
      {...props}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p>
          {(description || trend) && (
            <div className="mt-1.5 flex items-center gap-2">
              {trend && (
                <span
                  className={cn(
                    'inline-flex items-center text-xs font-medium',
                    trend.positive ? 'text-green-600' : 'text-red-600',
                  )}
                >
                  {trend.positive ? '↑' : '↓'} {trend.value}
                </span>
              )}
              {description && <p className="text-xs text-muted-foreground">{description}</p>}
            </div>
          )}
        </div>
        {icon && (
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0 [&>svg]:w-5 [&>svg]:h-5 text-muted-foreground">
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}

export { StatCard }
export type { StatCardProps }
