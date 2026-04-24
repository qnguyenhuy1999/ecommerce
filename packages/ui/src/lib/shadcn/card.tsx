'use client'

import React from 'react'

import { cn } from '../../lib/utils'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean
  elevation?: 0 | 1 | 2 | 3
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, interactive = false, elevation = 1, ...props }, ref) => {
    const shadowClasses = {
      0: 'shadow-none',
      1: 'shadow-[var(--elevation-card)]',
      2: 'shadow-[var(--elevation-hover)]',
      3: 'shadow-[var(--elevation-dropdown)]',
    }[elevation]

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-[var(--card-radius)] border border-[var(--card-border)] bg-card text-card-foreground overflow-hidden',
          'backdrop-blur-[8px] supports-[backdrop-filter]:bg-card/96',
          shadowClasses,
          interactive &&
            'cursor-pointer transition-all duration-[var(--motion-fast)] ease-[var(--motion-ease-default)] hover:-translate-y-px hover:shadow-[var(--elevation-hover)] hover:border-[var(--border-strong)]',
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
      className={cn('flex flex-col gap-1.5 p-[var(--padding-card)]', className)}
      {...props}
    />
  ),
)
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('font-semibold leading-tight tracking-[-0.01em] text-[var(--font-size-heading-sm)]', className)}
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
    className={cn('text-[var(--font-size-body-sm)] leading-relaxed text-muted-foreground', className)}
    {...props}
  />
))
CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('p-[var(--padding-card)] pt-[var(--space-4)]', className)}
      {...props}
    />
  ),
)
CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center p-[var(--padding-card)] pt-[var(--space-4)]', className)}
      {...props}
    />
  ),
)
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
