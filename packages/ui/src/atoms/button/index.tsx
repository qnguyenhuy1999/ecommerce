'use client'

import React from 'react'

import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '../../lib/utils'
import { LoadingSpinner } from '../loading-spinner'

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium select-none',
    'transition-colors duration-[var(--motion-fast)] ease-[var(--motion-ease-default)]',
    'active:scale-[var(--motion-scale-press)]',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50 disabled:active:scale-100',
    '[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
    'min-h-[44px] sm:min-h-0 min-w-[44px] sm:min-w-0', // WCAG 44x44 tap target for mobile
  ].join(' '),
  {
    variants: {
      variant: {
        // Solid actions with elevation
        default:
          'bg-primary text-primary-foreground shadow-[var(--elevation-card)] hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground shadow-[var(--elevation-card)] hover:bg-destructive/90',
        brand:
          'relative overflow-hidden bg-brand text-brand-foreground shadow-[var(--elevation-card)] hover:shadow-[var(--elevation-hover)] hover:-translate-y-px after:absolute after:inset-0 after:-translate-x-full hover:after:animate-[shimmer_1.5s_infinite] after:bg-gradient-to-r after:from-transparent after:via-white/20 after:to-transparent',
        // Outline — subtle, no elevation by default
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground shadow-[var(--elevation-card)] hover:bg-secondary/80',
        // Ghost — no background, no shadow
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        // Link — text only
        link: 'text-primary underline-offset-4 hover:underline',
        // Soft — semi-transparent, adaptive
        soft: 'bg-accent text-accent-foreground hover:bg-accent/80',
        // Brand outline — brand color border/text, muted fill
        'brand-outline':
          'border border-brand text-brand bg-brand-muted/50 hover:bg-brand-muted hover:shadow-[var(--elevation-hover)]',
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
  /** Show a loading spinner and disable interactions */
  loading?: boolean
  /** Leading icon */
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

    // Provide a fallback aria-label when loading and no children/aria-label is provided
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
