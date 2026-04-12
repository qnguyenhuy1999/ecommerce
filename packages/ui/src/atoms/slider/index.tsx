'use client'

import * as React from 'react'
import { cn } from '../../lib/utils'

interface SliderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  min?: number
  max?: number
  step?: number
  value?: number
  defaultValue?: number
  onChange?: (value: number) => void
  formatLabel?: (value: number) => string
  disabled?: boolean
}

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  (
    {
      min = 0,
      max = 100,
      step = 1,
      value: controlledValue,
      defaultValue = min,
      onChange,
      formatLabel,
      disabled = false,
      className,
      ...props
    },
    ref,
  ) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue)
    const value = controlledValue ?? internalValue
    const percentage = ((value - min) / (max - min)) * 100

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      const v = Number(e.target.value)
      setInternalValue(v)
      onChange?.(v)
    }

    return (
      <div ref={ref} className={cn('relative flex w-full items-center', className)} {...props}>
        {/* Track background */}
        <div className="relative h-2 w-full rounded-full bg-muted">
          {/* Filled track */}
          <div
            className="absolute h-full rounded-full bg-brand transition-[width] duration-[100ms]"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Native range input (invisible, on top for interaction) */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          className={cn(
            'absolute inset-0 h-full w-full cursor-pointer opacity-0',
            disabled && 'cursor-not-allowed',
          )}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-valuetext={formatLabel ? formatLabel(value) : String(value)}
        />

        {/* Thumb indicator */}
        <div
          className={cn(
            'absolute top-1/2 h-5 w-5 -translate-y-1/2 -translate-x-1/2 rounded-full',
            'border-2 border-brand bg-background shadow-sm',
            'transition-[left,transform] duration-[100ms]',
            'pointer-events-none',
            disabled && 'opacity-50',
          )}
          style={{ left: `${percentage}%` }}
        />

        {/* Value label on hover */}
        {formatLabel && (
          <div
            className="absolute -top-8 -translate-x-1/2 rounded-[8px] bg-foreground px-2 py-0.5 text-xs text-background opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none"
            style={{ left: `${percentage}%` }}
          >
            {formatLabel(value)}
          </div>
        )}
      </div>
    )
  },
)
Slider.displayName = 'Slider'

export { Slider }
export type { SliderProps }
