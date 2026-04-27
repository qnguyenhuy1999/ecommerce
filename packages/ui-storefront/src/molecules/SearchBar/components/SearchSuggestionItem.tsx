import type React from 'react'

import { cn } from '@ecom/ui/utils'

export interface SearchSuggestionItemProps {
  icon: React.ReactNode
  label: string
  onSelect: () => void
}

export function SearchSuggestionItem({ icon, label, onSelect }: SearchSuggestionItemProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'flex w-full items-center gap-3',
        'px-4 py-2',
        'text-left text-sm text-[var(--text-primary)]',
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
