'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'

import { cn } from '../../lib/utils'
import { Button } from '../../atoms/Button/Button'
import { IconButton } from '../../atoms/IconButton/IconButton'

export interface PaginationClientProps {
  page: number
  pages: (number | 'ellipsis')[]
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

export function PaginationClient({
  page,
  pages,
  totalPages,
  onPageChange,
  className,
}: PaginationClientProps) {
  return (
    <nav className={cn('flex items-center gap-1 select-none', className)} aria-label="pagination">
      <IconButton
        type="button"
        icon={<ChevronLeft className="h-4 w-4" />}
        label="Previous page"
        variant="ghost"
        onClick={() => {
          onPageChange(page - 1)
        }}
        disabled={page <= 1}
        className="h-9 w-9 rounded-full hover:bg-accent hover:text-accent-foreground"
      />

      {pages.map((p, i) =>
        p === 'ellipsis' ? (
          <span
            key={`ellipsis-${String(i)}`}
            className="flex h-9 w-9 items-center justify-center text-[var(--text-sm)] text-muted-foreground"
            aria-hidden="true"
          >
            …
          </span>
        ) : (
          <Button
            key={p}
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              onPageChange(p)
            }}
            className={cn(
              'h-9 w-9 rounded-full p-0 tabular-nums transform-gpu',
              'transition-[background-color,color,box-shadow,transform] duration-[var(--motion-normal)] ease-[var(--motion-ease-out)] motion-reduce:transition-none',
              p === page
                ? 'bg-brand text-brand-foreground shadow-[var(--elevation-card)] hover:bg-brand-hover'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
            )}
            aria-current={p === page ? 'page' : undefined}
            aria-label={`Page ${String(p)}`}
          >
            {String(p)}
          </Button>
        ),
      )}

      <IconButton
        type="button"
        icon={<ChevronRight className="h-4 w-4" />}
        label="Next page"
        variant="ghost"
        onClick={() => {
          onPageChange(page + 1)
        }}
        disabled={page >= totalPages}
        className="h-9 w-9 rounded-full hover:bg-accent hover:text-accent-foreground"
      />
    </nav>
  )
}
