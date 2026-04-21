'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'

import { cn } from '../../lib/utils'

export interface PaginationClientProps {
  page: number
  pages: (number | 'ellipsis')[]
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

const buttonBase = [
  'inline-flex items-center justify-center rounded-full text-[var(--text-sm)] font-medium',
  'transition-all duration-[var(--motion-fast)] ease-[var(--motion-ease-default)]',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  'disabled:pointer-events-none disabled:opacity-50',
].join(' ')

export function PaginationClient({
  page,
  pages,
  totalPages,
  onPageChange,
  className,
}: PaginationClientProps) {
  return (
    <nav className={cn('flex items-center gap-1', className)} aria-label="pagination">
      <button
        onClick={() => {
          onPageChange(page - 1)
        }}
        disabled={page <= 1}
        className={cn(buttonBase, 'h-9 w-9 hover:bg-accent hover:text-accent-foreground')}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

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
          <button
            key={p}
            onClick={() => {
              onPageChange(p)
            }}
            className={cn(
              buttonBase,
              'h-9 w-9',
              p === page
                ? 'bg-brand text-brand-foreground shadow-[var(--elevation-card)] hover:bg-brand-hover'
                : 'hover:bg-accent hover:text-accent-foreground',
            )}
            aria-current={p === page ? 'page' : undefined}
            aria-label={`Page ${String(p)}`}
          >
            {String(p)}
          </button>
        ),
      )}

      <button
        onClick={() => {
          onPageChange(page + 1)
        }}
        disabled={page >= totalPages}
        className={cn(buttonBase, 'h-9 w-9 hover:bg-accent hover:text-accent-foreground')}
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  )
}
