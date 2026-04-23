'use client'

import { X, SlidersHorizontal } from 'lucide-react'

import { Button, cn } from '@ecom/ui'

export interface ActiveFilter {
  key: string
  label: string
  value: string
}

export interface ActiveFiltersProps {
  filters: ActiveFilter[]
  onRemove: (key: string, value: string) => void
  onClearAll: () => void
  className?: string
}

function ActiveFilters({ filters, onRemove, onClearAll, className }: ActiveFiltersProps) {
  if (filters.length === 0) return null

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <span className="text-[var(--text-xs)] font-medium text-[var(--text-tertiary)] flex items-center gap-1.5 shrink-0">
        <SlidersHorizontal className="w-3.5 h-3.5" />
        Active filters:
      </span>

      {filters.map((filter) => (
        <button
          key={`${filter.key}-${filter.value}`}
          type="button"
          onClick={() => onRemove(filter.key, filter.value)}
          aria-label={`Remove filter: ${filter.label} ${filter.value}`}
          className={cn(
            'inline-flex items-center gap-1.5',
            'px-[var(--space-2-5)] py-[var(--space-1)]',
            'rounded-[var(--radius-full)]',
            'border border-[var(--border-default)]',
            'bg-[var(--surface-base)]',
            'text-[length:var(--text-xs)] font-medium text-[var(--text-primary)]',
            'hover:border-[var(--intent-destructive)] hover:text-[var(--intent-destructive)]',
            'hover:bg-[var(--intent-destructive)]/5',
            'transition-all duration-[var(--motion-fast)]',
            'group cursor-pointer',
          )}
        >
          <span className="text-[var(--text-tertiary)] group-hover:text-[var(--intent-destructive)]">
            {filter.label}:
          </span>
          <span>{filter.value}</span>
          <X className="w-3 h-3 shrink-0 text-[var(--text-tertiary)] group-hover:text-[var(--intent-destructive)]" />
        </button>
      ))}

      <Button
        variant="ghost"
        size="sm"
        onClick={onClearAll}
        className="h-7 px-2.5 text-[length:var(--text-xs)] text-[var(--text-tertiary)] hover:text-[var(--intent-destructive)] hover:bg-[var(--intent-destructive)]/5"
      >
        Clear all
      </Button>
    </div>
  )
}

export { ActiveFilters }
