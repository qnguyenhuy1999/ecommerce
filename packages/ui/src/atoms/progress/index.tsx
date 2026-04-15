import React from 'react'

import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '../../lib/utils'

const progressVariants = cva('relative w-full overflow-hidden rounded-full bg-muted', {
  variants: {
    size: {
      sm: 'h-1.5',
      default: 'h-2.5',
      lg: 'h-4',
    },
  },
  defaultVariants: {
    size: 'default',
  },
})

const fillVariants = cva(
  'h-full rounded-full transition-all duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)]',
  {
    variants: {
      variant: {
        default: 'bg-primary',
        brand: 'bg-brand',
        success: 'bg-success',
        warning: 'bg-warning',
        info: 'bg-info',
        destructive: 'bg-destructive',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

interface ProgressProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof progressVariants>,
    VariantProps<typeof fillVariants> {
  value?: number
  max?: number
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ value = 0, max = 100, variant, size, className, ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        className={cn(progressVariants({ size }), className)}
        {...props}
      >
        <div className={fillVariants({ variant })} style={{ width: `${String(percentage)}%` }} />
      </div>
    )
  },
)
Progress.displayName = 'Progress'

export { Progress }
export type { ProgressProps }
