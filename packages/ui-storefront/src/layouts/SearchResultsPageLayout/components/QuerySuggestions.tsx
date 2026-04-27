import { cn } from '@ecom/ui/utils'

export interface QuerySuggestionsProps {
  relatedQueries?: string[]
  onRelatedQuerySelect?: (query: string) => void
  recentSearches?: string[]
  onRecentQuerySelect?: (query: string) => void
}

export function QuerySuggestions({
  relatedQueries = [],
  onRelatedQuerySelect,
  recentSearches = [],
  onRecentQuerySelect,
}: QuerySuggestionsProps) {
  const hasRelated = relatedQueries.length > 0
  const hasRecent = recentSearches.length > 0
  if (!hasRelated && !hasRecent) return null

  return (
    <div className="flex flex-col gap-2">
      {hasRelated && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[length:var(--text-xs)] font-semibold uppercase tracking-[0.12em] text-[var(--text-tertiary)]">
            Try
          </span>
          {relatedQueries.map((q) => (
            <button
              key={`related-${q}`}
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
      )}
      {hasRecent && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[length:var(--text-xs)] font-semibold uppercase tracking-[0.12em] text-[var(--text-tertiary)]">
            Recent
          </span>
          {recentSearches.map((q) => (
            <button
              key={`recent-${q}`}
              type="button"
              onClick={() => onRecentQuerySelect?.(q)}
              className={cn(
                'inline-flex items-center rounded-full',
                'bg-[var(--surface-subtle)]',
                'px-3 py-1.5',
                'text-[length:var(--text-xs)] font-medium text-[var(--text-secondary)]',
                'transition-colors duration-[var(--motion-fast)]',
                'hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]',
              )}
            >
              {q}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
