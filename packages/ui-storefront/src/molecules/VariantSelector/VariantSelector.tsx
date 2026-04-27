'use client'

import React from 'react'

import { cn } from '@ecom/ui/utils'

import { VariantOption } from './VariantOption'

// ─── Option Type ─────────────────────────────────────────────────────────────
export interface VariantOptionType {
  value: string
  label: string
  disabled?: boolean
  color?: string
  image?: string
}

// ─── VariantSelector (client — owns selection state) ────────────────────────
export interface VariantSelectorProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'onChange'
> {
  name: string
  options: VariantOptionType[]
  value?: string
  onChange?: (value: string) => void
  type?: 'pill' | 'color' | 'image'
  error?: string
}

function VariantSelector({
  name,
  options,
  value,
  onChange,
  type = 'pill',
  error,
  className,
  ...props
}: VariantSelectorProps) {
  return (
    <div
      className={cn('flex flex-col gap-3', className)}
      {...props}
      role="radiogroup"
      aria-label={name}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">
          {name}:{' '}
          <span className="text-muted-foreground ml-1">
            {options.find((o) => o.value === value)?.label || ''}
          </span>
        </span>
        {error && (
          <span className="text-[length:var(--text-micro)] font-medium text-destructive animate-in fade-in slide-in-from-top-1">
            {error}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <VariantOption
            key={option.value}
            value={option.value}
            label={option.label}
            type={type}
            isSelected={value === option.value}
            isDisabled={option.disabled}
            color={option.color}
            image={option.image}
            onClick={(v) => onChange?.(v)}
          />
        ))}
      </div>
    </div>
  )
}

// Attach Option as a compound subcomponent for convenience
type VariantSelectorComponent = typeof VariantSelector & {
  Option: typeof VariantOption
}

const VariantSelectorComposite = Object.assign(VariantSelector, {
  Option: VariantOption,
}) as VariantSelectorComponent

export { VariantSelectorComposite as VariantSelector }
