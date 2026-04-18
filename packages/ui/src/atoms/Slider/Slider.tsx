'use client'

import * as React from 'react'

import * as SliderPrimitive from '@radix-ui/react-slider'

import { cn } from '../../lib/utils'

export interface SliderProps
  extends Omit<React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>, 'onChange' | 'value' | 'defaultValue'> {
  min?: number
  max?: number
  step?: number
  /** Single number or array. Radix always uses number[] internally. */
  value?: number | number[]
  defaultValue?: number | number[]
  onChange?: (value: number[]) => void
  formatLabel?: (value: number) => string
  disabled?: boolean
  /** Show tick marks */
  showTicks?: boolean
  /** Number of ticks to show */
  tickCount?: number
}

const Slider = React.forwardRef<React.ComponentRef<typeof SliderPrimitive.Root>, SliderProps>(
  (
    {
      min = 0,
      max = 100,
      step = 1,
      value,
      defaultValue,
      onChange,
      formatLabel,
      disabled = false,
      showTicks = false,
      tickCount = 5,
      className,
      ...props
    },
    ref,
  ) => {
    // Normalize to array: single numbers become [number]
    const toArray = (v: number | number[] | undefined) =>
      v === undefined ? [min] : (Array.isArray(v) ? v : [v])

    const [internalValue, setInternalValue] = React.useState(() => toArray(defaultValue))
    const controlledValue = value !== undefined ? toArray(value) : internalValue

    function handleValueChange(newValue: number[]) {
      if (value === undefined) setInternalValue(newValue)
      onChange?.(newValue)
    }

    const percentage = ((controlledValue[0] - min) / (max - min)) * 100

    return (
      <SliderPrimitive.Root
        ref={ref}
        min={min}
        max={max}
        step={step}
        value={controlledValue}
        onValueChange={handleValueChange}
        disabled={disabled}
        className={cn(
          'relative flex w-full touch-none select-none items-center',
          disabled && 'opacity-50 cursor-not-allowed',
          className,
        )}
        {...props}
      >
        <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-muted">
          <SliderPrimitive.Range
            className="absolute h-full bg-brand transition-[width] duration-[var(--motion-fast)]"
            style={{ width: `${String(percentage)}%` }}
          />
        </SliderPrimitive.Track>

        {showTicks &&
          Array.from({ length: tickCount }, (_, i) => {
            const tickValue = min + ((max - min) / (tickCount - 1)) * i
            const tickPercent = ((tickValue - min) / (max - min)) * 100
            return (
              <div
                key={i}
                className="absolute top-1/2 h-1 w-px bg-muted-foreground/30"
                style={{ left: `${String(tickPercent)}%` }}
              />
            )
          })}

        <SliderPrimitive.Thumb
          className={cn(
            'block h-4 w-4 rounded-full border-2 border-brand bg-background shadow-sm',
            'transition-transform duration-[var(--motion-fast)] ease-[var(--motion-ease-default)]',
            'hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'disabled:pointer-events-none disabled:opacity-50',
            'cursor-grab active:cursor-grabbing',
          )}
          aria-label={formatLabel ? formatLabel(controlledValue[0]) : undefined}
        />

        {formatLabel && (
          <span className="ml-3 text-xs text-muted-foreground font-medium tabular-nums">
            {formatLabel(controlledValue[0])}
          </span>
        )}
      </SliderPrimitive.Root>
    )
  },
)
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
