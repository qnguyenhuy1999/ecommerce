'use client'

import React from 'react'

import { Heart } from 'lucide-react'

import { cn, IconButton } from '@ecom/ui'

export interface WishlistButtonProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'onToggle' | 'onChange'
> {
  wishlisted?: boolean
  onToggle?: (wishlisted: boolean) => void
  onChange?: (wishlisted: boolean) => void
  size?: 'sm' | 'default' | 'lg'
}

function WishlistButton({
  wishlisted = false,
  onToggle,
  onChange,
  size = 'default',
  className,
  ...props
}: WishlistButtonProps) {
  const [internalState, setInternalState] = React.useState(wishlisted)
  const [justLiked, setJustLiked] = React.useState(false)
  const handler = onChange ?? onToggle
  const isWishlisted = handler ? wishlisted : internalState

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    e.stopPropagation()
    const nextState = !isWishlisted
    setInternalState(nextState)
    if (nextState) {
      setJustLiked(true)
      setTimeout(() => setJustLiked(false), 1000)
    }
    onChange?.(nextState)
    onToggle?.(nextState)
  }

  const dims = {
    sm: 'w-7 h-7 [&>svg]:w-3.5 [&>svg]:h-3.5',
    default: 'w-9 h-9 [&>svg]:w-4.5 [&>svg]:h-4.5',
    lg: 'w-11 h-11 [&>svg]:w-5 [&>svg]:h-5',
  }[size]

  return (
    <IconButton
      icon={
        <>
          {justLiked && (
            <span className="absolute inset-0 rounded-full border-2 border-brand animate-ping opacity-0 pointer-events-none" />
          )}
          <Heart
            className={cn(
              // Icon transition: color + fill + scale
              'transition-all duration-[var(--motion-normal)] ease-[var(--motion-ease-bounce)] relative z-10',
              isWishlisted
                ? 'fill-brand text-brand scale-110'
                : 'fill-transparent text-muted-foreground group-hover:text-foreground group-hover:scale-105',
            )}
          />
        </>
      }
      label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      className={cn(
        'group relative rounded-full',
        'bg-background shadow-[var(--elevation-card)] border border-border/50',
        // Transition: shadow + background, using token duration
        'transition-all duration-[var(--motion-normal)] ease-[var(--motion-ease-default)]',
        // Hover: elevated shadow
        'hover:shadow-[var(--elevation-hover)]',
        // Press: scale down
        'active:scale-90',
        dims,
        className,
      )}
      onClick={handleClick}
      aria-pressed={isWishlisted}
      {...props}
    />
  )
}

export { WishlistButton }
