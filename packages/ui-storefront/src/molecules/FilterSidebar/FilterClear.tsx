'use client'

import { X } from 'lucide-react'

import { Button, cn } from '@ecom/ui'

interface FilterClearProps {
  onClick: () => void
}

export function FilterClear({ onClick }: FilterClearProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={onClick}
      className={cn(
        'h-auto min-h-0 px-0 py-0 gap-1.5 text-[var(--text-sm)] font-semibold',
        'text-[var(--text-secondary)] hover:text-[var(--intent-danger)]',
        'transition-colors duration-[var(--motion-fast)] bg-transparent hover:bg-transparent',
        'focus-visible:ring-[var(--focus-ring-color)] rounded-[var(--radius-xs)]',
      )}
    >
      <X className="w-3.5 h-3.5" />
      Reset
    </Button>
  )
}
