'use client'

import { Checkbox, cn } from '@ecom/ui'

interface FilterCheckboxProps {
  label: string
  value: string
  count?: number
  checked: boolean
  onToggle: (groupId: string, value: string, checked: boolean) => void
  groupId: string
}

export function FilterCheckbox({
  label,
  value,
  count,
  checked,
  onToggle,
  groupId,
}: FilterCheckboxProps) {
  return (
    <label
      className={cn(
        'filter-option flex items-center gap-3 py-1 cursor-pointer group',
        'rounded-[var(--radius-xs)] px-2 -mx-2',
        'transition-colors duration-[var(--motion-fast)]',
        'hover:bg-[var(--surface-hover)]',
      )}
    >
      <span className="shrink-0">
        <Checkbox
          checked={checked}
          onCheckedChange={(c) => onToggle(groupId, value, Boolean(c))}
          aria-label={label}
          className="filter-option__checkbox"
        />
      </span>
      <span
        className={cn(
          'flex-1 text-sm font-medium text-[var(--text-secondary)]',
          'group-hover:text-[var(--text-primary)] transition-colors duration-[var(--motion-fast)]',
          checked && 'text-[var(--text-primary)] font-semibold',
        )}
      >
        {label}
      </span>
      {count !== undefined && (
        <span
          className={cn(
            'text-[length:var(--text-micro)] font-medium tabular-nums',
            'text-[var(--text-tertiary)]',
            'group-hover:text-[var(--text-secondary)] transition-colors duration-[var(--motion-fast)]',
            checked && 'text-[var(--action-primary)] font-semibold',
          )}
        >
          {count.toLocaleString()}
        </span>
      )}
    </label>
  )
}
