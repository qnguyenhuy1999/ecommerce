import React from 'react'

import { cva, type VariantProps } from 'class-variance-authority'

import { Button } from '../../atoms/Button/Button'
import { cn } from '../../lib/utils'

const emptyStateVariants = cva('flex flex-col items-center justify-center text-center', {
  variants: {
    variant: {
      default: 'gap-4 py-16 px-6',
      compact: 'gap-2 py-8 px-4',
      fullpage: 'gap-6 py-32 px-8 min-h-[50vh]',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

interface EmptyStateProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof emptyStateVariants> {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
    variant?: 'default' | 'brand' | 'outline'
  }
}

function EmptyState({
  icon,
  title,
  description,
  action,
  variant,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div className={cn(emptyStateVariants({ variant }), className)} {...props}>
      {icon && (
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground [&_svg]:h-8 [&_svg]:w-8 animate-[float_6s_ease-in-out_infinite]">
          {icon}
        </div>
      )}
      <div className="space-y-1.5">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        {description && <p className="text-sm text-muted-foreground max-w-md">{description}</p>}
      </div>
      {action && (
        <Button variant={action.variant || 'outline'} onClick={action.onClick} className="mt-2">
          {action.label}
        </Button>
      )}
    </div>
  )
}
EmptyState.displayName = 'EmptyState'

export { EmptyState }
export type { EmptyStateProps }
