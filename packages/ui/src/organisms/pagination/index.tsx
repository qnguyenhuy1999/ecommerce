import React from 'react'

import { ChevronLeft, ChevronRight } from 'lucide-react'

import { cn } from '../../lib/utils'

interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

function Pagination({ page, totalPages, onPageChange, className }: PaginationProps) {
  const pages = React.useMemo(() => {
    const items: (number | 'ellipsis')[] = []
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(i)
      }
    } else {
      items.push(1)
      if (page > 3) {
        items.push('ellipsis')
      }
      const start = Math.max(2, page - 1)
      const end = Math.min(totalPages - 1, page + 1)
      for (let i = start; i <= end; i++) {
        items.push(i)
      }
      if (page < totalPages - 2) {
        items.push('ellipsis')
      }
      items.push(totalPages)
    }
    return items
  }, [page, totalPages])

  const buttonBase = [
    'inline-flex items-center justify-center rounded-full text-sm font-medium',
    'transition-all duration-[150ms] ease-[cubic-bezier(0.4,0,0.2,1)]',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
  ].join(' ')

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
            className="flex h-9 w-9 items-center justify-center text-sm text-muted-foreground"
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
                ? 'bg-brand text-brand-foreground shadow-sm hover:bg-brand-hover'
                : 'hover:bg-accent hover:text-accent-foreground',
            )}
            aria-current={p === page ? 'page' : undefined}
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

export { Pagination }
