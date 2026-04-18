'use client'

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
  'h-full rounded-full transition-all duration-[var(--motion-slow)] ease-[var(--motion-ease-default)]',
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
  showLabel?: boolean
  indeterminate?: boolean
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ value = 0, max = 100, variant, size, showLabel, indeterminate, className, ...props }, ref) => {
    const percentage = indeterminate ? 100 : Math.min(Math.max((value / max) * 100, 0), 100)
    const isComplete = !indeterminate && percentage === 100

    return (
      <div className={cn('flex flex-col gap-1.5', className)}>
        <div
          ref={ref}
          role="progressbar"
          aria-valuenow={indeterminate ? undefined : value}
          aria-valuemin={0}
          aria-valuemax={max}
          className={cn(progressVariants({ size }))}
          {...props}
        >
          <div
            className={cn(
              fillVariants({ variant }),
              indeterminate &&
                'animate-[shimmer_1.5s_infinite_linear] bg-[length:200%_100%] bg-gradient-to-r from-transparent via-white/20 to-transparent',
              isComplete && 'animate-[pulse_1s_ease-in-out_1]',
            )}
            style={{ width: `${String(percentage)}%` }}
          />
        </div>
        {showLabel && !indeterminate && (
          <div className="text-[var(--text-micro)] font-medium text-right text-muted-foreground">
            {Math.round(percentage)}%
          </div>
        )}
      </div>
    )
  },
)
Progress.displayName = 'Progress'

export { Progress }
export type { ProgressProps }
