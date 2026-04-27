'use client'

import React from 'react'

import { ActiveFilters } from '../../atoms/ActiveFilters/ActiveFilters'
import type { ActiveFilter } from '../../atoms/ActiveFilters/ActiveFilters'
import { SortDropdown } from '../../atoms/SortDropdown/SortDropdown'
import type { SortOption } from '../../atoms/SortDropdown/SortDropdown'
import type { FilterGroupSpec } from '../../molecules/FilterSidebar/FilterSidebar'
import { CollectionPageLayout } from '../CollectionPageLayout/CollectionPageLayout'
import type { StorefrontFooter } from '../StorefrontFooter/StorefrontFooter'
import type { StorefrontHeader } from '../StorefrontHeader/StorefrontHeader'
import { NoResultsRecovery } from './components/NoResultsRecovery'
import { QuerySuggestions } from './components/QuerySuggestions'
import { RefineSearchBar } from './components/RefineSearchBar'

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
      Results for <span className="text-[var(--action-primary)]">&ldquo;{trimmedQuery}&rdquo;</span>
    </>
  ) : (
    'All products'
  )

  const resultsLabel = isEmpty
    ? undefined
    : `${totalResults.toLocaleString()} ${totalResults === 1 ? 'result' : 'results'}`

  const headerExtras = (
    <div className="flex flex-col gap-4">
      <RefineSearchBar query={trimmedQuery} onSearch={onSearch} resultCount={totalResults} />
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
      <div className="ml-auto flex flex-wrap items-center gap-3">
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
      {pagination && <div className="mt-6 flex justify-center">{pagination}</div>}
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
