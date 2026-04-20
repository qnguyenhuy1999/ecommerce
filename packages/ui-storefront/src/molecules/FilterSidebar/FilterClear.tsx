'use client'

import { X } from 'lucide-react'

import { cn } from '@ecom/ui'

interface FilterClearProps {
  onClick: () => void
}

export function FilterClear({ onClick }: FilterClearProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center gap-1.5 text-[var(--text-sm)] font-semibold',
        'text-[var(--text-secondary)] hover:text-[var(--intent-danger)]',
        'transition-colors duration-[var(--motion-fast)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring-color)] rounded-[var(--radius-xs)]',
      )}
    >
      <X className="w-3.5 h-3.5" />
      Reset
    </button>
  )
}
