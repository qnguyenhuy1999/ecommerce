'use client'

import { Plus, Minus } from 'lucide-react'

import { cn, IconButton, Input } from '@ecom/ui'

export interface QuantityStepperProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'onChange'
> {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  disabled?: boolean
  size?: 'sm' | 'default'
}

function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  disabled = false,
  size = 'default',
  className,
  ...props
}: QuantityStepperProps) {
  const atMin = value <= min
  const atMax = value >= max

  function handleDecrease() {
    if (!disabled && !atMin) {
      onChange(value - 1)
    }
  }

  function handleIncrease() {
    if (!disabled && !atMax) {
      onChange(value + 1)
    }
  }

  const sizes = {
    sm: { h: 'h-8', w: 'w-8', text: 'text-[length:var(--text-micro)]', icon: 'w-3 h-3' },
    default: { h: 'h-10', w: 'w-10', text: 'text-[var(--text-sm)]', icon: 'w-4 h-4' },
  }[size]

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border bg-background shadow-[var(--elevation-card)] overflow-hidden',
        sizes.h,
        disabled && 'opacity-50 cursor-not-allowed',
        className,
      )}
      {...props}
    >
      <IconButton
        icon={<Minus className={sizes.icon} />}
        label="Decrease quantity"
        variant="ghost"
        className={cn(
          'h-full rounded-none border-0 shadow-none',
          'text-muted-foreground hover:text-foreground hover:bg-muted active:bg-muted/80',
          // Color transition using token duration
          'transition-colors duration-[var(--motion-fast)] ease-[var(--motion-ease-default)]',
          sizes.w,
          atMin && 'opacity-50 cursor-not-allowed',
        )}
        onClick={handleDecrease}
        disabled={disabled || atMin}
      />

      <Input
        type="number"
        size={size === 'sm' ? 'sm' : 'default'}
        value={value}
        onChange={(e) => {
          const val = parseInt(e.target.value, 10)
          if (!isNaN(val)) {
            const bounded = Math.max(min, Math.min(max, val))
            onChange(bounded)
          } else if (e.target.value === '') {
            // Allow temporary empty state while typing, but this needs local state if we want true empty
            // For now, if empty, just don't trigger onChange until they type a number, or set to min.
            onChange(min)
          }
        }}
        onBlur={() => {
          if (value < min) onChange(min)
          if (value > max) onChange(max)
        }}
        className={cn(
          'font-medium text-center border-l border-r border-border/30 bg-transparent tabular-nums px-0',
          'rounded-none border-y-0 shadow-none focus:shadow-none',
          'focus:bg-muted/30 transition-colors',
          // hide arrows
          '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
          size === 'sm' ? 'w-8' : 'w-12',
          sizes.text,
        )}
        aria-live="polite"
        aria-atomic="true"
        aria-label={`Quantity`}
        disabled={disabled}
        min={min}
        max={max}
      />

      <IconButton
        icon={<Plus className={sizes.icon} />}
        label="Increase quantity"
        variant="ghost"
        className={cn(
          'h-full rounded-none border-0 shadow-none',
          'text-muted-foreground hover:text-foreground hover:bg-muted active:bg-muted/80',
          'transition-colors duration-[var(--motion-fast)] ease-[var(--motion-ease-default)]',
          sizes.w,
          atMax && 'opacity-50 cursor-not-allowed',
        )}
        onClick={handleIncrease}
        disabled={disabled || atMax}
      />
    </div>
  )
}

export { QuantityStepper }
