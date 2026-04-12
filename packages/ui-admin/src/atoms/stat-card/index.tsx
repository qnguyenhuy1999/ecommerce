'use client'

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
  chart?: React.ReactNode
  periods?: string[]
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
  ...props
}: StatCardProps) {
  // Simple numeric animation simulation could go here for `value` when it changes

  return (
    <div className={cn('admin-stat-card bg-card text-card-foreground', className)} {...props}>
      <div className="p-5 flex flex-col h-full">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              {label}
            </p>
            <p className="mt-1 text-2xl font-semibold tracking-[-0.44px] animate-[slide-up_300ms_ease-out]">
              {value}
            </p>
            {(description || trend) && (
              <div className="mt-2 flex items-center gap-2">
                {trend && (
                  <span
                    className={cn(
                      'inline-flex items-center text-xs font-semibold px-1.5 py-0.5 rounded-[4px]',
                      trend.positive
                        ? 'bg-success-muted text-success'
                        : 'bg-destructive/10 text-destructive',
                    )}
                  >
                    {trend.positive ? '↑' : '↓'} {trend.value}
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
              <select className="text-xs bg-transparent border-none text-muted-foreground outline-none cursor-pointer hover:text-foreground">
                {periods.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {chart && <div className="mt-4 pt-4 border-t h-[60px] flex items-end">{chart}</div>}
      </div>
    </div>
  )
}

export { StatCard }
export type { StatCardProps }
