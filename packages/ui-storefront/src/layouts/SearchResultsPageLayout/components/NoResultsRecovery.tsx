import { Compass, Search } from 'lucide-react'

import { Button } from '@ecom/ui'
import { cn } from '@ecom/ui/utils'

import { EmptyStateCard } from '../../shared/EmptyStateCard'

export interface NoResultsRecoveryProps {
  query: string
  hasActiveFilters: boolean
  onClearFilters?: () => void
  onBrowseAll?: () => void
  relatedQueries?: string[]
  onRelatedQuerySelect?: (q: string) => void
}

export function NoResultsRecovery({
  query,
  hasActiveFilters,
  onClearFilters,
  onBrowseAll,
  relatedQueries = [],
  onRelatedQuerySelect,
}: NoResultsRecoveryProps) {
  return (
    <EmptyStateCard className="flex flex-col items-center text-center">
      <div
        className={cn(
          'mb-4 flex h-14 w-14 items-center justify-center rounded-full',
          'bg-[var(--surface-base)] shadow-[var(--elevation-xs)]',
        )}
      >
        <Search className="h-6 w-6 text-[var(--text-tertiary)]" aria-hidden="true" />
      </div>
      <h2 className="text-[length:var(--font-size-heading-md)] font-semibold tracking-[-0.01em] text-[var(--text-primary)]">
        No results for &ldquo;{query}&rdquo;
      </h2>
      <p className="mt-2 max-w-[44ch] text-sm leading-[var(--line-height-relaxed)] text-[var(--text-secondary)]">
        Try removing a filter, checking spelling, or using a more general term.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        {hasActiveFilters && onClearFilters && (
          <Button variant="outline" size="sm" onClick={onClearFilters}>
            Clear filters
          </Button>
        )}
        {onBrowseAll && (
          <Button size="sm" onClick={onBrowseAll}>
            <Compass className="mr-1.5 h-4 w-4" aria-hidden="true" />
            Browse all products
          </Button>
        )}
      </div>

      {relatedQueries.length > 0 && (
        <div className="mt-8 w-full max-w-md">
          <p className="mb-3 text-[length:var(--text-xs)] font-semibold uppercase tracking-[0.14em] text-[var(--text-tertiary)]">
            Did you mean
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {relatedQueries.map((q) => (
              <button
                key={`recovery-${q}`}
                type="button"
                onClick={() => onRelatedQuerySelect?.(q)}
                className={cn(
                  'inline-flex items-center rounded-full',
                  'border border-[var(--border-subtle)] bg-[var(--surface-base)]',
                  'px-3 py-1.5',
                  'text-[length:var(--text-xs)] font-medium text-[var(--text-secondary)]',
                  'transition-colors duration-[var(--motion-fast)]',
                  'hover:border-[var(--border-default)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]',
                )}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}
    </EmptyStateCard>
  )
}
