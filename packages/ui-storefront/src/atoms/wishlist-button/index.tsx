import React from 'react'

import { Heart } from 'lucide-react'

import { cn } from '@ecom/ui'

export interface WishlistButtonProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'onToggle'
> {
  wishlisted?: boolean
  onToggle?: (wishlisted: boolean) => void
  size?: 'sm' | 'default' | 'lg'
}

function WishlistButton({
  wishlisted = false,
  onToggle,
  size = 'default',
  className,
  ...props
}: WishlistButtonProps) {
  const [internalState, setInternalState] = React.useState(wishlisted)
  const isWishlisted = onToggle ? wishlisted : internalState

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    e.stopPropagation()
    const nextState = !isWishlisted
    setInternalState(nextState)
    onToggle?.(nextState)
  }

  const dims = {
    sm: 'w-7 h-7 [&>svg]:w-3.5 [&>svg]:h-3.5',
    default: 'w-9 h-9 [&>svg]:w-4.5 [&>svg]:h-4.5',
    lg: 'w-11 h-11 [&>svg]:w-5 [&>svg]:h-5',
  }[size]

  return (
    <button
      type="button"
      className={cn(
        'group relative flex items-center justify-center rounded-full bg-background shadow-sm hover:shadow-[var(--elevation-hover)] transition-all duration-[250ms] border border-border/50',
        dims,
        className,
      )}
      onClick={handleClick}
      aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      {...props}
    >
      <Heart
        className={cn(
          'transition-all duration-[400ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]',
          isWishlisted
            ? 'fill-brand text-brand scale-110'
            : 'fill-transparent text-muted-foreground group-hover:text-foreground group-hover:scale-105',
        )}
      />
    </button>
  )
}

export { WishlistButton }
