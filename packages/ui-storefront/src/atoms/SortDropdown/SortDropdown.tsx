import { ArrowUpDown } from 'lucide-react'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, cn } from '@ecom/ui'

export interface SortOption {
  value: string
  label: string
}

export interface SortDropdownProps {
  value: string
  options: SortOption[]
  onChange: (value: string) => void
  label?: string
  className?: string
  id?: string
}

function SortDropdown({
  value,
  options,
  onChange,
  label = 'Sort by',
  className,
  id = 'sort-dropdown',
}: SortDropdownProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="flex items-center gap-1.5 whitespace-nowrap text-sm text-[var(--text-secondary)]">
        <ArrowUpDown className="h-3.5 w-3.5 shrink-0" />
        {label}:
      </span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          id={id}
          className={cn(
            'h-10 min-w-[11rem] rounded-full border-[var(--border-default)] bg-[var(--surface-base)] text-sm font-medium shadow-[var(--elevation-xs)]',
            'focus:border-[var(--action-primary)] focus:ring-[var(--action-primary)]',
          )}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="rounded-[var(--radius-lg)] border-[var(--border-subtle)] shadow-[var(--elevation-dropdown)]">
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value} className="cursor-pointer text-sm">
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export { SortDropdown }
