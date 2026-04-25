'use client'

import React from 'react'

import { Compass, Search, X } from 'lucide-react'

import { Button, Input, cn } from '@ecom/ui'

import { ActiveFilters } from '../../atoms/ActiveFilters/ActiveFilters'
import type { ActiveFilter } from '../../atoms/ActiveFilters/ActiveFilters'
import { SortDropdown } from '../../atoms/SortDropdown/SortDropdown'
import type { SortOption } from '../../atoms/SortDropdown/SortDropdown'
import type { FilterGroupSpec } from '../../molecules/FilterSidebar/FilterSidebar'
import { CollectionPageLayout } from '../CollectionPageLayout/CollectionPageLayout'
import type { StorefrontFooter } from '../StorefrontFooter/StorefrontFooter'
import type { StorefrontHeader } from '../StorefrontHeader/StorefrontHeader'

export interface SearchResultsPageLayoutProps {
  className?: string
  promoBar?: React.ReactNode
  header?: React.ReactNode
  footer?: React.ReactNode
  headerProps?: React.ComponentProps<typeof StorefrontHeader>
  footerProps?: React.ComponentProps<typeof StorefrontFooter>
  /** The query the user originally searched. */
  query: string
  totalResults: number
  sortValue: string
  sortOptions: SortOption[]
  onSortChange: (value: string) => void
  filters: FilterGroupSpec[]
  activeFilters?: ActiveFilter[]
  onFilterChange?: (groupId: string, value: unknown) => void
  onClearFilters?: () => void
  onRemoveFilter?: (key: string, value: string) => void
  /** Triggered when the user submits a refined query from the persistent search bar. */
  onSearch?: (query: string) => void
  /** Optional list of "Did you mean / try" alternative queries shown above results. */
  relatedQueries?: string[]
  onRelatedQuerySelect?: (query: string) => void
  recentSearches?: string[]
  onRecentQuerySelect?: (query: string) => void
  /** Render the result list / grid. Ignored when totalResults === 0 (empty state takes over). */
  results: React.ReactNode
  pagination?: React.ReactNode
  /** Custom empty state. When omitted, the layout renders a recovery card with helpful actions. */
  emptyState?: React.ReactNode
  /** "Browse all products" / catalog discovery affordance for the empty state. */
  onBrowseAll?: () => void
  newsletter?: React.ReactNode
  aside?: React.ReactNode
  /** Extra controls (e.g. layout view toggle) rendered next to the sort dropdown. */
  resultsToolbar?: React.ReactNode
}

/**
 * Persistent, page-level search refinement form. Controllable: seeded from the active query
 * and submits the trimmed value through onSearch. Renders inline so users can refine without
 * scrolling back to the global header.
 */
function RefineSearchBar({
  query,
  onSearch,
  resultCount,
}: {
  query: string
  onSearch?: (query: string) => void
  resultCount: number
}) {
  const [value, setValue] = React.useState(query)

  React.useEffect(() => {
    setValue(query)
  }, [query])

  const submit = (next: string) => {
    const trimmed = next.trim()
    if (!trimmed || !onSearch) return
    onSearch(trimmed)
  }

  return (
    <form
      role="search"
      onSubmit={(event) => {
        event.preventDefault()
        submit(value)
      }}
      className={cn(
        'flex w-full items-center gap-[var(--space-2)]',
        'rounded-[var(--radius-full)] border border-[var(--border-subtle)]',
        'bg-[var(--surface-base)] shadow-[var(--elevation-xs)]',
        'transition-[border-color,box-shadow] duration-[var(--motion-fast)]',
        'focus-within:border-[var(--action-primary)] focus-within:shadow-[var(--elevation-card)]',
        'pl-[var(--space-4)] pr-[var(--space-2)]',
      )}
    >
      <Search
        className="h-4 w-4 shrink-0 text-[var(--text-tertiary)]"
        aria-hidden="true"
      />
      <Input
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Refine your search…"
        aria-label="Refine search"
        className={cn(
          'h-11 w-full border-0 bg-transparent px-0',
          'text-[length:var(--text-sm)] text-[var(--text-primary)]',
          'shadow-none focus-visible:ring-0 focus-visible:border-transparent',
        )}
      />
      {value && value !== query && (
        <button
          type="button"
          onClick={() => setValue('')}
          aria-label="Clear input"
          className={cn(
            'inline-flex h-7 w-7 items-center justify-center rounded-full',
            'text-[var(--text-tertiary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]',
            'transition-colors duration-[var(--motion-fast)]',
          )}
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      )}
      <Button
        type="submit"
        size="sm"
        disabled={!value.trim() || value.trim() === query}
        className="h-9 rounded-[var(--radius-full)] px-[var(--space-4)]"
      >
        Search
      </Button>
      <span className="sr-only" aria-live="polite">
        {resultCount} results
      </span>
    </form>
  )
}

/**
 * Compact pill row for "Try / Recent" query suggestions. Only renders when there
 * is at least one item in either list — avoids visual noise on broad result pages.
 */
function QuerySuggestions({
  relatedQueries = [],
  onRelatedQuerySelect,
  recentSearches = [],
  onRecentQuerySelect,
}: Pick<
  SearchResultsPageLayoutProps,
  'relatedQueries' | 'onRelatedQuerySelect' | 'recentSearches' | 'onRecentQuerySelect'
>) {
  const hasRelated = relatedQueries.length > 0
  const hasRecent = recentSearches.length > 0
  if (!hasRelated && !hasRecent) return null

  return (
    <div className="flex flex-col gap-[var(--space-2)]">
      {hasRelated && (
        <div className="flex flex-wrap items-center gap-[var(--space-2)]">
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
                'px-[var(--space-3)] py-[var(--space-1-5)]',
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
        <div className="flex flex-wrap items-center gap-[var(--space-2)]">
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
                'px-[var(--space-3)] py-[var(--space-1-5)]',
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

/**
 * Recovery card shown when totalResults === 0. Walks the shopper through the three
 * most useful next moves: clear filters, try a related query, or browse the catalog.
 */
function NoResultsRecovery({
  query,
  hasActiveFilters,
  onClearFilters,
  onBrowseAll,
  relatedQueries = [],
  onRelatedQuerySelect,
}: {
  query: string
  hasActiveFilters: boolean
  onClearFilters?: () => void
  onBrowseAll?: () => void
  relatedQueries?: string[]
  onRelatedQuerySelect?: (q: string) => void
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center text-center',
        'rounded-[var(--radius-2xl)] border border-dashed border-[var(--border-subtle)]',
        'bg-[var(--surface-subtle)]',
        'px-[var(--space-6)] py-[var(--space-12)]',
      )}
    >
      <div
        className={cn(
          'mb-[var(--space-4)] flex h-14 w-14 items-center justify-center rounded-full',
          'bg-[var(--surface-base)] shadow-[var(--elevation-xs)]',
        )}
      >
        <Search className="h-6 w-6 text-[var(--text-tertiary)]" aria-hidden="true" />
      </div>
      <h2 className="text-[length:var(--font-size-heading-md)] font-semibold tracking-[-0.01em] text-[var(--text-primary)]">
        No results for &ldquo;{query}&rdquo;
      </h2>
      <p className="mt-[var(--space-2)] max-w-[44ch] text-[length:var(--text-sm)] leading-[var(--line-height-relaxed)] text-[var(--text-secondary)]">
        Try removing a filter, checking spelling, or using a more general term.
      </p>

      <div className="mt-[var(--space-6)] flex flex-wrap items-center justify-center gap-[var(--space-2)]">
        {hasActiveFilters && onClearFilters && (
          <Button variant="outline" size="sm" onClick={onClearFilters}>
            Clear filters
          </Button>
        )}
        {onBrowseAll && (
          <Button size="sm" onClick={onBrowseAll}>
            <Compass className="mr-[var(--space-1-5)] h-4 w-4" aria-hidden="true" />
            Browse all products
          </Button>
        )}
      </div>

      {relatedQueries.length > 0 && (
        <div className="mt-[var(--space-8)] w-full max-w-md">
          <p className="mb-[var(--space-3)] text-[length:var(--text-xs)] font-semibold uppercase tracking-[0.14em] text-[var(--text-tertiary)]">
            Did you mean
          </p>
          <div className="flex flex-wrap items-center justify-center gap-[var(--space-2)]">
            {relatedQueries.map((q) => (
              <button
                key={`recovery-${q}`}
                type="button"
                onClick={() => onRelatedQuerySelect?.(q)}
                className={cn(
                  'inline-flex items-center rounded-full',
                  'border border-[var(--border-subtle)] bg-[var(--surface-base)]',
                  'px-[var(--space-3)] py-[var(--space-1-5)]',
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
    </div>
  )
}

/**
 * Search Results Page — composed on top of CollectionPageLayout so it inherits
 * sidebar/grid/spacing/responsive behavior verbatim. This layer only contributes
 * search-specific affordances:
 *   - title that echoes the query
 *   - persistent refinement search bar in the hero (headerExtras slot)
 *   - related-query / recent-search chip rows
 *   - relevance-aware sort defaults (caller-controlled)
 *   - rich "no results" recovery card replacing the grid when empty
 */
function SearchResultsPageLayout({
  promoBar,
  header,
  footer,
  headerProps,
  footerProps,
  query,
  totalResults,
  sortValue,
  sortOptions,
  onSortChange,
  filters,
  activeFilters = [],
  onFilterChange,
  onClearFilters,
  onRemoveFilter,
  onSearch,
  relatedQueries,
  onRelatedQuerySelect,
  recentSearches,
  onRecentQuerySelect,
  results,
  pagination,
  emptyState,
  onBrowseAll,
  newsletter,
  aside,
  className,
  resultsToolbar,
}: SearchResultsPageLayoutProps) {
  const isEmpty = totalResults === 0
  const trimmedQuery = query.trim()
  const hasQuery = trimmedQuery.length > 0
  const hasActiveFilters = activeFilters.length > 0

  const titleNode = hasQuery ? (
    <>
      Results for{' '}
      <span className="text-[var(--action-primary)]">&ldquo;{trimmedQuery}&rdquo;</span>
    </>
  ) : (
    'All products'
  )

  const resultsLabel = isEmpty
    ? undefined
    : `${totalResults.toLocaleString()} ${totalResults === 1 ? 'result' : 'results'}`

  const headerExtras = (
    <div className="flex flex-col gap-[var(--space-4)]">
      <RefineSearchBar
        query={trimmedQuery}
        onSearch={onSearch}
        resultCount={totalResults}
      />
      {!isEmpty && (
        <QuerySuggestions
          relatedQueries={relatedQueries}
          onRelatedQuerySelect={onRelatedQuerySelect}
          recentSearches={recentSearches}
          onRecentQuerySelect={onRecentQuerySelect}
        />
      )}
    </div>
  )

  const discoveryToolbar = (
    <>
      <ActiveFilters
        filters={activeFilters}
        onRemove={(key, value) => onRemoveFilter?.(key, value)}
        onClearAll={() => onClearFilters?.()}
      />
      <div className="ml-auto flex flex-wrap items-center gap-[var(--space-3)]">
        {resultsToolbar}
        <SortDropdown
          value={sortValue}
          options={sortOptions}
          onChange={onSortChange}
          id="search-sort"
        />
      </div>
    </>
  )

  const grid = isEmpty ? (
    (emptyState ?? (
      <NoResultsRecovery
        query={trimmedQuery || 'your search'}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={onClearFilters}
        onBrowseAll={onBrowseAll}
        relatedQueries={relatedQueries}
        onRelatedQuerySelect={onRelatedQuerySelect}
      />
    ))
  ) : (
    <>
      {results}
      {pagination && (
        <div className="mt-[var(--space-6)] flex justify-center">{pagination}</div>
      )}
    </>
  )

  return (
    <CollectionPageLayout
      className={className}
      promoBar={promoBar}
      header={header}
      footer={footer}
      headerProps={headerProps}
      footerProps={footerProps}
      title={titleNode}
      resultsLabel={resultsLabel}
      headerExtras={headerExtras}
      filters={filters}
      onFilterChange={onFilterChange}
      onClearAll={onClearFilters}
      aside={aside}
      grid={grid}
      newsletter={newsletter}
      discoveryToolbar={isEmpty && !hasActiveFilters ? null : discoveryToolbar}
    />
  )
}

export { SearchResultsPageLayout }
