'use client'

import React from 'react'

import { ShoppingBag, Check } from 'lucide-react'

import { cn , Button } from '@ecom/ui'

export interface AddToCartButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Current state of the button */
  state?: 'idle' | 'loading' | 'success' | 'error'
  /** Label for idle state */
  label?: string
  /** Label shown when item is added (success state) */
  addedLabel?: string
  /** Callback when item is added */
  onAddToCart?: () => void
  size?: 'sm' | 'default' | 'lg'
}

const ICON_DURATION = 'duration-[var(--motion-normal)]'
const ICON_EASE = 'ease-[var(--motion-ease-bounce)]'

function AddToCartButton({
  state: controlledState,
  label = 'Add to Cart',
  addedLabel = 'Added!',
  onAddToCart,
  size = 'default',
  className,
  ...props
}: AddToCartButtonProps) {
  // Internal state: idle → loading → success → idle
  const [internalState, setInternalState] = React.useState<'idle' | 'loading' | 'success'>('idle')

  // Sync with controlled state (external state takes precedence)
  React.useEffect(() => {
    if (controlledState === 'error') return // error state is terminal — caller handles it
    if (controlledState !== undefined) {
      setInternalState(controlledState as 'idle' | 'loading' | 'success')
    }
  }, [controlledState])

  const state: 'idle' | 'loading' | 'success' =
    controlledState !== undefined
      ? controlledState === 'error'
        ? 'idle'
        : (controlledState as 'idle' | 'loading' | 'success')
      : internalState

  function handleClick() {
    if (state !== 'idle') return
    setInternalState('loading')
    onAddToCart?.()
    // Caller can override via controlled state; internal fallback resets after animation
    if (controlledState === undefined) {
      setTimeout(() => setInternalState('success'), 800)
      setTimeout(() => setInternalState('idle'), 2000)
    }
  }

  const iconSize = {
    sm: 'w-4 h-4',
    default: 'w-5 h-5',
    lg: 'w-5 h-5',
  }[size]

  return (
    <Button
      variant={state === 'success' ? 'secondary' : 'brand'}
      size={size}
      className={cn(
        'relative overflow-hidden',
        state === 'loading' && 'pointer-events-none',
        className,
      )}
      onClick={handleClick}
      disabled={state === 'loading'}
      aria-busy={state === 'loading'}
      aria-label={
        state === 'success' ? addedLabel : state === 'loading' ? 'Adding to cart...' : label
      }
      {...props}
    >
      {/* Idle: shopping bag icon + label */}
      <span
        className={cn(
          'absolute inset-0 flex items-center justify-center gap-2',
          'transition-all',
          ICON_DURATION,
          state === 'idle' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
        )}
      >
        <ShoppingBag className={iconSize} />
        <span>{label}</span>
      </span>

      {/* Loading: spinner */}
      <span
        className={cn(
          'absolute inset-0 flex items-center justify-center gap-2',
          'transition-all',
          ICON_DURATION,
          state === 'loading' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
        )}
        aria-hidden="true"
      >
        <div
          className={cn(
            iconSize,
            'rounded-full border-2 border-current border-t-transparent animate-spin',
          )}
        />
        <span>Adding...</span>
      </span>

      {/* Success: checkmark with bounce */}
      <span
        className={cn(
          'absolute inset-0 flex items-center justify-center gap-2',
          'transition-all',
          ICON_EASE,
          ICON_DURATION,
          state === 'success' ? 'opacity-100 scale-100' : 'opacity-0 scale-75',
        )}
        aria-hidden="true"
      >
        <Check className={cn(iconSize, 'text-success font-bold scale-125')} />
        <span className="text-success font-semibold">{addedLabel}</span>
      </span>
    </Button>
  )
}

export { AddToCartButton }
