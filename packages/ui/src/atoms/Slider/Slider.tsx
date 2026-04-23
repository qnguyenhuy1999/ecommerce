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
    // Normalize to array: single numbers become [number]
    const toArray = (v: number | number[] | undefined) =>
      v === undefined ? [min] : Array.isArray(v) ? v : [v]

    const [internalValue, setInternalValue] = React.useState(() => toArray(defaultValue))
    const controlledValue = value !== undefined ? toArray(value) : internalValue

    function handleValueChange(newValue: number[]) {
      if (value === undefined) setInternalValue(newValue)
      onChange?.(newValue)
    }

    // We keep this overall slider pointer drag state for any visual parent needs,
    // but the actual tooltip hover states are handled per thumb
    const [sliderDragging, setSliderDragging] = React.useState(false)

    // For display at the end of track, just join the values
    const displayValue = controlledValue
      .map((v) => (formatLabel ? formatLabel(v) : String(v)))
      .join(' - ')

    // calculate standard percentage for range track
    const trackStart =
      controlledValue.length > 1 ? ((controlledValue[0] - min) / (max - min)) * 100 : 0
    const trackEnd =
      controlledValue.length > 1
        ? ((controlledValue[1] - min) / (max - min)) * 100
        : ((controlledValue[0] - min) / (max - min)) * 100

    return (
      <SliderPrimitive.Root
        ref={ref}
        min={min}
        max={max}
        step={step}
        value={controlledValue}
        onValueChange={handleValueChange}
        onPointerDown={() => {
          setSliderDragging(true)
        }}
        onPointerUp={() => {
          setSliderDragging(false)
        }}
        onPointerLeave={() => {
          setSliderDragging(false)
        }}
        disabled={disabled}
        className={cn(
          'relative flex w-full touch-none select-none items-center py-3',
          disabled && 'opacity-50 cursor-not-allowed',
          className,
        )}
        {...props}
      >
        <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-muted group-hover:h-2.5 transition-all duration-[var(--motion-normal)]">
          <SliderPrimitive.Range
            className="absolute h-full bg-brand"
            style={
              {
                left: 'var(--slider-range-start)',
                right: 'var(--slider-range-end)',
                '--slider-range-start': `${String(trackStart)}%`,
                '--slider-range-end': `${String(100 - trackEnd)}%`,
              } as React.CSSProperties
            }
          />
        </SliderPrimitive.Track>

        {showTicks &&
          Array.from({ length: tickCount }, (_, i) => {
            const tickValue = min + ((max - min) / (tickCount - 1)) * i
            const tickPercent = ((tickValue - min) / (max - min)) * 100
            return (
              <div
                key={i}
                className="absolute top-1/2 h-1 w-px bg-muted-foreground/30 left-[var(--slider-tick-position,0%)]"
                style={
                  { '--slider-tick-position': `${String(tickPercent)}%` } as React.CSSProperties
                }
              />
            )
          })}

        {controlledValue.map((val, index) => (
          <SliderThumb
            key={index}
            value={val}
            formatLabel={formatLabel}
            showTooltip={showTooltip}
            sliderDragging={sliderDragging}
          />
        ))}

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

// Extracted thumb component to handle independent hover states without re-rendering everything
function SliderThumb({
  value,
  formatLabel,
  showTooltip,
  sliderDragging,
}: {
  value: number
  formatLabel?: (value: number) => string
  showTooltip: boolean
  sliderDragging: boolean
}) {
  const [isHovered, setIsHovered] = React.useState(false)
  const [isDragging, setIsDragging] = React.useState(false)

  const tooltipValue = formatLabel ? formatLabel(value) : String(value)
  const showThumbTooltip = showTooltip && (isDragging || isHovered || sliderDragging)

  return (
    <SliderPrimitive.Thumb
      onMouseEnter={() => {
        setIsHovered(true)
      }}
      onMouseLeave={() => {
        setIsHovered(false)
      }}
      onPointerDown={() => {
        setIsDragging(true)
      }}
      onPointerUp={() => {
        setIsDragging(false)
      }}
      onPointerCancel={() => {
        setIsDragging(false)
      }}
      className={cn(
        'relative block h-6 w-6 rounded-full border-[2.5px] border-brand bg-[var(--surface-base)]',
        'shadow-[var(--slider-thumb-shadow-rest)]',
        'transition-all duration-[var(--motion-fast)] ease-[var(--motion-ease-default)]',
        'hover:shadow-[var(--slider-thumb-shadow-hover)] hover:scale-[1.10]',
        'active:shadow-[var(--slider-thumb-shadow-active)] active:scale-[1.05] active:cursor-grabbing',
        'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/20',
        'disabled:pointer-events-none disabled:opacity-50',
        'cursor-grab flex items-center justify-center',
        (isDragging || isHovered) && 'scale-[1.10] shadow-[var(--slider-thumb-shadow-dragging)]',
      )}
      aria-label={formatLabel ? formatLabel(value) : undefined}
    >
      {/* Premium minimal grip lines */}
      <div className="flex gap-1">
        <div className="h-2 w-0.5 rounded-full bg-brand/40" />
        <div className="h-2 w-0.5 rounded-full bg-brand/40" />
      </div>

      {showThumbTooltip && (
        <div
          className={cn(
            'absolute bottom-9 left-1/2 -translate-x-1/2 pointer-events-none z-10',
            'bg-[var(--text-primary)] text-[var(--surface-base)] text-xs font-semibold px-2.5 py-1 rounded-md whitespace-nowrap',
            'shadow-[var(--elevation-floating)]',
            isDragging || isHovered
              ? 'animate-in fade-in-0 zoom-in-95 duration-[var(--motion-fast)]'
              : 'opacity-0 transition-opacity duration-[var(--motion-normal)]',
          )}
        >
          {tooltipValue}
          <div className="absolute -bottom-[3px] left-1/2 -translate-x-1/2 w-2 h-2 bg-[var(--text-primary)] rotate-45" />
        </div>
      )}
    </SliderPrimitive.Thumb>
  )
}

export { Slider }
