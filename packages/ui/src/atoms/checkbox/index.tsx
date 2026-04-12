import React from 'react'
import { cn } from '../../lib/utils'

export interface CheckboxProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'onChange'
> {
  onCheckedChange?: (checked: boolean) => void
  onChange?: React.InputHTMLAttributes<HTMLInputElement>['onChange']
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, onCheckedChange, onChange, ...props }, ref) => {
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      onChange?.(e)
      onCheckedChange?.(e.target.checked)
    }
    return (
      <input
        type="checkbox"
        className={cn(
          'h-4 w-4 rounded-[4px] border border-input shadow-sm',
          'accent-[var(--color-brand)]',
          'transition-[border-color,box-shadow] duration-[150ms]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'cursor-pointer',
          className,
        )}
        ref={ref}
        onChange={handleChange}
        {...props}
      />
    )
  },
)
Checkbox.displayName = 'Checkbox'

export { Checkbox }
