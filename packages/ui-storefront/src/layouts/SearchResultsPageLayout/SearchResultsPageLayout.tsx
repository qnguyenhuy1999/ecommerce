import React from 'react'

import { Search } from 'lucide-react'

import { EmptyState, cn } from '@ecom/ui'

import { ActiveFilters } from '../../atoms/ActiveFilters/ActiveFilters'
import type { ActiveFilter } from '../../atoms/ActiveFilters/ActiveFilters'
import { SortDropdown } from '../../atoms/SortDropdown/SortDropdown'
import type { SortOption } from '../../atoms/SortDropdown/SortDropdown'
import { FilterSidebar } from '../../molecules/FilterSidebar/FilterSidebar'
import type { FilterGroupSpec } from '../../molecules/FilterSidebar/FilterSidebar'
import { StorefrontFooter } from '../StorefrontFooter/StorefrontFooter'
import { StorefrontHeader } from '../StorefrontHeader/StorefrontHeader'
import { StorefrontShell } from '../StorefrontShell/StorefrontShell'

export interface SearchResultsPageLayoutProps {
  className?: string
  promoBar?: React.ReactNode
  header?: React.ReactNode
  footer?: React.ReactNode
  headerProps?: React.ComponentProps<typeof StorefrontHeader>
  footerProps?: React.ComponentProps<typeof StorefrontFooter>
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
  results: React.ReactNode
  pagination?: React.ReactNode
  suggestions?: React.ReactNode
  emptyState?: React.ReactNode
  newsletter?: React.ReactNode
  aside?: React.ReactNode
  resultsToolbar?: React.ReactNode
}

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
  results,
  pagination,
  suggestions,
  emptyState,
  newsletter,
  aside,
  className,
  resultsToolbar,
  ...props
}: SearchResultsPageLayoutProps) {
  const isEmpty = totalResults === 0

  return (
    <StorefrontShell
      className={className}
      header={
        header ?? (
          <div>
            {promoBar}
            <StorefrontHeader {...headerProps} />
          </div>
        )
      }
      footer={footer ?? <StorefrontFooter newsletter={newsletter} {...footerProps} />}
      {...props}
    >
      <div className="mx-auto max-w-[var(--storefront-content-max-width)] px-4 py-8 md:px-8 md:py-12">
        <div className="mb-8 rounded-[var(--radius-xl)] border border-border/70 bg-[var(--surface-elevated)]/78 px-6 py-6 shadow-[var(--elevation-surface)] backdrop-blur-[10px]">
          <div className="space-y-2">
            <p className="text-[length:var(--text-xs)] font-semibold uppercase tracking-[0.18em] text-[var(--action-primary)]/80">
              Search Results
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] md:text-4xl">
              {query ? (
                <>
                  Results for <span className="text-[var(--action-primary)]">“{query}”</span>
                </>
              ) : (
                'All Products'
              )}
            </h1>
            {totalResults > 0 && (
              <p className="text-[var(--text-sm)] text-[var(--text-secondary)]">
                {totalResults.toLocaleString()} {totalResults === 1 ? 'product' : 'products'} found
              </p>
            )}
          </div>

          {suggestions && <div className="mt-5">{suggestions}</div>}
        </div>

        <div className="grid gap-8 lg:grid-cols-[20rem_minmax(0,1fr)] lg:items-start">
          <aside className="space-y-4 lg:sticky lg:top-28">
            <FilterSidebar
              groups={filters}
              onFilterChange={onFilterChange}
              onClearAll={onClearFilters}
            />
            {aside}
          </aside>

          <div className="space-y-5">
            <div className="rounded-[var(--radius-xl)] border border-border/70 bg-[var(--surface-elevated)]/92 p-3 shadow-[var(--elevation-surface)] backdrop-blur-[8px]">
              <div className="flex flex-wrap items-center justify-between gap-3">
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
              </div>
            </div>

            {isEmpty ? (
              <div className="py-20">
                {emptyState ?? (
                  <EmptyState
                    icon={<Search className="h-10 w-10 text-[var(--text-tertiary)]" />}
                    title="No results found"
                    description={`We couldn't find any products matching "${query}". Try different keywords or browse our categories.`}
                    action={{
                      label: 'Clear Filters',
                      onClick: () => onClearFilters?.(),
                      variant: 'outline',
                    }}
                  />
                )}
              </div>
            ) : (
              <div className={cn('space-y-3')}>{results}</div>
            )}

            {!isEmpty && pagination && <div className="pt-4">{pagination}</div>}
          </div>
        </div>
      </div>
    </StorefrontShell>
  )
}

export { SearchResultsPageLayout }
