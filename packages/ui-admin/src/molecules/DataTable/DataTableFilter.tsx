'use client'

import { Search, X } from 'lucide-react'

import { cn, Input, IconButton } from '@ecom/ui'

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
      <Input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Escape' && value) onChange('')
        }}
        prefixIcon={<Search className="h-4 w-4" />}
        className="pr-8 h-8 text-[var(--text-sm)] bg-muted/50 border-border/60 focus:bg-background"
      />
      {value && (
        <IconButton
          type="button"
          icon={<X className="h-3.5 w-3.5" />}
          label="Clear search"
          onClick={() => onChange('')}
          size="sm"
          className="absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        />
      )}
    </div>
  )
}
