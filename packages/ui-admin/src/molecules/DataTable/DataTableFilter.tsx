'use client'

import { Search, X } from 'lucide-react'

import { Input, IconButton } from '@ecom/ui'
import { cn } from '@ecom/ui/utils'

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
    <div className={cn('relative w-full max-w-sm', className)}>
      <Input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Escape' && value) onChange('')
        }}
        prefixIcon={<Search className="h-4 w-4" />}
        className="h-10 rounded-full border-border/60 bg-background/90 pr-10 shadow-[var(--elevation-xs)] focus:bg-background"
      />
      {value && (
        <IconButton
          type="button"
          icon={<X className="h-3.5 w-3.5" />}
          label="Clear search"
          onClick={() => onChange('')}
          size="sm"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:bg-[var(--surface-hover)] hover:text-foreground"
        />
      )}
    </div>
  )
}
