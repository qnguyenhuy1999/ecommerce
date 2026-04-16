'use client'

import React from 'react'

import { cva, type VariantProps } from 'class-variance-authority'

import { X } from 'lucide-react'

import { cn } from '../../lib/utils'

const badgeVariants = cva(
  [
    'inline-flex items-center justify-center font-medium gap-1.5',
    'rounded-[var(--radius-full)]',
    // Motion: color transition + subtle scale for marketplace badges
    'transition-all duration-[var(--motion-fast)] ease-[var(--motion-ease-default)]',
    'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  ].join(' '),
  {
    variants: {
      variant: {
        default: 'border border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary:
          'border border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline:
          'border border-input text-foreground bg-transparent hover:bg-accent hover:text-accent-foreground',
        success: 'border border-transparent bg-success text-success-foreground hover:bg-success/80',
        warning: 'border border-transparent bg-warning text-warning-foreground hover:bg-warning/80',
        info: 'border border-transparent bg-info text-info-foreground hover:bg-info/80',
        // Soft — adaptive, uses semantic accent colors
        soft: 'border border-transparent bg-accent text-accent-foreground hover:bg-accent/80',
        // === Marketplace variants ===
        // Sale — brand red for discounts
        sale: 'border border-transparent bg-brand text-brand-foreground hover:scale-105 hover:bg-brand-hover shadow-[var(--elevation-card)]',
        // New — green success for new arrivals
        new: 'border border-transparent bg-success text-success-foreground hover:scale-105 shadow-[var(--elevation-card)]',
        // Limited — orange warning for limited stock
        limited:
          'border border-transparent bg-warning text-warning-foreground hover:scale-105 shadow-[var(--elevation-card)]',
        // Out of stock — destructive muted
        'out-of-stock':
          'border border-transparent bg-destructive/10 text-destructive hover:bg-destructive/20',
      },
      size: {
        default: 'px-2.5 py-0.5 text-[var(--text-xs)]',
        sm: 'px-2 py-0.5 text-[10px] leading-tight',
        lg: 'px-3 py-1 text-[var(--text-sm)]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {
  dot?: boolean
  icon?: React.ReactNode
  removable?: boolean
  onRemove?: () => void
}

function Badge({
  className,
  variant,
  size,
  dot,
  icon,
  removable,
  onRemove,
  children,
  ...props
}: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75" />}
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
      {removable && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onRemove?.()
          }}
          className="ml-0.5 hover:bg-black/10 dark:hover:bg-white/20 rounded-full p-0.5 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <X className="w-3 h-3" />
          <span className="sr-only">Remove</span>
        </button>
      )}
    </div>
  )
}

export { Badge, badgeVariants }
