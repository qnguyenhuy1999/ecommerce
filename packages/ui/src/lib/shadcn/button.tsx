import React from 'react'

import { cva, type VariantProps } from 'class-variance-authority'

import { LoadingSpinner } from '../../lib/shadcn/loading-spinner'
import { cn } from '../../lib/utils'

const buttonVariants = cva(
  [
    'relative inline-flex items-center justify-center gap-2 whitespace-nowrap',
    'font-semibold tracking-[-0.005em] select-none',
    'rounded-[var(--button-radius)]',
    'transition-[background-color,color,border-color,box-shadow,transform] duration-[var(--motion-fast)] ease-[var(--motion-ease-default)]',
    'active:scale-[var(--motion-scale-press)]',
    'focus-visible:outline-none focus-visible:ring-[var(--focus-ring-width)] focus-visible:ring-[var(--focus-ring-color)] focus-visible:ring-offset-[var(--focus-ring-offset)] focus-visible:ring-offset-background',
    'disabled:pointer-events-none disabled:opacity-50 disabled:active:scale-100',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0',
    // touch target on mobile only
    'min-h-[2.75rem] sm:min-h-0 min-w-[2.75rem] sm:min-w-0',
  ].join(' '),
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-[var(--elevation-xs)] hover:bg-primary/92 hover:shadow-[var(--elevation-surface)]',
        brand:
          'bg-brand text-brand-foreground shadow-[var(--elevation-xs)] hover:bg-[var(--action-primary-hover)] hover:shadow-[var(--elevation-surface)] hover:-translate-y-px',
        secondary:
          'bg-secondary text-secondary-foreground shadow-[var(--elevation-xs)] hover:bg-secondary/85',
        outline:
          'border border-[var(--border-default)] bg-background text-foreground hover:bg-[var(--state-hover)] hover:border-[var(--border-strong)]',
        'brand-outline':
          'border border-[var(--brand-500)] text-brand bg-[rgb(var(--brand-500-rgb)/0.04)] hover:bg-[rgb(var(--brand-500-rgb)/0.1)] hover:shadow-[var(--elevation-xs)]',
        ghost: 'text-foreground hover:bg-[var(--state-hover)] hover:text-foreground',
        soft: 'bg-[var(--surface-muted)] text-foreground hover:bg-[var(--surface-active)]',
        link: 'text-[var(--text-link)] underline-offset-4 hover:text-[var(--text-link-hover)] hover:underline',
        success:
          'bg-[var(--intent-success)] text-[var(--intent-success-fg)] shadow-[var(--elevation-xs)] hover:brightness-105 hover:shadow-[var(--elevation-surface)]',
        destructive:
          'bg-[var(--intent-danger)] text-[var(--intent-danger-fg)] shadow-[var(--elevation-xs)] hover:brightness-105 hover:shadow-[var(--elevation-surface)]',
      },
      size: {
        sm: 'h-[var(--button-height-sm)] px-3 text-sm [&_svg]:size-[0.875rem]',
        default: 'h-[var(--button-height-md)] px-5 text-sm [&_svg]:size-4',
        lg: 'h-[var(--button-height-lg)] px-6 text-[length:var(--text-base)] [&_svg]:size-[1.125rem]',
        xl: 'h-[var(--button-height-xl)] px-8 text-[length:var(--text-base)] [&_svg]:size-5',
        icon: 'h-[var(--button-height-md)] w-[var(--button-height-md)] [&_svg]:size-[1.125rem]',
        'icon-sm': 'h-[var(--button-height-sm)] w-[var(--button-height-sm)] [&_svg]:size-4',
      },
      fullWidth: {
        true: 'w-full',
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
  iconRight?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      loading,
      icon,
      iconRight,
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
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={loading}
        aria-label={resolvedAriaLabel}
        {...props}
      >
        {loading && <LoadingSpinner size="sm" className="absolute [&]:animate-spin" />}
        <span className={cn('inline-flex items-center gap-2', loading && 'invisible')}>
          {icon && <span className="shrink-0">{icon}</span>}
          {children}
          {iconRight && <span className="shrink-0">{iconRight}</span>}
        </span>
      </button>
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
