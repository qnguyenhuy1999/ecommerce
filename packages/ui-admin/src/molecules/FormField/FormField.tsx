'use client'

import React, { useId, useMemo } from 'react'

import { CheckCircle2, AlertCircle } from 'lucide-react'

import { cn, Label } from '@ecom/ui'

export interface CharacterCount {
  current: number
  max: number
  /** Threshold (0–1) at which the counter turns amber. Default: 0.9 */
  warnAt?: number
}

export interface FormFieldProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'children' | 'prefix'
> {
  /** Field label text */
  label: string
  /** Descriptive / helper text shown below the input */
  description?: React.ReactNode
  /** Error message — triggers error state */
  error?: string
  /** Success state. Pass `true` for checkmark only, or a string to also show that text. */
  success?: boolean | string
  /** Marks the field as required — adds an asterisk to the label */
  required?: boolean
  /** Associates the label with the input element */
  htmlFor?: string
  /** Shows a live character count (e.g. `{ current: 42, max: 200 }`) */
  characterCount?: CharacterCount
  /** Field size (controls gap spacing) */
  size?: 'sm' | 'md' | 'lg'
  /** Icon rendered to the left of the input text */
  leadingIcon?: React.ReactNode
  /** Icon rendered to the right of the input text */
  trailingIcon?: React.ReactNode
  /** Small element rendered next to the label (e.g. tooltip trigger) */
  hint?: React.ReactNode
  /** Disables the entire field visually */
  disabled?: boolean
  children: React.ReactElement
}

type CharCountState = 'normal' | 'warning' | 'over'

function charCountState(count: CharacterCount): CharCountState {
  if (count.current > count.max) return 'over'
  if (count.current > count.max * (count.warnAt ?? 0.9)) return 'warning'
  return 'normal'
}

const CHAR_COUNT_COLORS: Record<CharCountState, string> = {
  normal: 'text-[var(--text-secondary)]',
  warning: 'text-[var(--intent-warning)]',
  over: 'text-[var(--intent-danger)] font-[var(--font-weight-semibold)]',
}

function HelperText({
  variant,
  children,
}: {
  variant: 'description' | 'error' | 'success'
  children: React.ReactNode
}) {
  return (
    <p
      className={cn(
        'flex items-start gap-1.5',
        'text-[var(--text-sm)] leading-[1.5]',
        'animate-[slide-up_var(--motion-fast)_var(--motion-ease-out)_both]',
        'transition-colors duration-[var(--motion-fast)]',
        variant === 'description' && 'text-[var(--text-secondary)]',
        variant === 'error' && 'text-[var(--intent-danger)] font-[var(--font-weight-medium)]',
        variant === 'success' && 'text-[var(--intent-success)]',
      )}
      role={variant === 'error' ? 'alert' : undefined}
      aria-live={variant === 'error' ? 'polite' : undefined}
    >
      {variant === 'error' && (
        <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" aria-hidden="true" />
      )}
      {children}
    </p>
  )
}

const GAP: Record<string, string> = {
  sm: 'gap-[var(--space-1)]',
  md: 'gap-[var(--space-2)]',
  lg: 'gap-[var(--space-2)]',
}

const ICON_LEFT: Record<string, string> = {
  sm: 'left-[var(--space-2)]',
  md: 'left-[var(--space-3)]',
  lg: 'left-[var(--space-4)]',
}

const ICON_RIGHT: Record<string, string> = {
  sm: 'right-[var(--space-2)]',
  md: 'right-[var(--space-3)]',
  lg: 'right-[var(--space-4)]',
}

const ICON_SIZE: Record<string, string> = {
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
}

const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  (
    {
      label,
      description,
      error,
      success,
      required,
      htmlFor,
      characterCount,
      size = 'md',
      leadingIcon,
      trailingIcon,
      hint,
      disabled,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId()
    const inputId = htmlFor || generatedId
    const descriptionId = `${inputId}-description`
    const errorId = `${inputId}-error`

    const hasError = Boolean(error)
    const hasSuccess = Boolean(success)
    const hasCharCount = Boolean(characterCount)
    const hasLeadingIcon = Boolean(leadingIcon)
    const hasTrailingIcon = Boolean(trailingIcon)
    const hasStatusIcon = (hasError || hasSuccess) && !hasTrailingIcon

    // Build aria-describedby
    const ariaDescribedBy = useMemo(() => {
      const ids: string[] = []
      if (hasError) ids.push(errorId)
      if (description) ids.push(descriptionId)
      return ids.length > 0 ? ids.join(' ') : undefined
    }, [hasError, errorId, description, descriptionId])

    // Clone child to inject accessibility attrs & necessary spacing for absolute icons
    const childClass = React.isValidElement(children)
      ? (children.props as { className?: string }).className
      : undefined

    const child = React.isValidElement(children)
      ? React.cloneElement(
          children as React.ReactElement<React.HTMLAttributes<HTMLElement>>,
          {
            id: inputId,
            'aria-describedby': ariaDescribedBy,
            'aria-invalid': hasError || undefined,
            'aria-required': required,
            disabled,
            className: cn(
              childClass,
              hasLeadingIcon && (size === 'sm' ? 'pl-8' : size === 'lg' ? 'pl-12' : 'pl-10'),
              (hasTrailingIcon || hasStatusIcon) &&
                (size === 'sm' ? 'pr-8' : size === 'lg' ? 'pr-12' : 'pr-10'),
              hasCharCount && !hasTrailingIcon && !hasStatusIcon && 'pr-14',
              hasError && [
                'border-[var(--intent-danger)]',
                'focus-visible:ring-[var(--intent-danger-muted)] focus-visible:ring-2 focus-visible:ring-offset-0',
              ],
              hasSuccess &&
                !hasError && [
                  'border-[var(--intent-success)]',
                  'focus-visible:ring-[var(--intent-success-muted)] focus-visible:ring-2 focus-visible:ring-offset-0',
                ],
            ),
          } as React.HTMLAttributes<HTMLElement>,
        )
      : children

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col',
          GAP[size],
          disabled && 'opacity-[var(--opacity-60)] pointer-events-none select-none',
          className,
        )}
        {...props}
      >
        {/* ── Label row ─────────────────────────────────────────── */}
        <div className="flex items-center justify-between gap-[var(--space-2)]">
          <Label
            htmlFor={inputId}
            className={cn(
              'text-[var(--text-sm)] font-[var(--font-weight-medium)] leading-none',
              'transition-colors duration-[var(--motion-fast)]',
              hasError && 'text-[var(--intent-danger)]',
              hasSuccess && 'text-[var(--intent-success)]',
            )}
          >
            {label}
            {required && (
              <span className="ml-[var(--space-1)] text-[var(--intent-danger)]" aria-hidden="true">
                *
              </span>
            )}
            {hasSuccess && !hasError && (
              <CheckCircle2
                className="ml-[var(--space-1)] w-3.5 h-3.5 text-[var(--intent-success)] inline"
                aria-hidden="true"
              />
            )}
            {hint && <span className="ml-[var(--space-1)] inline-flex align-middle">{hint}</span>}
          </Label>

          {characterCount && (
            <span
              className={cn(
                'text-[var(--text-xs)] tabular-nums transition-colors duration-[var(--motion-fast)]',
                CHAR_COUNT_COLORS[charCountState(characterCount)],
              )}
              aria-live="polite"
            >
              {characterCount.current}/{characterCount.max}
            </span>
          )}
        </div>

        {/* ── Input wrapper ─────────────────────────────────────── */}
        <div className="relative group/form-field">
          {/* Leading icon */}
          {hasLeadingIcon && (
            <span
              aria-hidden
              className={cn(
                'absolute top-1/2 -translate-y-1/2',
                'flex items-center justify-center',
                'pointer-events-none',
                'text-[var(--text-secondary)]',
                ICON_LEFT[size],
                ICON_SIZE[size],
                disabled && 'opacity-[var(--opacity-40)]',
              )}
            >
              {leadingIcon}
            </span>
          )}

          {/* The input */}
          {child}

          {/* Trailing icon */}
          {hasTrailingIcon && (
            <span
              aria-hidden
              className={cn(
                'absolute top-1/2 -translate-y-1/2',
                'flex items-center justify-center',
                'pointer-events-none',
                'text-[var(--text-secondary)]',
                ICON_RIGHT[size],
                ICON_SIZE[size],
                disabled && 'opacity-[var(--opacity-40)]',
              )}
            >
              {trailingIcon}
            </span>
          )}

          {/* Built-in status icon (replaces trailing slot for error/success) */}
          {hasStatusIcon && (
            <span
              aria-hidden
              className={cn(
                'absolute top-1/2 -translate-y-1/2 right-3',
                'flex items-center justify-center',
                'pointer-events-none',
                'animate-[fade-in_var(--motion-fast)_var(--motion-ease-out)_both]',
                hasError ? 'text-[var(--intent-danger)]' : 'text-[var(--intent-success)]',
              )}
            >
              {hasError ? (
                <AlertCircle className="w-4 h-4" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
            </span>
          )}

          {/* Inline char count (fades in on focus-within) */}
          {characterCount && (
            <span
              aria-hidden
              className={cn(
                'absolute right-3 top-1/2 -translate-y-1/2',
                'pointer-events-none',
                // Hidden until field is focused
                'opacity-0 group-focus-within/form-field:opacity-100',
                'transition-opacity duration-[var(--motion-fast)]',
                CHAR_COUNT_COLORS[charCountState(characterCount)],
              )}
            >
              <span className="text-[var(--text-xs)] font-[var(--font-weight-medium)] tabular-nums">
                {characterCount.current}/{characterCount.max}
              </span>
            </span>
          )}
        </div>

        {/* ── Helper / error / description text ─────────────────── */}
        {(description || error || (hasSuccess && typeof success === 'string')) && (
          <div className={cn('flex flex-col', GAP[size])}>
            {hasError && <HelperText variant="error">{error}</HelperText>}
            {!hasError && hasSuccess && typeof success === 'string' && (
              <HelperText variant="success">{success}</HelperText>
            )}
            {!hasError && description && (
              <HelperText variant="description">{description}</HelperText>
            )}
          </div>
        )}
      </div>
    )
  },
)

FormField.displayName = 'FormField'

export { FormField }
