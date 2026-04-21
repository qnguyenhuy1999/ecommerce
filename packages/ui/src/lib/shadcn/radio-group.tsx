'use client'

import * as React from 'react'

import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'

import { cn } from '../../lib/utils'

interface RadioGroupProps extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> {
  value?: string
  onValueChange?: (value: string) => void
  orientation?: 'horizontal' | 'vertical'
}

interface RadioGroupItemProps extends Omit<
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>,
  'value'
> {
  value: string
  label?: string
}

const RadioGroup = React.forwardRef<
  React.ComponentRef<typeof RadioGroupPrimitive.Root>,
  RadioGroupProps
>(({ value, onValueChange, orientation = 'vertical', className, ...props }, ref) => (
  <RadioGroupPrimitive.Root
    ref={ref}
    value={value}
    onValueChange={onValueChange}
    orientation={orientation}
    className={cn(
      orientation === 'vertical' ? 'flex flex-col gap-2.5' : 'flex flex-wrap gap-4',
      className,
    )}
    {...props}
  />
))
RadioGroup.displayName = 'RadioGroup'

const RadioGroupItem = React.forwardRef<
  React.ComponentRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupItemProps
>(({ value: itemValue, label, className, id, ...props }, ref) => {
  const inputId = id || `radio-${itemValue}`

  return (
    <div className="flex items-center gap-2">
      <RadioGroupPrimitive.Item
        ref={ref}
        id={inputId}
        value={itemValue}
        className={cn(
          'h-4 w-4 rounded-full border border-input text-brand',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'transition-colors duration-[var(--motion-fast)] ease-[var(--motion-ease-default)]',
          className,
        )}
        {...props}
      >
        <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
          <div className="h-2 w-2 rounded-full bg-brand" />
        </RadioGroupPrimitive.Indicator>
      </RadioGroupPrimitive.Item>
      {label && (
        <label
          htmlFor={inputId}
          className="cursor-pointer text-sm text-foreground select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
        </label>
      )}
    </div>
  )
})
RadioGroupItem.displayName = 'RadioGroupItem'

export { RadioGroup, RadioGroupItem }
export type { RadioGroupProps, RadioGroupItemProps }
