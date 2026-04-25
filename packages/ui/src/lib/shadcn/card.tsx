'use client'

import React from 'react'

import { cn } from '../../lib/utils'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean
  /** Visual elevation level. 0=flat, 1=resting, 2=raised, 3=floating */
  elevation?: 0 | 1 | 2 | 3
  /** Surface look: solid (default) or muted/subtle */
  surface?: 'default' | 'subtle' | 'elevated'
  /** Border radius scale */
  radius?: 'sm' | 'md' | 'lg' | 'xl'
}

const elevationClass: Record<NonNullable<CardProps['elevation']>, string> = {
  0: 'shadow-none',
  1: 'shadow-[var(--elevation-card)]',
  2: 'shadow-[var(--elevation-floating)]',
  3: 'shadow-[var(--elevation-dropdown)]',
}

const surfaceClass: Record<NonNullable<CardProps['surface']>, string> = {
  default: 'bg-card',
  subtle: 'bg-[var(--surface-subtle)]',
  elevated: 'bg-[var(--surface-elevated)]',
}

const radiusClass: Record<NonNullable<CardProps['radius']>, string> = {
  sm: 'rounded-[var(--radius-sm)]',
  md: 'rounded-[var(--radius-md)]',
  lg: 'rounded-[var(--card-radius)]',
  xl: 'rounded-[var(--card-radius-premium)]',
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    { className, interactive = false, elevation = 1, surface = 'default', radius = 'lg', ...props },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'border border-[var(--card-border)] text-card-foreground overflow-hidden',
          surfaceClass[surface],
          radiusClass[radius],
          elevationClass[elevation],
          interactive &&
            'cursor-pointer transition-[transform,box-shadow,border-color] duration-[var(--motion-fast)] ease-[var(--motion-ease-default)] hover:-translate-y-0.5 hover:shadow-[var(--elevation-floating)] hover:border-[var(--border-strong)] focus-within:shadow-[var(--elevation-floating)]',
          className,
        )}
        {...props}
      />
    )
  },
)
Card.displayName = 'Card'

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex flex-col gap-[var(--space-1-5)] p-[var(--card-padding)] pb-[var(--space-3)]',
        className,
      )}
      {...props}
    />
  ),
)
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        'font-semibold leading-tight tracking-[-0.01em] text-[length:var(--font-size-heading-sm)]',
        className,
      )}
      {...props}
    />
  ),
)
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      'text-[length:var(--font-size-body-sm)] leading-[var(--line-height-relaxed)] text-muted-foreground',
      className,
    )}
    {...props}
  />
))
CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-[var(--card-padding)] pt-0', className)} {...props} />
  ),
)
CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex items-center gap-[var(--space-2)] p-[var(--card-padding)] pt-[var(--space-4)]',
        className,
      )}
      {...props}
    />
  ),
)
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
