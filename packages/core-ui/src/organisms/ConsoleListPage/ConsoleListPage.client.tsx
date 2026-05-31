'use client'

import { cn } from '@ecom/shared/utils/cn'
import { Search } from 'lucide-react'
import { Input } from '../../atoms/Input'
import type {
  ConsoleListPageSearchProps,
  ConsoleListPageStatusTabsProps,
} from './ConsoleListPage.types'

function formatStatusLabel(value: string) {
  return value
    .toLowerCase()
    .split('_')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export function SearchField({
  value,
  onChange,
  placeholder = 'Search...',
  className,
}: ConsoleListPageSearchProps) {
  return (
    <div className={cn('relative w-full max-w-sm', className)}>
      <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2" />
      <Input
        type="search"
        aria-label={placeholder}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="bg-background border-input placeholder:text-muted-foreground h-10 rounded-2xl pl-10 text-sm shadow-none focus-visible:ring-0"
      />
    </div>
  )
}

export function StatusTabs({
  tabs,
  value,
  onChange,
  counts,
  labels,
  className,
}: ConsoleListPageStatusTabsProps) {
  return (
    <div className={cn('flex flex-wrap items-center gap-1.5', className)} role="group">
      {tabs.map((tab) => {
        const isActive = value === tab
        return (
          <button
            key={tab}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(tab)}
            className={cn(
              'focus-visible:ring-ring/50 inline-flex h-10 items-center gap-2 rounded-2xl px-4 text-sm font-medium transition-colors focus-visible:ring-3 focus-visible:outline-none',
              isActive
                ? 'bg-primary-soft text-primary-deep'
                : 'text-foreground hover:bg-muted hover:text-foreground',
            )}
          >
            <span>{labels?.[tab] ?? formatStatusLabel(tab)}</span>
            {counts && counts[tab] != null ? (
              <span
                className={cn(
                  'inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-xs leading-none',
                  isActive
                    ? 'bg-background/80 text-primary-deep'
                    : 'bg-muted text-muted-foreground',
                )}
              >
                {counts[tab]}
              </span>
            ) : null}
          </button>
        )
      })}
    </div>
  )
}
