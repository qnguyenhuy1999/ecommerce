// Server wrapper — delegates all interactive state to SearchBarClient (client leaf).
// No 'use client' here; only the leaf needs the directive.

import React from 'react'

import { SearchBarClient } from './SearchBarClient'

export interface SearchBarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  placeholder?: string
  onSearch?: (query: string) => void
  suggestions?: string[]
  recentSearches?: string[]
  /** Show loading spinner in the search icon area */
  loading?: boolean
}

function SearchBar({
  placeholder = 'Search for products...',
  onSearch,
  suggestions = [],
  recentSearches = [],
  loading = false,
  className,
}: SearchBarProps) {
  return (
    <SearchBarClient
      placeholder={placeholder}
      onSearch={onSearch}
      suggestions={suggestions}
      recentSearches={recentSearches}
      loading={loading}
      className={className}
    />
  )
}

export { SearchBar }
