'use client'

import { cn } from '@ecom/ui'

// ─── Client leaf: single variant option (pill/color/image) ───────────────────
export interface VariantOptionProps {
  value: string
  label: string
  type: 'pill' | 'color' | 'image'
  isSelected: boolean
  isDisabled?: boolean
  color?: string
  image?: string
  onClick: (value: string) => void
}

export function VariantOption({
  value,
  label,
  type,
  isSelected,
  isDisabled = false,
  color,
  image,
  onClick,
}: VariantOptionProps) {
  if (type === 'color') {
    return (
      <button
        type="button"
        role="radio"
        aria-checked={isSelected}
        disabled={isDisabled}
        onClick={() => !isDisabled && onClick(value)}
        className={cn(
          'relative w-10 h-10 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'transition-all duration-[var(--motion-fast)] ease-[var(--motion-ease-default)]',
          isSelected
            ? 'ring-2 ring-brand ring-offset-2 ring-offset-background scale-110 shadow-sm'
            : 'ring-1 ring-border hover:ring-foreground/50 hover:scale-105',
          isDisabled && 'opacity-50 cursor-not-allowed hover:scale-100 hover:ring-border',
        )}
        title={label}
      >
        <span
          className="absolute inset-0.5 rounded-full border border-border/50"
          style={{ backgroundColor: color || value }}
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
        type="button"
        role="radio"
        aria-checked={isSelected}
        disabled={isDisabled}
        onClick={() => !isDisabled && onClick(value)}
        className={cn(
          'relative w-16 h-16 rounded-[var(--radius-md)] overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'transition-all duration-[var(--motion-fast)] ease-[var(--motion-ease-default)]',
          isSelected
            ? 'ring-2 ring-brand ring-offset-2 ring-offset-background shadow-sm'
            : 'ring-1 ring-border hover:ring-foreground/50',
          isDisabled && 'opacity-50 cursor-not-allowed hover:ring-border',
        )}
        title={label}
      >
        <img src={image || '/placeholder.jpg'} alt={label} className="w-full h-full object-cover" />
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
      type="button"
      role="radio"
      aria-checked={isSelected}
      disabled={isDisabled}
      onClick={() => !isDisabled && onClick(value)}
      className={cn(
        'min-w-[3rem] h-10 px-4 rounded-[var(--radius-sm)] border text-[var(--text-sm)] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'transition-all duration-[var(--motion-fast)] ease-[var(--motion-ease-default)]',
        isSelected
          ? 'bg-foreground text-background border-foreground shadow-[var(--elevation-card)] ring-2 ring-foreground/20 ring-offset-1'
          : 'bg-background text-foreground border-border hover:border-foreground hover:bg-muted/30',
        isDisabled && 'opacity-50 cursor-not-allowed hover:border-border hover:bg-transparent bg-muted/50',
      )}
    >
      {label}
    </button>
  )
}