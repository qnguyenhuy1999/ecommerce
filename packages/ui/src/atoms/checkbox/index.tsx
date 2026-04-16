'use client'

import React from 'react'

import { cn } from '../../lib/utils'

export interface CheckboxProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'onChange'
> {
  onCheckedChange?: (checked: boolean) => void
  onChange?: React.InputHTMLAttributes<HTMLInputElement>['onChange']
  /** Show error state */
  error?: boolean
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, onCheckedChange, onChange, error, ...props }, ref) => {
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      onChange?.(e)
      onCheckedChange?.(e.target.checked)
    }
    return (
      <input
        type="checkbox"
        className={cn(
          'h-4 w-4 rounded-[var(--radius-xs)] border cursor-pointer',
          // Color: error state uses destructive, otherwise input border
          error ? 'border-destructive accent-destructive' : 'border-input accent-brand',
          // Shadow
          'shadow-sm',
          // Motion: border + ring using token duration
          'transition-[border-color,box-shadow] duration-[var(--motion-fast)] ease-[var(--motion-ease-default)]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        ref={ref}
        onChange={handleChange}
        aria-invalid={error}
        {...props}
      />
    )
  },
)
Checkbox.displayName = 'Checkbox'

export { Checkbox }
