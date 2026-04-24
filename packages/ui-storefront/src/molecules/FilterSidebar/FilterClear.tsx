'use client'

import { Button, cn } from '@ecom/ui'

interface FilterClearProps {
  onClick: () => void
}

export function FilterClear({ onClick }: FilterClearProps) {
  return (
    <Button
      type="button"
      variant="link"
      size="sm"
      onClick={onClick}
      className={cn(
        'h-auto min-h-0 px-0 py-0 gap-1.5 text-[var(--text-sm)] font-semibold',
        'text-[var(--text-secondary)] hover:text-[var(--intent-danger)]',
        'transition-colors duration-[var(--motion-fast)] bg-transparent hover:bg-transparent',
      )}
    >
      Reset
    </Button>
  )
}
