'use client'

import { forwardRef, useState } from 'react'
import { formatNumber } from '@ecom/shared/utils/format'
import { cn } from '../../lib/utils'
import type { NumberInputProps } from './NumberInput.types'

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  ({ value, onChange, min, max, step, locale, className, onBlur, onFocus, ...props }, ref) => {
    const [focused, setFocused] = useState(false)

    const displayValue =
      !focused && value !== '' && value != null
        ? formatNumber(Number(value), locale)
        : (value ?? '')

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      const raw = e.target.value.replace(/[^0-9.-]/g, '')
      if (raw === '' || raw === '-') {
        onChange('')
        return
      }
      const num = Number(raw)
      if (!Number.isNaN(num)) {
        if (min != null && num < min) return
        if (max != null && num > max) return
        onChange(num)
      }
    }

    function handleFocus(e: React.FocusEvent<HTMLInputElement>) {
      setFocused(true)
      onFocus?.(e)
    }

    function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
      setFocused(false)
      onBlur?.(e)
    }

    return (
      <input
        ref={ref}
        data-slot="number-input"
        inputMode="numeric"
        value={String(displayValue)}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        step={step}
        className={cn(
          'border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:bg-input/30 h-9 w-full min-w-0 rounded-md border bg-transparent px-2.5 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-3 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          className,
        )}
        {...props}
      />
    )
  },
)

NumberInput.displayName = 'NumberInput'
