import React from 'react'

import { Search, X } from 'lucide-react'

import { Button, Input } from '@ecom/ui'
import { cn } from '@ecom/ui/utils'

export interface RefineSearchBarProps {
  query: string
  onSearch?: (query: string) => void
  resultCount: number
}

export function RefineSearchBar({ query, onSearch, resultCount }: RefineSearchBarProps) {
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
        'flex w-full items-center gap-2',
        'rounded-[var(--radius-full)] border border-[var(--border-subtle)]',
        'bg-[var(--surface-base)] shadow-[var(--elevation-xs)]',
        'transition-[border-color,box-shadow] duration-[var(--motion-fast)]',
        'focus-within:border-[var(--action-primary)] focus-within:shadow-[var(--elevation-card)]',
        'pl-4 pr-2',
      )}
    >
      <Search className="h-4 w-4 shrink-0 text-[var(--text-tertiary)]" aria-hidden="true" />
      <Input
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Refine your search..."
        aria-label="Refine search"
        className={cn(
          'h-11 w-full border-0 bg-transparent px-0',
          'text-sm text-[var(--text-primary)]',
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
        className="h-9 rounded-[var(--radius-full)] px-4"
      >
        Search
      </Button>
      <span className="sr-only" aria-live="polite">
        {resultCount} results
      </span>
    </form>
  )
}
