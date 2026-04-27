'use client'

import React from 'react'

import { ChevronLeft, ChevronRight } from 'lucide-react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@ecom/ui'
import { buildPageList } from '@ecom/ui/pagination'
import { cn } from '@ecom/ui/utils'

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
  const pages = buildPageList(page, totalPages, 1, 1)
  const startRow = totalRows === 0 ? 0 : (page - 1) * pageSize + 1
  const endRow = Math.min(totalRows, page * pageSize)

  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border-subtle)] bg-[var(--surface-elevated)]/82 px-5 py-3.5 shrink-0',
        className,
      )}
      {...props}
    >
      <div className="text-sm text-[var(--text-secondary)]">
        Showing{' '}
        <span className="font-semibold text-[var(--text-primary)]">
          {startRow}-{endRow}
        </span>{' '}
        of <span className="font-semibold text-[var(--text-primary)]">{totalRows}</span>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {showPageSizeSelect && onPageSizeChange && (
          <Select
            value={String(pageSize)}
            onValueChange={(v) => {
              onPageSizeChange(Number(v))
              onPageChange(1)
            }}
          >
            <SelectTrigger size="sm" className="min-w-[7rem] rounded-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size} / page
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <div className="flex items-center gap-1 rounded-full border border-[var(--border-subtle)] bg-background/80 p-1 shadow-[var(--elevation-xs)]">
          <button
            type="button"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className={cn(
              'inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-[var(--text-primary)] transition-colors duration-[var(--duration-fast)]',
              'hover:bg-[var(--surface-hover)]',
              'disabled:cursor-not-allowed disabled:opacity-40',
            )}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>

          <div className="flex items-center gap-1 px-1">
            {pages.map((p, i) =>
              p === 'ellipsis' ? (
                <span
                  key={`ellipsis-${i}`}
                  className="flex h-8 w-8 select-none items-center justify-center text-sm text-[var(--text-secondary)]"
                >
                  …
                </span>
              ) : (
                <button
                  key={p}
                  type="button"
                  onClick={() => onPageChange(p as number)}
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors duration-[var(--duration-fast)]',
                    p === page
                      ? 'bg-primary text-primary-foreground shadow-[var(--elevation-xs)]'
                      : 'text-[var(--text-primary)] hover:bg-[var(--surface-hover)]',
                  )}
                >
                  {p}
                </button>
              ),
            )}
          </div>

          <button
            type="button"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className={cn(
              'inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-[var(--text-primary)] transition-colors duration-[var(--duration-fast)]',
              'hover:bg-[var(--surface-hover)]',
              'disabled:cursor-not-allowed disabled:opacity-40',
            )}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
