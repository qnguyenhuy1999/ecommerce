'use client'

import React, { useMemo } from 'react'

import { AlertCircle, CheckCircle2 } from 'lucide-react'

import { cn } from '@ecom/ui'

export interface CharacterCount {
  current: number
  max: number
  warnAt?: number
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

interface FormFieldClientProps {
  inputId: string
  descriptionId: string
  errorId: string
  hasError: boolean
  hasSuccess: boolean
  hasCharCount: boolean
  hasLeadingIcon: boolean
  hasTrailingIcon: boolean
  hasStatusIcon: boolean
  characterCount?: CharacterCount
  size: 'sm' | 'md' | 'lg'
  disabled?: boolean
  required?: boolean
  leadingIcon?: React.ReactNode
  trailingIcon?: React.ReactNode
  children: React.ReactElement
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

function FormFieldClient({
  inputId,
  descriptionId,
  errorId,
  hasError,
  hasSuccess,
  hasCharCount,
  hasLeadingIcon,
  hasTrailingIcon,
  hasStatusIcon,
  characterCount,
  size,
  disabled,
  required,
  leadingIcon,
  trailingIcon,
  children,
}: FormFieldClientProps) {
  const ariaDescribedBy = useMemo(() => {
    const ids: string[] = []
    if (hasError) ids.push(errorId)
    if (descriptionId) ids.push(descriptionId)
    return ids.length > 0 ? ids.join(' ') : undefined
  }, [hasError, errorId, descriptionId])

  const childClass = (children.props as { className?: string }).className

  const child = React.cloneElement(
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

  return (
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
  )
}

export { FormFieldClient }
