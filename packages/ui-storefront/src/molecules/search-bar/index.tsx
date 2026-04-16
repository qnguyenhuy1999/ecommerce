'use client'

import React from 'react'

import { Search, X, Clock, TrendingUp, Loader2 } from 'lucide-react'

import { cn, Popover, PopoverContent, PopoverTrigger, Button, IconButton, Input } from '@ecom/ui'

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
  ...props
}: SearchBarProps) {
  const [query, setQuery] = React.useState('')
  const [, setOpen] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const hasDropdownContent = suggestions.length > 0 || recentSearches.length > 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim() && onSearch) {
      onSearch(query.trim())
      setOpen(false)
    }
  }

  const handleSelect = (text: string) => {
    setQuery(text)
    if (onSearch) onSearch(text)
    setOpen(false)
  }

  return (
    <Popover open={!!(hasDropdownContent && query.length > 0)} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          className={cn(
            'search-bar group relative max-w-2xl w-full rounded-full border bg-background overflow-hidden transition-all duration-[var(--motion-fast)] hover:border-brand focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:border-brand',
            className,
          )}
          {...props}
        >
          <form onSubmit={handleSubmit} className="flex relative w-full h-12">
            {/* Icon: search (idle) or loading spinner */}
            <div
              className={cn(
                'absolute left-4 top-1/2 -translate-y-1/2',
                'pointer-events-none transition-colors duration-[var(--motion-fast)]',
                loading
                  ? 'text-muted-foreground'
                  : 'group-focus-within:text-brand text-muted-foreground',
              )}
              aria-hidden="true"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
            </div>

            <Input
              ref={inputRef}
              type="text"
              role="combobox"
              aria-expanded={hasDropdownContent}
              aria-autocomplete="list"
              aria-controls={hasDropdownContent ? 'search-suggestions' : undefined}
              className="w-full h-full bg-transparent pl-12 pr-14 text-[var(--text-sm)] border-0 shadow-none rounded-none focus:shadow-none"
              placeholder={placeholder}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                if (hasDropdownContent) setOpen(true)
              }}
              onFocus={() => {
                if (hasDropdownContent) setOpen(true)
              }}
            />

            {/* Clear button + submit */}
            <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center">
              {/* Shortcut Hint or Clear */}
              {!query && !loading && (
                <kbd className="hidden sm:inline-flex mr-2 items-center gap-1 bg-muted border px-1.5 rounded-[var(--radius-xs)] text-[10px] font-medium text-muted-foreground shadow-sm">
                  <span className="text-xs">⌘</span>K
                </kbd>
              )}
              {query && !loading && (
                <IconButton
                  icon={<X className="w-4 h-4" />}
                  label="Clear search"
                  variant="ghost"
                  className="mr-1 h-8 w-8 hover:bg-muted"
                  onClick={() => {
                    setQuery('')
                    inputRef.current?.focus()
                  }}
                />
              )}
              <Button
                type="submit"
                className="h-10 w-10 p-0 rounded-full mr-1 shadow-[var(--elevation-card)] group-focus-within:bg-brand group-focus-within:text-brand-foreground bg-muted text-muted-foreground hover:bg-brand hover:text-brand-foreground transition-all duration-[var(--motion-fast)]"
                aria-label="Search"
              >
                <ArrowRightIcon className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </div>
      </PopoverTrigger>

      {hasDropdownContent && (
        <PopoverContent
          id="search-suggestions"
          className={cn(
            'w-[var(--radix-popover-trigger-width)] p-0',
            'rounded-[var(--radius-xl)] overflow-hidden',
            'shadow-[var(--elevation-dropdown)]',
            // Slide-in animation
            'transition-all duration-[var(--motion-fast)] ease-[var(--motion-ease-out)]',
            className,
          )}
          align="start"
        >
          <div className="flex flex-col py-2">
            {recentSearches.length > 0 && !query && (
              <div className="mb-2">
                <div className="px-4 py-1.5 text-[var(--text-micro)] font-semibold text-muted-foreground uppercase tracking-wider">
                  Recent
                </div>
                {recentSearches.map((item, i) => (
                  <Button
                    key={i}
                    variant="ghost"
                    className="w-full justify-start px-4 py-2 text-[var(--text-sm)] gap-3 h-auto font-normal"
                    onClick={() => handleSelect(item)}
                  >
                    <Clock className="w-4 h-4 text-muted-foreground/70 shrink-0" />
                    {item}
                  </Button>
                ))}
              </div>
            )}

            {suggestions.length > 0 && (
              <div>
                <div className="px-4 py-1.5 text-[var(--text-micro)] font-semibold text-muted-foreground uppercase tracking-wider">
                  {query ? 'Suggestions' : 'Trending'}
                </div>
                {suggestions.map((item, i) => (
                  <Button
                    key={i}
                    variant="ghost"
                    className="w-full justify-start px-4 py-2 text-[var(--text-sm)] gap-3 h-auto font-normal"
                    onClick={() => handleSelect(item)}
                  >
                    {query ? (
                      <Search className="w-4 h-4 text-muted-foreground/70 shrink-0" />
                    ) : (
                      <TrendingUp className="w-4 h-4 text-brand/70 shrink-0" />
                    )}
                    <span className="truncate">{item}</span>
                  </Button>
                ))}
              </div>
            )}
          </div>
        </PopoverContent>
      )}
    </Popover>
  )
}

function ArrowRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}

export { SearchBar }
