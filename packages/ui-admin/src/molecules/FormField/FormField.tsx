import React, { useId } from 'react'

import { AlertCircle, CheckCircle2 } from 'lucide-react'

import { cn, Label } from '@ecom/ui'

import { FormFieldClient } from './FormFieldClient'
import type { CharacterCount } from './FormFieldClient'

export interface FormFieldProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'children' | 'prefix'
> {
  label: string
  description?: React.ReactNode
  error?: string
  success?: boolean | string
  required?: boolean
  htmlFor?: string
  characterCount?: CharacterCount
  size?: 'sm' | 'md' | 'lg'
  leadingIcon?: React.ReactNode
  trailingIcon?: React.ReactNode
  hint?: React.ReactNode
  disabled?: boolean
  children: React.ReactElement
}

const GAP: Record<string, string> = {
  sm: 'gap-[var(--space-1)]',
  md: 'gap-[var(--space-2)]',
  lg: 'gap-[var(--space-2)]',
}

function charCountColor(current: number, max: number): string {
  if (current > max) return 'text-[var(--intent-danger)] font-[var(--font-weight-semibold)]'
  if (current > max * 0.9) return 'text-[var(--intent-warning)]'
  return 'text-[var(--text-secondary)]'
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
                charCountColor(characterCount.current, characterCount.max),
              )}
              aria-live="polite"
            >
              {characterCount.current}/{characterCount.max}
            </span>
          )}
        </div>

        {/* ── Input with icons (client leaf) ───────────────────── */}
        <FormFieldClient
          inputId={inputId}
          descriptionId={descriptionId}
          errorId={errorId}
          hasError={hasError}
          hasSuccess={hasSuccess}
          hasCharCount={hasCharCount}
          hasLeadingIcon={hasLeadingIcon}
          hasTrailingIcon={hasTrailingIcon}
          hasStatusIcon={hasStatusIcon}
          characterCount={characterCount}
          size={size}
          disabled={disabled}
          required={required}
          leadingIcon={leadingIcon}
          trailingIcon={trailingIcon}
        >
          {children}
        </FormFieldClient>

        {/* ── Helper / error / description text ─────────────────── */}
        {(description || error || (hasSuccess && typeof success === 'string')) && (
          <div className={cn('flex flex-col rounded-[var(--radius-md)] bg-[var(--surface-elevated)]/65 px-3 py-2', GAP[size])}>
            {hasError && (
              <p
                className={cn(
                  'flex items-start gap-1.5',
                  'text-[var(--text-sm)] leading-[1.5]',
                  'animate-[slide-up_var(--motion-fast)_var(--motion-ease-out)_both]',
                  'transition-colors duration-[var(--motion-fast)]',
                  'text-[var(--intent-danger)] font-[var(--font-weight-medium)]',
                )}
                role="alert"
                aria-live="polite"
              >
                <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" aria-hidden="true" />
                {error}
              </p>
            )}
            {!hasError && hasSuccess && typeof success === 'string' && (
              <p
                className={cn(
                  'flex items-start gap-1.5',
                  'text-[var(--text-sm)] leading-[1.5]',
                  'animate-[slide-up_var(--motion-fast)_var(--motion-ease-out)_both]',
                  'transition-colors duration-[var(--motion-fast)]',
                  'text-[var(--intent-success)]',
                )}
              >
                {success}
              </p>
            )}
            {!hasError && description && (
              <p
                className={cn(
                  'flex items-start gap-1.5',
                  'text-[var(--text-sm)] leading-[1.5]',
                  'animate-[slide-up_var(--motion-fast)_var(--motion-ease-out)_both]',
                  'transition-colors duration-[var(--motion-fast)]',
                  'text-[var(--text-secondary)]',
                )}
              >
                {description}
              </p>
            )}
          </div>
        )}
      </div>
    )
  },
)

FormField.displayName = 'FormField'

export { FormField }
