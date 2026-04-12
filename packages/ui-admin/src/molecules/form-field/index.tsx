import React from 'react'
import { cn, Label } from '@ecom/ui'

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  description?: React.ReactNode
  error?: string
  required?: boolean
  htmlFor?: string
  children: React.ReactNode
}

const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  ({ label, description, error, required, htmlFor, children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('space-y-2', className)} {...props}>
        <div className="flex items-center justify-between">
          <Label htmlFor={htmlFor} className={cn(error && 'text-destructive')}>
            {label}
            {required && <span className="ml-1 text-destructive">*</span>}
          </Label>
        </div>

        {children}

        {(description || error) && (
          <p
            className={cn(
              'text-[13px]',
              error ? 'text-destructive font-medium' : 'text-muted-foreground',
            )}
          >
            {error || description}
          </p>
        )}
      </div>
    )
  },
)

FormField.displayName = 'FormField'

export { FormField }
