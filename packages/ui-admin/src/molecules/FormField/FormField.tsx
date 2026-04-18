import React, { useId } from 'react'

import { CheckCircle2 } from 'lucide-react'

import { cn, Label } from '@ecom/ui'

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  description?: React.ReactNode
  error?: string
  success?: boolean
  required?: boolean
  htmlFor?: string
  characterCount?: { current: number; max: number }
  children: React.ReactElement
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

    const child = React.isValidElement(children)
      ? React.cloneElement(children as React.ReactElement<React.HTMLAttributes<HTMLElement>>, {
          id: inputId,
          'aria-describedby': cn(
            error ? errorId : undefined,
            description ? descriptionId : undefined,
          ),
          'aria-invalid': !!error,
          className: cn(
            (children as React.ReactElement<{ className?: string }>).props.className,
            error && 'border-destructive focus-visible:ring-destructive',
            success && 'border-success focus-visible:ring-success',
          ),
        })
      : children

    return (
      <div ref={ref} className={cn('space-y-2', className)} {...props}>
        <div className="flex items-center justify-between">
          <Label
            htmlFor={inputId}
            className={cn(
              error && 'text-destructive',
              success && 'text-success flex items-center gap-1.5',
            )}
          >
            {label}
            {required && <span className="ml-1 text-destructive">*</span>}
            {success && <CheckCircle2 className="w-3.5 h-3.5 inline-block text-success" />}
          </Label>

          {characterCount && (
            <span
              className={cn(
                'text-[var(--space-3)] font-medium transition-colors',
                characterCount.current > characterCount.max
                  ? 'text-destructive'
                  : 'text-muted-foreground',
              )}
            >
              {characterCount.current} / {characterCount.max}
            </span>
          )}
        </div>

        {child}

        {(description || error) && (
          <div className="flex flex-col gap-1">
            {error && (
              <p
                id={errorId}
                className="text-[var(--space-4)] text-destructive font-medium animate-in slide-in-from-top-1 fade-in duration-[var(--motion-fast)]"
              >
                {error}
              </p>
            )}
            {description && !error && (
              <p
                id={descriptionId}
                className="text-[var(--space-4)] text-muted-foreground animate-in slide-in-from-top-1 fade-in duration-[var(--motion-fast)]"
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
