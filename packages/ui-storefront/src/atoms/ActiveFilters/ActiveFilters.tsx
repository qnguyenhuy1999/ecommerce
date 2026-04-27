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
      <span className="flex shrink-0 items-center gap-1.5 text-[var(--text-xs)] font-medium text-[var(--text-tertiary)]">
        <SlidersHorizontal className="h-3.5 w-3.5" />
        Active filters:
      </span>

      {filters.map((filter) => (
        <button
          key={`${filter.key}-${filter.value}`}
          type="button"
          onClick={() => onRemove(filter.key, filter.value)}
          aria-label={`Remove filter: ${filter.label} ${filter.value}`}
          className={cn(
            'group inline-flex items-center gap-1.5 rounded-full border border-[var(--border-default)] bg-[var(--surface-base)] px-2.5 py-1',
            'text-[length:var(--text-xs)] font-medium text-[var(--text-primary)] shadow-[var(--elevation-xs)]',
            'transition-all duration-[var(--motion-fast)]',
            'hover:border-[var(--intent-danger)] hover:bg-[var(--intent-danger-muted)]/50 hover:text-[var(--intent-danger)]',
          )}
        >
          <span className="text-[var(--text-tertiary)] group-hover:text-[var(--intent-danger)]">
            {filter.label}:
          </span>
          <span>{filter.value}</span>
          <X className="h-3 w-3 shrink-0 text-[var(--text-tertiary)] group-hover:text-[var(--intent-danger)]" />
        </button>
      ))}

      <Button
        variant="ghost"
        size="sm"
        onClick={onClearAll}
        className="h-8 rounded-full px-3 text-[length:var(--text-xs)] text-[var(--text-tertiary)] hover:bg-[var(--intent-danger-muted)]/40 hover:text-[var(--intent-danger)]"
      >
        Clear all
      </Button>
    </div>
  )
}

export { ActiveFilters }
