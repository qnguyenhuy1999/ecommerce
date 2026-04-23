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
      <span className="text-[var(--text-sm)] text-[var(--text-secondary)] whitespace-nowrap flex items-center gap-1.5">
        <ArrowUpDown className="w-3.5 h-3.5 shrink-0" />
        {label}:
      </span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          id={id}
          className={cn(
            'h-9 min-w-[10rem] text-[var(--text-sm)] font-medium',
            'border-[var(--border-default)] bg-[var(--surface-base)]',
            'rounded-[var(--radius-md)]',
            'focus:border-[var(--action-primary)] focus:ring-1 focus:ring-[var(--action-primary)]',
            'transition-all duration-[var(--motion-fast)]',
          )}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="rounded-[var(--radius-lg)] border-[var(--border-subtle)] shadow-[var(--elevation-dropdown)]">
          {options.map((opt) => (
            <SelectItem
              key={opt.value}
              value={opt.value}
              className="text-[var(--text-sm)] cursor-pointer"
            >
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export { SortDropdown }
