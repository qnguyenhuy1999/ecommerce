import type React from 'react'

import { cn } from '@ecom/ui/utils'

export type DashboardCardProps = React.HTMLAttributes<HTMLDivElement>

export function DashboardCard({ className, children, ...props }: DashboardCardProps) {
  return (
    <div
      className={cn(
        'rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--surface-base)]',
        'shadow-[var(--elevation-card)]',
        'transition-shadow duration-[var(--motion-normal)]',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
