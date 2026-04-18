'use client'

import * as React from 'react'

import * as SliderPrimitive from '@radix-ui/react-slider'

import { cn } from '../../lib/utils'

export interface SliderProps extends Omit<
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>,
  'onChange' | 'value' | 'defaultValue'
> {
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
  /** Show a floating tooltip above the thumb while dragging/hovering */
  showTooltip?: boolean
  /** Show the formatted value label to the right of the track */
  showValueLabel?: boolean
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
      showTooltip = true,
      showValueLabel = false,
      className,
      ...props
    },
    ref,
  ) => {
    const [isDragging, setIsDragging] = React.useState(false)
    const [isHovered, setIsHovered] = React.useState(false)
    const [tooltipVisible, setTooltipVisible] = React.useState(false)

    // Normalize to array: single numbers become [number]
    const toArray = (v: number | number[] | undefined) =>
      v === undefined ? [min] : Array.isArray(v) ? v : [v]

    const [internalValue, setInternalValue] = React.useState(() => toArray(defaultValue))
    const controlledValue = value !== undefined ? toArray(value) : internalValue

    function handleValueChange(newValue: number[]) {
      if (value === undefined) setInternalValue(newValue)
      onChange?.(newValue)
    }

    const percentage = ((controlledValue[0] - min) / (max - min)) * 100
    const displayValue = formatLabel ? formatLabel(controlledValue[0]) : String(controlledValue[0])
    const tooltipValue = formatLabel ? formatLabel(controlledValue[0]) : String(controlledValue[0])

    const showThumbTooltip = showTooltip && (isDragging || isHovered)

    return (
      <SliderPrimitive.Root
        ref={ref}
        min={min}
        max={max}
        step={step}
        value={controlledValue}
        onValueChange={handleValueChange}
        onPointerDown={() => {
          setIsDragging(true)
          setTooltipVisible(true)
        }}
        onPointerUp={() => {
          setIsDragging(false)
          setTooltipVisible(false)
        }}
        onPointerLeave={() => {
          setIsDragging(false)
          setTooltipVisible(false)
        }}
        disabled={disabled}
        className={cn(
          'relative flex w-full touch-none select-none items-center py-3',
          disabled && 'opacity-50 cursor-not-allowed',
          className,
        )}
        {...props}
      >
        <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-muted group-hover:h-2.5 transition-all duration-200">
          <SliderPrimitive.Range
            className="absolute h-full bg-brand"
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

        {/* Tooltip bubble */}
        {showThumbTooltip && (
          <div
            className={cn(
              'absolute bottom-7 left-1/2 -translate-x-1/2 pointer-events-none z-10',
              'bg-foreground text-background text-xs font-semibold px-2 py-1 rounded-md whitespace-nowrap',
              'shadow-lg',
              isDragging
                ? 'animate-in fade-in-0 zoom-in-95 duration-150'
                : 'opacity-0 transition-opacity duration-200',
            )}
            style={{ left: `calc(${String(percentage)}% + (var(--slider-thumb-offset, 0px)))` }}
          >
            {tooltipValue}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-foreground rotate-45" />
          </div>
        )}

        <SliderPrimitive.Thumb
          onMouseEnter={() => {
            setIsHovered(true)
          }}
          onMouseLeave={() => {
            setIsHovered(false)
          }}
          className={cn(
            'relative block h-5 w-5 rounded-full border-2 border-brand bg-background',
            'shadow-[0_1px_4px_rgba(0,0,0,0.15),0_0_0_0_rgba(239,68,68,0)]',
            'transition-all duration-200 ease-out',
            'hover:shadow-[0_2px_8px_rgba(0,0,0,0.2),0_0_0_4px_rgba(239,68,68,0.2)] hover:scale-110',
            'active:shadow-[0_1px_3px_rgba(0,0,0,0.15),0_0_0_6px_rgba(239,68,68,0.3)] active:scale-105 active:cursor-grabbing',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
            'disabled:pointer-events-none disabled:opacity-50',
            'cursor-grab',
            (isDragging || tooltipVisible) &&
              'scale-110 shadow-[0_2px_8px_rgba(0,0,0,0.2),0_0_0_4px_rgba(239,68,68,0.3)]',
          )}
          aria-label={formatLabel ? formatLabel(controlledValue[0]) : undefined}
          style={
            {
              // Offset the tooltip to center over the thumb visually
              '--slider-thumb-offset': '0',
            } as React.CSSProperties
          }
        >
          {/* Inner dot for visual polish */}
          <span className="absolute inset-0 m-auto block h-1.5 w-1.5 rounded-full bg-brand opacity-60" />
        </SliderPrimitive.Thumb>

        {showValueLabel && (
          <span className="ml-3 text-sm text-muted-foreground font-medium tabular-nums shrink-0">
            {displayValue}
          </span>
        )}
      </SliderPrimitive.Root>
    )
  },
)
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
