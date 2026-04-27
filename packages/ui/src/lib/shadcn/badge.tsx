'use client'

import React from 'react'

import { cva, type VariantProps } from 'class-variance-authority'

import { X } from 'lucide-react'

import { cn } from '../../lib/utils'

const badgeVariants = cva(
  [
    'inline-flex items-center justify-center font-semibold gap-1.5',
    'rounded-full',
    'transition-all duration-[var(--motion-normal)] ease-[var(--motion-ease-out)]',
    'focus:outline-none focus:ring-[var(--focus-ring-width)] focus:ring-[var(--focus-ring-color)] focus:ring-offset-[var(--focus-ring-offset)]',
    'border',
    'select-none whitespace-nowrap',
  ].join(' '),
  {
    variants: {
      variant: {
        // --- Core ---
        primary:
          'border-transparent bg-primary text-primary-foreground shadow-[var(--shadow-sm)] hover:brightness-110',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        outline:
          'border-border text-foreground bg-transparent hover:bg-accent hover:text-accent-foreground',
        ghost:
          'border-transparent bg-transparent text-muted-foreground hover:bg-accent hover:text-accent-foreground',

        success:
          'border-[var(--intent-success-muted)] bg-[var(--intent-success-muted)] text-[var(--intent-success)] dark:text-[var(--intent-success)] hover:bg-[var(--intent-success-muted)]',
        warning:
          'border-[var(--intent-warning-muted)] bg-[var(--intent-warning-muted)] text-[var(--intent-warning)] dark:text-[var(--intent-warning)] hover:bg-[var(--intent-warning-muted)]',
        info: 'border-[var(--intent-info-muted)] bg-[var(--intent-info-muted)] text-[var(--intent-info)] dark:text-[var(--intent-info)] hover:bg-[var(--intent-info-muted)]',
        destructive:
          'border-[var(--intent-danger-muted)] bg-[var(--intent-danger-muted)] text-[var(--intent-danger)] dark:text-[var(--intent-danger)] hover:bg-[var(--intent-danger-muted)]',

        // --- Legacy / Core ---
        default: 'border-border bg-muted text-foreground',
        soft: 'border-transparent bg-accent text-accent-foreground hover:bg-accent/80',
      },
      size: {
        xs: 'px-1.5 py-[1px] text-[length:var(--text-micro)] leading-[var(--line-height-tight)]',
        sm: 'px-2 py-[var(--space-0-5)] text-[length:var(--text-micro)] leading-[var(--line-height-tight)]',
        md: 'px-2.5 py-[var(--space-0-5)] text-[length:var(--text-xs)] leading-[var(--line-height-snug)]',
        lg: 'px-3 py-1 text-sm leading-[var(--line-height-snug)]',
        default:
          'px-2.5 py-[var(--space-0-5)] text-[length:var(--text-xs)] leading-[var(--line-height-snug)]',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {
  dot?: boolean
  pulse?: boolean
  dotColor?: string
  icon?: React.ReactNode
  iconRight?: React.ReactNode
  removable?: boolean
  onRemove?: () => void
}

function Badge({
  className,
  variant,
  size,
  dot,
  pulse,
  dotColor,
  icon,
  iconRight,
  removable,
  onRemove,
  children,
  ...props
}: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {(dot || pulse) && (
        <span
          className={cn(
            'relative flex h-2 w-2 shrink-0 items-center justify-center rounded-full',
            !dotColor && 'bg-current',
          )}
          style={dotColor ? { backgroundColor: dotColor } : undefined}
        >
          {pulse && (
            <span
              className={cn(
                'absolute inline-flex w-full h-full rounded-full animate-ping',
                !dotColor && 'bg-current opacity-75',
              )}
              style={dotColor ? { backgroundColor: dotColor, opacity: 0.75 } : undefined}
            />
          )}
          <span
            className={cn(
              'relative inline-flex h-2 w-2 rounded-full opacity-90',
              !dotColor && 'bg-current',
            )}
            style={dotColor ? { backgroundColor: dotColor, opacity: 0.9 } : undefined}
          />
        </span>
      )}
      {icon && <span className="inline-flex items-center shrink-0">{icon}</span>}
      <span className="truncate">{children}</span>
      {iconRight && <span className="inline-flex items-center shrink-0">{iconRight}</span>}
      {removable && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onRemove?.()
          }}
          className="-mr-0.5 ml-0.5 rounded-full p-0.5 opacity-70 ring-offset-background transition-all hover:bg-black/10 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 dark:hover:bg-white/20"
        >
          <X className="w-3 h-3" />
          <span className="sr-only">Remove</span>
        </button>
      )}
    </div>
  )
}

export { Badge, badgeVariants }
