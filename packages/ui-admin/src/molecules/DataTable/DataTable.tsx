import React from 'react'

import { cn, Table } from '@ecom/ui'

import { DataTableContext } from './DataTableContext'

import { DataTableToolbar } from './DataTableToolbar'
import { DataTableBulkActions } from './DataTableBulkActions'
import { DataTableHeader, DataTableColumn } from './DataTableHeader'
import { DataTableBody } from './DataTableBody'
import { DataTableRow } from './DataTableRow'
import { DataTableCell } from './DataTableCell'
import { DataTableFilter } from './DataTableFilter'
import { DataTableEmpty } from './DataTableEmpty'
import { DataTablePagination } from './DataTablePagination'
import { DataTableSkeletonRow } from './DataTableSkeletonRow'
import { DataTableStatusBadge } from './DataTableStatusBadge'
import type { DataTableToolbarProps } from './DataTableToolbar'
import type { DataTableColumnProps } from './DataTableHeader'
import type { DataTableBodyProps } from './DataTableBody'
import type { DataTableRowProps } from './DataTableRow'
import type { DataTableCellProps } from './DataTableCell'
import type { DataTableFilterProps } from './DataTableFilter'
import type { DataTableEmptyProps } from './DataTableEmpty'
import type { DataTablePaginationProps } from './DataTablePagination'
import type { DataTableSkeletonRowProps } from './DataTableSkeletonRow'
import type { DataTableStatusBadgeProps } from './DataTableStatusBadge'

/* ─── Root ────────────────────────────────────────────────────────────────── */

interface DataTableProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'title' | 'description'
> {
  /** Enables row selection with checkboxes. */
  selectable?: boolean
  selectedKeys?: (string | number)[]
  onSelectionChange?: (keys: (string | number)[]) => void
  /**
   * Row keys currently rendered (ex: current page). Enables "select all on page".
   * If omitted, the header checkbox is disabled.
   */
  allRowKeys?: (string | number)[]
  /** Alternating row background shading. */
  zebraStriping?: boolean
  /** Sticky column headers during scroll. */
  stickyHeader?: boolean
  /** Density mode for row height / padding. */
  density?: 'compact' | 'default' | 'comfortable'
  /** @deprecated Use `density="compact"` */
  compact?: boolean
  /** Wrap the table in a polished card with shadow and border-radius. */
  card?: boolean
  /** Title displayed in the card header. */
  title?: React.ReactNode
  /** Subtitle / description under the title. */
  description?: React.ReactNode
  /** Total number of rows (used for pagination). */
  totalRows?: number
  /** Show a loading state. */
  loading?: boolean
  /** Table layout algorithm. */
  tableLayout?: 'auto' | 'fixed'
}

function DataTableRoot({
  selectable = false,
  selectedKeys = [],
  onSelectionChange,
  allRowKeys,
  zebraStriping = false,
  stickyHeader = false,
  density,
  compact = false,
  card = false,
  title,
  description,
  className,
  children,
  loading = false,
  tableLayout = 'auto',
  ...props
}: DataTableProps) {
  const resolvedDensity = density ?? (compact ? 'compact' : 'default')

  const childArray = React.Children.toArray(children)
  const toolbarChild = childArray.find(
    (c) => React.isValidElement(c) && (c.type as React.ComponentType<unknown>) === DataTableToolbar,
  ) as React.ReactElement<DataTableToolbarProps> | undefined

  const bulkActionsChild = childArray.find(
    (c) =>
      React.isValidElement(c) && (c.type as React.ComponentType<unknown>) === DataTableBulkActions,
  ) as React.ReactElement<React.HTMLAttributes<HTMLDivElement>> | undefined

  const paginationChild = childArray.find(
    (c) =>
      React.isValidElement(c) && (c.type as React.ComponentType<unknown>) === DataTablePagination,
  ) as React.ReactElement<DataTablePaginationProps> | undefined

  const tableChildren = childArray.filter((c) => {
    if (!React.isValidElement(c)) return true
    const t = c.type as React.ComponentType<unknown>
    return t !== DataTableToolbar && t !== DataTableBulkActions && t !== DataTablePagination
  })

  return (
    <DataTableContext.Provider
      value={{
        selectable,
        selectedKeys,
        onSelectionChange,
        allRowKeys,
        zebraStriping,
        stickyHeader,
        density: resolvedDensity,
        loading,
      }}
    >
      <div
        className={cn(
          'admin-data-table group',
          card && [
            'flex flex-col',
            'rounded-[var(--radius-md)] border border-border bg-background',
            'shadow-[var(--elevation-card)] transition-shadow duration-[var(--motion-normal)]',
            'hover:shadow-[var(--elevation-hover)]',
          ],
          !card && 'flex flex-col',
          className,
        )}
        {...props}
      >
        {/* Card header */}
        {(title || description) && card && (
          <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-border/60 shrink-0">
            <div>
              {title && (
                <h2 className="text-[var(--text-lg)] font-semibold text-foreground leading-tight">
                  {title}
                </h2>
              )}
              {description && (
                <p className="mt-0.5 text-[var(--text-sm)] text-muted-foreground">{description}</p>
              )}
            </div>
          </div>
        )}

        {/* Toolbar & bulk actions sit ABOVE the table (outside <table>) */}
        {toolbarChild}
        {bulkActionsChild}

        <Table
          containerClassName={cn(stickyHeader && 'max-h-[var(--space-96)]')}
          className={cn(
            'w-full caption-bottom text-sm',
            tableLayout === 'fixed' ? 'table-fixed' : 'table-auto',
          )}
        >
          {tableChildren}
        </Table>

        {/* Pagination sits BELOW the table (outside <table>) */}
        {paginationChild}

        {/* Footer info bar — only rendered when NOT using Pagination sub-component */}
        {!paginationChild && props.totalRows !== undefined && (
          <div className="px-4 py-3 border-t border-border/60 text-[var(--text-xs)] text-muted-foreground shrink-0">
            {props.totalRows} {props.totalRows === 1 ? 'item' : 'items'}
          </div>
        )}
      </div>
    </DataTableContext.Provider>
  )
}

/* ─── Compound namespace ─────────────────────────────────────────────────── */

const DataTable = Object.assign(DataTableRoot, {
  Toolbar: DataTableToolbar,
  BulkActions: DataTableBulkActions,
  Header: DataTableHeader,
  Column: DataTableHeader,
  Body: DataTableBody,
  Row: DataTableRow,
  Cell: DataTableCell,
  Filter: DataTableFilter,
  Empty: DataTableEmpty,
  Pagination: DataTablePagination,
  SkeletonRow: DataTableSkeletonRow,
  StatusBadge: DataTableStatusBadge,
}) as typeof DataTableRoot & {
  Toolbar: typeof DataTableToolbar
  BulkActions: typeof DataTableBulkActions
  Header: typeof DataTableHeader
  Column: typeof DataTableHeader
  Body: typeof DataTableBody
  Row: typeof DataTableRow
  Cell: typeof DataTableCell
  Filter: typeof DataTableFilter
  Empty: typeof DataTableEmpty
  Pagination: typeof DataTablePagination
  SkeletonRow: typeof DataTableSkeletonRow
  StatusBadge: typeof DataTableStatusBadge
}

export {
  DataTable,
  DataTableToolbar,
  DataTableBulkActions,
  DataTableHeader,
  DataTableColumn,
  DataTableBody,
  DataTableRow,
  DataTableCell,
  DataTableFilter,
  DataTableEmpty,
  DataTablePagination,
  DataTableSkeletonRow,
  DataTableStatusBadge,
}

export type {
  DataTableProps,
  DataTableToolbarProps,
  DataTableColumnProps,
  DataTableBodyProps,
  DataTableRowProps,
  DataTableCellProps,
  DataTableFilterProps,
  DataTableEmptyProps,
  DataTablePaginationProps,
  DataTableSkeletonRowProps,
  DataTableStatusBadgeProps,
}
