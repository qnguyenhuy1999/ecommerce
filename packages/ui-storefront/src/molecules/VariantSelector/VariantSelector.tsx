'use client'

import React from 'react'

import { cn } from '@ecom/ui'

// ─── Option Type ─────────────────────────────────────────────────────────────
export interface VariantOption {
  value: string
  label: string
  disabled?: boolean
  color?: string // For color swatches
  image?: string // For image swatches
}

// ─── VariantSelector ─────────────────────────────────────────────────────────
export interface VariantSelectorProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'onChange'
> {
  name: string
  options: VariantOption[]
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
        <span className="text-[var(--text-sm)] font-medium text-foreground">
          {name}:{' '}
          <span className="text-muted-foreground ml-1">
            {options.find((o) => o.value === value)?.label || ''}
          </span>
        </span>
        {error && (
          <span className="text-[var(--text-micro)] font-medium text-destructive animate-in fade-in slide-in-from-top-1">
            {error}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = value === option.value
          const isDisabled = option.disabled

          if (type === 'color') {
            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={isSelected}
                disabled={isDisabled}
                onClick={() => !isDisabled && onChange?.(option.value)}
                className={cn(
                  'relative w-10 h-10 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                  'transition-all duration-[var(--motion-fast)] ease-[var(--motion-ease-default)]',
                  isSelected
                    ? 'ring-2 ring-brand ring-offset-2 ring-offset-background scale-110 shadow-sm'
                    : 'ring-1 ring-border hover:ring-foreground/50 hover:scale-105',
                  isDisabled && 'opacity-50 cursor-not-allowed hover:scale-100 hover:ring-border',
                )}
                title={option.label}
              >
                <span
                  className="absolute inset-0.5 rounded-full border border-border/50"
                  style={{ backgroundColor: option.color || option.value }}
                />
                {isDisabled && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="w-full h-px bg-muted-foreground rotate-45 transform origin-center" />
                  </span>
                )}
              </button>
            )
          }

          if (type === 'image') {
            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={isSelected}
                disabled={isDisabled}
                onClick={() => !isDisabled && onChange?.(option.value)}
                className={cn(
                  'relative w-16 h-16 rounded-[var(--radius-md)] overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                  'transition-all duration-[var(--motion-fast)] ease-[var(--motion-ease-default)]',
                  isSelected 
                    ? 'ring-2 ring-brand ring-offset-2 ring-offset-background shadow-sm' 
                    : 'ring-1 ring-border hover:ring-foreground/50',
                  isDisabled && 'opacity-50 cursor-not-allowed hover:ring-border',
                )}
                title={option.label}
              >
                <img
                  src={option.image || '/placeholder.jpg'}
                  alt={option.label}
                  className="w-full h-full object-cover"
                />
                {isDisabled && (
                  <div className="absolute inset-0 bg-background/50 flex items-center justify-center backdrop-blur-[var(--space-1)]">
                    <span className="text-[var(--space-3)] font-bold text-foreground">N/A</span>
                  </div>
                )}
              </button>
            )
          }

          // Default pill
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={isDisabled}
              onClick={() => !isDisabled && onChange?.(option.value)}
              className={cn(
                'min-w-[3rem] h-10 px-4 rounded-[var(--radius-sm)] border text-[var(--text-sm)] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                'transition-all duration-[var(--motion-fast)] ease-[var(--motion-ease-default)]',
                isSelected
                  ? 'bg-foreground text-background border-foreground shadow-[var(--elevation-card)] ring-2 ring-foreground/20 ring-offset-1'
                  : 'bg-background text-foreground border-border hover:border-foreground hover:bg-muted/30',
                isDisabled && 'opacity-50 cursor-not-allowed hover:border-border hover:bg-transparent bg-muted/50',
              )}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export { VariantSelector }
