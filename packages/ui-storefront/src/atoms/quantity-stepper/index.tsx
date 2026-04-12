'use client'

import * as React from 'react'
import { cn, Button } from '@ecom/ui'
import { Plus, Minus } from 'lucide-react'

export interface QuantityStepperProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
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
    sm: { h: 'h-8', w: 'w-8', text: 'text-xs', icon: 'w-3 h-3' },
    default: { h: 'h-10', w: 'w-10', text: 'text-sm', icon: 'w-4 h-4' }
  }[size]

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border bg-background shadow-sm overflow-hidden",
        sizes.h,
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      {...props}
    >
      <button
        type="button"
        className={cn(
          "flex items-center justify-center transition-colors hover:bg-muted active:bg-muted/80 h-full",
          sizes.w,
          atMin && "opacity-50 cursor-not-allowed"
        )}
        onClick={handleDecrease}
        disabled={disabled || atMin}
        aria-label="Decrease quantity"
      >
        <Minus className={sizes.icon} />
      </button>
      
      <div className={cn("flex items-center justify-center font-medium w-8", sizes.text)}>
        {value}
      </div>
      
      <button
        type="button"
        className={cn(
          "flex items-center justify-center transition-colors hover:bg-muted active:bg-muted/80 h-full",
          sizes.w,
          atMax && "opacity-50 cursor-not-allowed"
        )}
        onClick={handleIncrease}
        disabled={disabled || atMax}
        aria-label="Increase quantity"
      >
        <Plus className={sizes.icon} />
      </button>
    </div>
  )
}

export { QuantityStepper }
