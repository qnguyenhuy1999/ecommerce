'use client'

import React from 'react'

import { cva, type VariantProps } from 'class-variance-authority'

import { LoadingSpinner } from '../../lib/shadcn/loading-spinner'
import { cn } from '../../lib/utils'

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium select-none',
    'transition-colors duration-[var(--motion-fast)] ease-[var(--motion-ease-default)]',
    'active:scale-[var(--motion-scale-press)]',
    'focus-visible:outline-none focus-visible:ring-[var(--focus-ring-width)] focus-visible:ring-[var(--focus-ring-color)] focus-visible:ring-offset-[var(--focus-ring-offset)]',
    'disabled:pointer-events-none disabled:opacity-50 disabled:active:scale-100',
    '[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
    'min-h-[2.75rem] sm:min-h-0 min-w-[2.75rem] sm:min-w-0',
  ].join(' '),
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        brand:
          'relative overflow-hidden bg-brand text-brand-foreground shadow-sm hover:shadow-md hover:transform hover:[transform:var(--motion-lift)] after:absolute after:inset-0 after:-translate-x-full hover:after:animate-[shimmer_var(--animate-duration-shimmer-progress)_linear_infinite] after:bg-gradient-to-r after:from-transparent after:via-white/20 after:to-transparent',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        soft: 'bg-accent text-accent-foreground hover:bg-accent/80',
        'brand-outline':
          'border border-brand text-brand bg-brand-muted/50 hover:bg-brand-muted hover:shadow-sm',
      },
      size: {
        default: 'h-10 px-5 py-2 text-sm rounded-[var(--radius-sm)]',
        sm: 'h-8 px-3 text-xs rounded-[var(--radius-sm)]',
        lg: 'h-11 px-8 text-sm rounded-[var(--radius-sm)]',
        xl: 'h-12 px-8 text-sm rounded-[var(--radius-md)]',
        icon: 'h-10 w-10 rounded-[var(--radius-sm)]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  loading?: boolean
  icon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      loading,
      icon,
      disabled,
      children,
      'aria-label': ariaLabel,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading

    const resolvedAriaLabel =
      loading && !ariaLabel && typeof children !== 'string' ? 'Loading' : ariaLabel

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={loading}
        aria-label={resolvedAriaLabel}
        {...props}
      >
        {loading && <LoadingSpinner size="sm" className="absolute [&]:animate-spin" />}
        <span className={cn('flex items-center gap-2', loading && 'invisible')}>
          {icon && <span className="shrink-0">{icon}</span>}
          {children}
        </span>
      </button>
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
