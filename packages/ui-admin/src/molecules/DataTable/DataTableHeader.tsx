import React from 'react'

import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react'

import { TableHead as BaseTableHead, TableHeader as BaseTableHeader, cn } from '@ecom/ui'

import { DataTableSectionContext, useDataTable } from './DataTableContext'

export interface DataTableColumnProps extends Omit<
  React.ThHTMLAttributes<HTMLTableCellElement>,
  'align'
> {
  sortable?: boolean
  sortDirection?: 'asc' | 'desc' | null
  onSort?: () => void
  align?: 'left' | 'center' | 'right' | 'numeric'
  /** Visually indent the column header (for nested groups). */
  indent?: number
}

export function DataTableColumn({
  sortable,
  sortDirection,
  onSort,
  align = 'left',
  indent = 0,
  className,
  children,
  ...props
}: DataTableColumnProps) {
  const { stickyHeader, density } = useDataTable()

  const headerHeight = density === 'compact' ? 'h-10' : density === 'comfortable' ? 'h-12' : 'h-11'

  const ariaSort: React.AriaAttributes['aria-sort'] | undefined =
    sortable && sortDirection === 'asc'
      ? 'ascending'
      : sortable && sortDirection === 'desc'
        ? 'descending'
        : sortable
          ? 'none'
          : undefined

  const content = sortable ? (
    <button
      type="button"
      onClick={onSort}
      className={cn(
        'group/sort inline-flex items-center justify-between gap-2 font-medium w-full',
        'hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded px-1 -ml-1',
        sortDirection ? 'text-foreground' : 'text-muted-foreground',
        '[&>svg]:transition-transform [&>svg]:duration-150',
      )}
    >
      <span className="truncate">{children}</span>
      <span
        className={cn(
          'w-4 h-4 flex items-center justify-center shrink-0',
          !sortDirection &&
            'opacity-0 group-hover/sort:opacity-60 group-focus-visible/sort:opacity-60',
        )}
      >
        {sortDirection === 'asc' ? (
          <ArrowUp className="w-3.5 h-3.5 text-[var(--intent-info)]" />
        ) : sortDirection === 'desc' ? (
          <ArrowDown className="w-3.5 h-3.5 text-[var(--intent-info)]" />
        ) : (
          <ChevronsUpDown className="w-3.5 h-3.5 opacity-40" />
        )}
      </span>
    </button>
  ) : (
    <span>{children}</span>
  )

  return (
    <BaseTableHead
      className={cn(
        headerHeight,
        'px-4 text-left align-middle font-medium text-muted-foreground select-none',
        stickyHeader && [
          'sticky top-0 z-20',
          'bg-background/95 backdrop-blur',
          'supports-[backdrop-filter]:bg-background/60',
        ],
        align === 'center' && 'text-center',
        (align === 'right' || align === 'numeric') && 'text-right',
        indent > 0 && 'pl-4',
        className,
      )}
      style={indent > 0 ? { paddingLeft: `calc(var(--space-4) * ${indent + 1})` } : undefined}
      scope="col"
      aria-sort={ariaSort}
      {...props}
    >
      {content}
    </BaseTableHead>
  )
}

/* ─── Header ──────────────────────────────────────────────────────────────────── */

type DataTableHeaderProps = React.HTMLAttributes<HTMLTableSectionElement>

export function DataTableHeader({ className, children, ...props }: DataTableHeaderProps) {
  return (
    <DataTableSectionContext.Provider value="header">
      <BaseTableHeader className={cn('border-b border-border/60', className)} {...props}>
        {children}
      </BaseTableHeader>
    </DataTableSectionContext.Provider>
  )
}
