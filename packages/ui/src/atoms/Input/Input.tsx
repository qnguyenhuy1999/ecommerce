'use client'

import React from 'react'

import { cn } from '../../lib/utils'
import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner'

export interface InputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'prefix' | 'size'
> {
  error?: boolean
  prefixIcon?: React.ReactNode
  suffixIcon?: React.ReactNode
  /** Show a loading spinner in place of suffixIcon */
  loading?: boolean
  containerClassName?: string
  /** Floating label text */
  label?: string
  /** Show character count based on maxLength and value */
  showCount?: boolean
  /** Input size */
  size?: 'sm' | 'default' | 'lg'
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      containerClassName,
      type,
      error,
      prefixIcon,
      suffixIcon,
      loading,
      label,
      showCount,
      size = 'default',
      maxLength,
      value,
      defaultValue,
      onChange,
      ...props
    },
    ref,
  ) => {
    const hasIcon = prefixIcon || suffixIcon || loading || label || showCount

    // For character count, we need to track value if uncontrolled
    const isControlled = value !== undefined
    const [internalValue, setInternalValue] = React.useState(defaultValue || '')
    const currentValue = isControlled ? value : internalValue

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) setInternalValue(e.target.value)
      onChange?.(e)
    }

    const resolvedSuffixIcon = loading ? <LoadingSpinner size="sm" /> : suffixIcon

    const sizeClasses = {
      sm: 'h-8 text-[var(--text-xs)]',
      default: 'h-10 text-[var(--text-sm)]',
      lg: 'h-12 text-[var(--text-base)]',
    }[size]

    // If floating label is used, we need placeholder to be non-empty for CSS :placeholder-shown to work
    const resolvedPlaceholder = label && !props.placeholder ? ' ' : props.placeholder

    const inputElement = (
      <input
        type={type}
        className={cn(
          'peer flex w-full rounded-[var(--radius-sm)] border bg-transparent',
          sizeClasses,
          // Default border: destructive for error, input color otherwise
          error ? 'border-destructive' : 'border-input',
          // Typography
          'py-2 text-foreground shadow-[var(--elevation-xs)]',
          // Padding left
          prefixIcon ? 'pl-10' : 'pl-3',
          // Padding right
          suffixIcon || loading ? 'pr-10' : 'pr-3',
          label && 'pt-4 pb-1', // Extra top padding for floating label
          // Shadow only on focus — not at rest
          'focus:shadow-[var(--elevation-card)] focus:bg-background',
          // Transitions: border + shadow for focus feedback
          'transition-[border-color,box-shadow,padding] duration-[var(--motion-fast)] ease-[var(--motion-ease-default)]',
          'file:border-0 file:bg-transparent file:font-medium file:text-foreground',
          'placeholder:text-muted-foreground',
          label && 'placeholder:text-transparent focus:placeholder:text-muted-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          // Error: stronger ring on focus
          error && 'focus-visible:ring-destructive',
          className,
        )}
        ref={ref}
        aria-invalid={error}
        maxLength={maxLength}
        value={value}
        defaultValue={defaultValue}
        onChange={handleChange}
        placeholder={resolvedPlaceholder}
        {...props}
      />
    )

    if (!hasIcon) {
      return inputElement
    }

    return (
      <div className="w-full">
        <div className={cn('relative w-full', containerClassName)}>
          {prefixIcon && (
            <div
              className={cn(
                'pointer-events-none absolute left-3 top-1/2 flex -translate-y-1/2 items-center justify-center',
                'text-muted-foreground',
                'transition-colors duration-[var(--motion-fast)] ease-[var(--motion-ease-default)]',
                '[&>svg]:size-4',
                error && 'text-destructive',
              )}
              aria-hidden="true"
            >
              {prefixIcon}
            </div>
          )}
          {inputElement}
          {label && (
            <label
              className={cn(
                'absolute left-3 text-muted-foreground transition-all duration-[var(--motion-fast)] ease-[var(--motion-ease-default)] pointer-events-none',
                'peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-[var(--text-sm)]',
                'peer-focus:top-2 peer-focus:-translate-y-1/2 peer-focus:text-[var(--space-3)] peer-focus:text-brand',
                // If not placeholder shown, it's floating
                'top-2 -translate-y-1/2 text-[var(--space-3)]',
                prefixIcon ? 'left-10' : 'left-3',
                error && 'peer-focus:text-destructive text-destructive',
              )}
            >
              {label}
            </label>
          )}
          {resolvedSuffixIcon && (
            <div
              className={cn(
                'absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center',
                'transition-colors duration-[var(--motion-fast)] ease-[var(--motion-ease-default)]',
                error ? 'text-destructive' : 'text-muted-foreground',
                '[&>svg]:size-4',
              )}
              aria-hidden="true"
            >
              {resolvedSuffixIcon}
            </div>
          )}
        </div>
        {showCount && maxLength && (
          <div
            className={cn(
              'text-[var(--space-3)] text-right mt-1',
              String(currentValue).length >= maxLength
                ? 'text-destructive'
                : 'text-muted-foreground',
            )}
          >
            {String(currentValue).length} / {maxLength}
          </div>
        )}
      </div>
    )
  },
)
Input.displayName = 'Input'

export { Input }
