'use client'

import React from 'react'

import { ChevronLeft, ChevronRight } from 'lucide-react'

import { cn, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@ecom/ui'

export interface DataTablePaginationProps extends React.HTMLAttributes<HTMLDivElement> {
  page: number
  pageSize: number
  totalRows: number
  onPageChange: (page: number) => void
  onPageSizeChange?: (size: number) => void
  showPageSizeSelect?: boolean
  pageSizeOptions?: number[]
}

const DEFAULT_PAGE_SIZES = [10, 25, 50, 100]

function getPageRange(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const range: (number | '...')[] = []
  let prev: number | null = null

  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - 1 && i <= current + 1)) {
      if (prev !== null && i - prev > 1) range.push('...')
      range.push(i)
      prev = i
    }
  }

  return range
}

export function DataTablePagination({
  page,
  pageSize,
  totalRows,
  onPageChange,
  onPageSizeChange,
  showPageSizeSelect,
  pageSizeOptions = DEFAULT_PAGE_SIZES,
  className,
  ...props
}: DataTablePaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize))
  const pages = getPageRange(page, totalPages)

  return (
    <div
      className={cn(
        'flex items-center justify-between gap-4 px-4 py-3',
        'border-t border-[var(--border-subtle)] shrink-0',
        className,
      )}
      {...props}
    >
      {/* ← Previous */}
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full border border-primary text-primary',
          'px-4 py-1.5 text-[var(--text-sm)] font-medium',
          'hover:bg-primary/10 transition-colors duration-[var(--duration-fast)]',
          'disabled:opacity-40 disabled:cursor-not-allowed',
        )}
      >
        <ChevronLeft className="w-4 h-4" />
        Previous
      </button>

      {/* Page numbers */}
      <div className="flex items-center gap-1">
        {pages.map((p, i) =>
          p === '...' ? (
            <span
              key={`ellipsis-${i}`}
              className="w-8 h-8 flex items-center justify-center text-[var(--text-sm)] text-[var(--text-secondary)] select-none"
            >
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p as number)}
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-sm)] font-medium transition-colors duration-[var(--duration-fast)]',
                p === page
                  ? 'bg-primary text-primary-foreground'
                  : 'text-[var(--text-primary)] hover:bg-[var(--state-hover)]',
              )}
            >
              {p}
            </button>
          ),
        )}
      </div>

      {/* Next → and optional items select */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full border border-primary text-primary',
            'px-4 py-1.5 text-[var(--text-sm)] font-medium',
            'hover:bg-primary/10 transition-colors duration-[var(--duration-fast)]',
            'disabled:opacity-40 disabled:cursor-not-allowed',
          )}
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>

        {showPageSizeSelect && onPageSizeChange && (
          <Select
            value={String(pageSize)}
            onValueChange={(v) => {
              onPageSizeChange(Number(v))
              onPageChange(1)
            }}
          >
            <SelectTrigger size="sm" className="rounded-full min-w-[6.5rem]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size} Items
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  )
}
