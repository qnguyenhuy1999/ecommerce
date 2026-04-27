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
      sm: 'h-[var(--button-height-sm)] text-sm',
      default: 'h-[var(--button-height-md)] text-sm',
      lg: 'h-[var(--button-height-lg)] text-[length:var(--text-base)]',
    }[size]

    // If floating label is used, we need placeholder to be non-empty for CSS :placeholder-shown to work
    const resolvedPlaceholder = label && !props.placeholder ? ' ' : props.placeholder

    const inputElement = (
      <input
        type={type}
        className={cn(
          'peer flex w-full rounded-[var(--input-radius)] border bg-[var(--input-bg)]',
          sizeClasses,
          // Default border: destructive for error, input color otherwise
          error ? 'border-[var(--intent-danger)]' : 'border-[var(--input-border)]',
          // Typography
          'text-foreground',
          // Padding left
          prefixIcon ? 'pl-10' : 'pl-3',
          // Padding right
          suffixIcon || loading ? 'pr-10' : 'pr-3',
          label && 'pt-4 pb-1', // Extra top padding for floating label
          // Focus state: subtle ring instead of heavy shadow
          'focus-visible:outline-none focus-visible:border-[var(--brand-500)] focus-visible:ring-[var(--focus-ring-width)] focus-visible:ring-[var(--focus-ring-color)] focus-visible:ring-offset-0',
          // Transitions
          'transition-[border-color,box-shadow] duration-[var(--motion-fast)] ease-[var(--motion-ease-default)]',
          'file:border-0 file:bg-transparent file:font-medium file:text-foreground',
          'placeholder:text-[var(--input-placeholder)]',
          label && 'placeholder:text-transparent focus:placeholder:text-[var(--input-placeholder)]',
          'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[var(--surface-disabled)]',
          error &&
            'focus-visible:border-[var(--intent-danger)] focus-visible:ring-[var(--intent-danger-muted)]',
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
                'peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm',
                'peer-focus:top-2 peer-focus:-translate-y-1/2 peer-focus:text-3 peer-focus:text-brand',
                // If not placeholder shown, it's floating
                'top-2 -translate-y-1/2 text-3',
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
              'text-3 text-right mt-1',
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
