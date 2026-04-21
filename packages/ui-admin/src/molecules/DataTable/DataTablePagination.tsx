'use client'

import React from 'react'

import { cn, Kbd } from '@ecom/ui'

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
          <select
            value={pageSize}
            onChange={(e) => {
              onPageSizeChange(Number(e.target.value))
              onPageChange(1)
            }}
            className={cn(
              'h-8 pl-2 pr-7 rounded-md border border-border/60 bg-background text-[var(--text-sm)]',
              'focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer appearance-none',
              'bg-[length:var(--space-3)] bg-no-repeat bg-[right_var(--space-1)_center]',
              'bg-[url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22currentColor%22%20d%3D%22M3%204l3%203%203-3%22%2F%3E%3C%2Fsvg%3E")]',
            )}
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Summary */}
      <span className="text-muted-foreground tabular-nums shrink-0 text-[var(--text-xs)]">
        Showing <span className="font-medium text-foreground">{start}</span>
        {' – '}
        <span className="font-medium text-foreground">{end}</span>
        {' of '}
        <span className="font-medium text-foreground">{totalRows.toLocaleString()}</span>
      </span>

      {/* Page navigation */}
      <div className="flex items-center gap-1 shrink-0">
        {(
          [
            {
              icon: 'first',
              aria: 'First page',
              disabled: page <= 1,
              action: () => onPageChange(1),
            },
            {
              icon: 'prev',
              aria: 'Previous page',
              disabled: page <= 1,
              action: () => onPageChange(page - 1),
            },
          ] as const
        ).map(({ icon, aria, disabled, action }) => (
          <button
            key={icon}
            type="button"
            onClick={action}
            disabled={disabled}
            aria-label={aria}
            className={cn(
              'inline-flex items-center justify-center h-8 w-8 rounded-md',
              'text-muted-foreground hover:text-foreground hover:bg-muted/80',
              'transition-colors duration-[var(--motion-fast)]',
              'disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent',
            )}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              {icon === 'first' ? (
                <>
                  <path
                    d="M9 2L4 7l5 5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path d="M3 2v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </>
              ) : (
                <path
                  d="M9 2L4 7l5 5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
            </svg>
          </button>
        ))}

        {/* Page numbers */}
        {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
          let pageNum: number
          if (totalPages <= 7) pageNum = i + 1
          else if (page <= 4) pageNum = i + 1
          else if (page >= totalPages - 3) pageNum = totalPages - 6 + i
          else pageNum = page - 3 + i

          const isCurrent = pageNum === page
          return (
            <button
              key={pageNum}
              type="button"
              onClick={() => onPageChange(pageNum)}
              className={cn(
                'inline-flex items-center justify-center h-8 min-w-[2rem] rounded-md px-1.5',
                'text-[var(--text-sm)] font-medium transition-colors duration-[var(--motion-fast)]',
                isCurrent
                  ? 'bg-[var(--intent-info)] text-[var(--intent-info-foreground)] shadow-[var(--shadow-xs)]'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/80',
              )}
            >
              {pageNum}
            </button>
          )
        })}

        {(
          [
            {
              icon: 'next',
              aria: 'Next page',
              disabled: page >= totalPages,
              action: () => onPageChange(page + 1),
            },
            {
              icon: 'last',
              aria: 'Last page',
              disabled: page >= totalPages,
              action: () => onPageChange(totalPages),
            },
          ] as const
        ).map(({ icon, aria, disabled, action }) => (
          <button
            key={icon}
            type="button"
            onClick={action}
            disabled={disabled}
            aria-label={aria}
            className={cn(
              'inline-flex items-center justify-center h-8 w-8 rounded-md',
              'text-muted-foreground hover:text-foreground hover:bg-muted/80',
              'transition-colors duration-[var(--motion-fast)]',
              'disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent',
            )}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              {icon === 'last' ? (
                <>
                  <path
                    d="M5 2l5 5-5 5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M11 2v10"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </>
              ) : (
                <path
                  d="M5 2l5 5-5 5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
            </svg>
          </button>
        ))}
      </div>

      {/* Keyboard shortcut */}
      <Kbd className="hidden lg:inline-flex items-center gap-1 text-[var(--text-xs)] text-muted-foreground">
        <span>←</span>
        <span>→</span>
        <span>navigate</span>
      </Kbd>
    </div>
  )
}
