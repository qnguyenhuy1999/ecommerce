'use client'

import React from 'react'

import {
  cn,
  Kbd,
  Pagination,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@ecom/ui'

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
  const start = Math.min((page - 1) * pageSize + 1, totalRows)
  const end = Math.min(page * pageSize, totalRows)

  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-between gap-4 px-4 py-3',
        'border-t border-border/60 bg-muted/20',
        'text-[var(--text-sm)] shrink-0',
        className,
      )}
      {...props}
    >
      {/* Page size */}
      {showPageSizeSelect && onPageSizeChange && (
        <div className="flex items-center gap-2 text-muted-foreground shrink-0">
          <span className="whitespace-nowrap text-[var(--text-xs)]">Rows per page</span>
          <Select
            value={String(pageSize)}
            onValueChange={(nextValue) => {
              onPageSizeChange(Number(nextValue))
              onPageChange(1)
            }}
          >
            <SelectTrigger size="sm" className="w-[5rem]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Summary */}
      <span className="text-muted-foreground tabular-nums shrink-0 text-[var(--text-xs)]">
        Showing <span className="font-medium text-foreground">{start}</span>
        {' - '}
        <span className="font-medium text-foreground">{end}</span>
        {' of '}
        <span className="font-medium text-foreground">{totalRows.toLocaleString()}</span>
      </span>

      {/* Page navigation */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
        className="shrink-0"
      />

      {/* Keyboard shortcut */}
      <Kbd className="hidden lg:inline-flex items-center gap-1 text-[var(--text-xs)] text-muted-foreground">
        <span>←</span>
        <span>→</span>
        <span>navigate</span>
      </Kbd>
    </div>
  )
}
