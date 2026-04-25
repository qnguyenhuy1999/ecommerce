'use client'

import { useRef, useState } from 'react'

import { Search, X, Clock, TrendingUp, Loader2 } from 'lucide-react'

import { cn, Popover, PopoverContent, PopoverTrigger } from '@ecom/ui'

interface SearchBarClientProps {
  placeholder?: string
  onSearch?: (query: string) => void
  suggestions?: string[]
  recentSearches?: string[]
  loading?: boolean
  className?: string
}

export function SearchBarClient({
  placeholder = 'Search for products, brands, categories…',
  onSearch,
  suggestions = [],
  recentSearches = [],
  loading = false,
  className,
}: SearchBarClientProps) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const hasDropdownContent = suggestions.length > 0 || recentSearches.length > 0
  const dropdownOpen = open && hasDropdownContent

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch?.(query.trim())
      setOpen(false)
    }
  }

  const handleSelect = (text: string) => {
    setQuery(text)
    onSearch?.(text)
    setOpen(false)
    inputRef.current?.blur()
  }

  return (
    <Popover open={dropdownOpen} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <form
          onSubmit={handleSubmit}
          className={cn(
            'group relative flex w-full items-center',
            'h-[var(--space-12)] rounded-full',
            'bg-[var(--surface-elevated)] border border-[var(--border-subtle)]',
            'transition-[border-color,box-shadow] duration-[var(--motion-fast)] ease-[var(--motion-ease-default)]',
            'hover:border-[var(--border-default)]',
            'focus-within:border-[var(--brand-500)] focus-within:ring-[var(--focus-ring-width)] focus-within:ring-[var(--focus-ring-color)]',
            className,
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              'pointer-events-none absolute left-[var(--space-4)] top-1/2 -translate-y-1/2',
              'text-[var(--text-tertiary)]',
              'group-focus-within:text-[var(--text-primary)]',
              'transition-colors duration-[var(--motion-fast)]',
            )}
          >
            {loading ? (
              <Loader2 className="h-[1.125rem] w-[1.125rem] animate-spin" />
            ) : (
              <Search className="h-[1.125rem] w-[1.125rem]" />
            )}
          </span>

          <input
            ref={inputRef}
            type="search"
            role="combobox"
            aria-expanded={dropdownOpen}
            aria-autocomplete="list"
            aria-controls={hasDropdownContent ? 'search-suggestions' : undefined}
            placeholder={placeholder}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              if (hasDropdownContent) setOpen(true)
            }}
            onFocus={() => {
              if (hasDropdownContent) setOpen(true)
            }}
            className={cn(
              'h-full w-full bg-transparent rounded-full',
              'pl-[var(--space-11)] pr-[var(--space-24)]',
              'text-[length:var(--text-sm)] text-[var(--text-primary)]',
              'placeholder:text-[var(--input-placeholder)]',
              'outline-none border-0',
              '[&::-webkit-search-cancel-button]:hidden',
            )}
          />

          <div className="absolute right-[var(--space-1-5)] top-1/2 flex -translate-y-1/2 items-center gap-[var(--space-1)]">
            {!query && !loading && (
              <kbd className="hidden sm:inline-flex items-center gap-[2px] rounded-[var(--radius-sm)] border border-[var(--border-subtle)] bg-[var(--surface-muted)] px-[var(--space-1-5)] py-[1px] text-[length:var(--text-micro)] font-medium text-[var(--text-tertiary)]">
                <span className="text-[length:var(--text-xs)]">⌘</span>K
              </kbd>
            )}
            {query && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => {
                  setQuery('')
                  inputRef.current?.focus()
                }}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[var(--text-tertiary)] hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)] transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <button
              type="submit"
              aria-label="Search"
              className={cn(
                'inline-flex h-9 items-center justify-center rounded-full',
                'px-[var(--space-4)] gap-[var(--space-2)]',
                'bg-[var(--action-primary)] text-[var(--action-primary-foreground)]',
                'text-[length:var(--text-sm)] font-semibold tracking-[-0.005em]',
                'transition-[background-color,transform] duration-[var(--motion-fast)] ease-[var(--motion-ease-default)]',
                'hover:bg-[var(--action-primary-hover)]',
                'active:scale-[var(--motion-scale-press)]',
                'focus-visible:outline-none focus-visible:ring-[var(--focus-ring-width)] focus-visible:ring-[var(--focus-ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-base)]',
              )}
            >
              <Search className="h-4 w-4" />
              <span className="sr-only md:not-sr-only">Search</span>
            </button>
          </div>
        </form>
      </PopoverTrigger>

      {hasDropdownContent && (
        <PopoverContent
          id="search-suggestions"
          align="start"
          sideOffset={8}
          className={cn(
            'w-[var(--radix-popover-trigger-width)] p-0 overflow-hidden',
            'rounded-[var(--radius-xl)]',
            'border border-[var(--border-subtle)] bg-[var(--surface-elevated)]',
            'shadow-[var(--elevation-dropdown)]',
          )}
        >
          <div className="py-[var(--space-2)]">
            {recentSearches.length > 0 && !query && (
              <SearchSection title="Recent">
                {recentSearches.map((item) => (
                  <SearchSuggestionItem
                    key={item}
                    icon={<Clock className="h-4 w-4 text-[var(--text-tertiary)]" />}
                    label={item}
                    onSelect={() => handleSelect(item)}
                  />
                ))}
              </SearchSection>
            )}

            {suggestions.length > 0 && (
              <SearchSection title={query ? 'Suggestions' : 'Trending'}>
                {suggestions.map((item) => (
                  <SearchSuggestionItem
                    key={item}
                    icon={
                      query ? (
                        <Search className="h-4 w-4 text-[var(--text-tertiary)]" />
                      ) : (
                        <TrendingUp className="h-4 w-4 text-[var(--text-brand)]" />
                      )
                    }
                    label={item}
                    onSelect={() => handleSelect(item)}
                  />
                ))}
              </SearchSection>
            )}
          </div>
        </PopoverContent>
      )}
    </Popover>
  )
}

function SearchSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="pb-[var(--space-1)] last:pb-0">
      <div className="px-[var(--space-4)] pt-[var(--space-2)] pb-[var(--space-1)] text-[length:var(--text-micro)] font-semibold uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
        {title}
      </div>
      {children}
    </div>
  )
}

function SearchSuggestionItem({
  icon,
  label,
  onSelect,
}: {
  icon: React.ReactNode
  label: string
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'flex w-full items-center gap-[var(--space-3)]',
        'px-[var(--space-4)] py-[var(--space-2)]',
        'text-left text-[length:var(--text-sm)] text-[var(--text-primary)]',
        'transition-colors duration-[var(--motion-fast)]',
        'hover:bg-[var(--surface-muted)]',
        'focus-visible:outline-none focus-visible:bg-[var(--surface-muted)]',
      )}
    >
      <span className="shrink-0">{icon}</span>
      <span className="truncate">{label}</span>
    </button>
  )
}
