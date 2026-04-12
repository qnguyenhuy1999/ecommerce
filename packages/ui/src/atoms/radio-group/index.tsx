'use client'

import * as React from 'react'
import { cn } from '../../lib/utils'

interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string
  onValueChange?: (value: string) => void
  orientation?: 'horizontal' | 'vertical'
  name?: string
}

interface RadioGroupItemProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string
  label?: string
}

const RadioGroupContext = React.createContext<{
  value?: string
  onValueChange?: (value: string) => void
  name?: string
}>({})

function RadioGroup({
  value,
  onValueChange,
  orientation = 'vertical',
  name,
  className,
  children,
  ...props
}: RadioGroupProps) {
  return (
    <RadioGroupContext.Provider value={{ value, onValueChange, name }}>
      <div
        role="radiogroup"
        className={cn(
          orientation === 'vertical' ? 'flex flex-col gap-2.5' : 'flex flex-wrap gap-4',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </RadioGroupContext.Provider>
  )
}
RadioGroup.displayName = 'RadioGroup'

const RadioGroupItem = React.forwardRef<HTMLInputElement, RadioGroupItemProps>(
  ({ value: itemValue, label, className, id, ...props }, ref) => {
    const ctx = React.useContext(RadioGroupContext)
    const isChecked = ctx.value === itemValue
    const inputId = id || `radio-${itemValue}`

    return (
      <div className={cn('flex items-center gap-2', className)}>
        <div className="relative flex items-center justify-center">
          <input
            ref={ref}
            type="radio"
            name={ctx.name}
            id={inputId}
            value={itemValue}
            checked={isChecked}
            onChange={() => ctx.onValueChange?.(itemValue)}
            className={cn(
              'peer h-4 w-4 appearance-none rounded-full border border-input',
              'cursor-pointer',
              'transition-[border-color,box-shadow] duration-[150ms]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'checked:border-brand',
            )}
            {...props}
          />
          <div
            className={cn(
              'pointer-events-none absolute h-2 w-2 rounded-full bg-brand',
              'transition-transform duration-[150ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]',
              isChecked ? 'scale-100' : 'scale-0',
            )}
          />
        </div>
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
          </label>
        )}
      </div>
    )
  },
)
RadioGroupItem.displayName = 'RadioGroupItem'

export { RadioGroup, RadioGroupItem }
export type { RadioGroupProps, RadioGroupItemProps }
