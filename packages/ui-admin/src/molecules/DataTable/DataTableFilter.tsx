'use client'

import { Search, X } from 'lucide-react'

import { cn, Input } from '@ecom/ui'

export interface DataTableFilterProps {
  placeholder?: string
  value: string
  onChange: (value: string) => void
  className?: string
}

export function DataTableFilter({
  placeholder = 'Search...',
  value,
  onChange,
  className,
}: DataTableFilterProps) {
  return (
    <div className={cn('relative w-full max-w-xs', className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      <Input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Escape' && value) onChange('')
        }}
        className="pl-9 pr-8 h-8 text-[var(--text-sm)] bg-muted/50 border-border/60 focus:bg-background"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Clear search"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  )
}
