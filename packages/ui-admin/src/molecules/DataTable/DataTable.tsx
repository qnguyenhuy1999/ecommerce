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

interface DataTableProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'title' | 'description'
> {
  selectable?: boolean
  selectedKeys?: (string | number)[]
  onSelectionChange?: (keys: (string | number)[]) => void
  allRowKeys?: (string | number)[]
  zebraStriping?: boolean
  stickyHeader?: boolean
  density?: 'compact' | 'default' | 'comfortable'
  compact?: boolean
  card?: boolean
  title?: React.ReactNode
  description?: React.ReactNode
  totalRows?: number
  loading?: boolean
  tableLayout?: 'auto' | 'fixed'
  containerClassName?: string
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
  containerClassName,
  ...props
}: DataTableProps) {
  const resolvedDensity = density ?? (compact ? 'compact' : 'default')

  const childArray = React.useMemo(() => React.Children.toArray(children), [children])
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
          'overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-base)]/96 backdrop-blur-[10px]',
          card && 'shadow-[var(--elevation-surface)]',
          !card && 'flex flex-col',
          className,
        )}
        {...props}
      >
        {(title || description) && card && (
          <div className="shrink-0 border-b border-[var(--border-subtle)] bg-[var(--surface-elevated)]/85 px-5 pb-4 pt-5">
            <div>
              {title && (
                <h2 className="text-[var(--font-size-heading-sm)] font-semibold leading-tight text-foreground">
                  {title}
                </h2>
              )}
              {description && (
                <p className="mt-1 text-[var(--text-sm)] text-muted-foreground">{description}</p>
              )}
            </div>
          </div>
        )}

        {toolbarChild}
        {bulkActionsChild}

        <Table
          containerClassName={cn(
            stickyHeader && 'max-h-[var(--space-96)]',
            'bg-transparent',
            containerClassName,
          )}
          className={cn(
            'w-full caption-bottom text-sm',
            tableLayout === 'fixed' ? 'table-fixed' : 'table-auto',
          )}
        >
          {tableChildren}
        </Table>

        {paginationChild}

        {!paginationChild && props.totalRows !== undefined && (
          <div className="shrink-0 border-t border-[var(--border-subtle)] px-5 py-3 text-[var(--text-xs)] text-[var(--text-secondary)]">
            {props.totalRows} {props.totalRows === 1 ? 'item' : 'items'}
          </div>
        )}
      </div>
    </DataTableContext.Provider>
  )
}

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
