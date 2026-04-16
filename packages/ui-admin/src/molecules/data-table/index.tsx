'use client'

import React from 'react'

import { ArrowDown, ArrowUp, ChevronsUpDown, Search } from 'lucide-react'

import {
  Table,
  TableHeader as BaseTableHeader,
  TableBody as BaseTableBody,
  TableRow as BaseTableRow,
  TableHead as BaseTableHead,
  TableCell as BaseTableCell,
  Checkbox,
  Input,
  cn,
} from '@ecom/ui'

const DataTableContext = React.createContext<{
  selectable?: boolean
  selectedKeys?: (string | number)[]
  onSelectionChange?: (keys: (string | number)[]) => void
  zebraStriping?: boolean
} | null>(null)

export function useDataTable() {
  const context = React.useContext(DataTableContext)
  if (!context) {
    throw new Error('DataTable components must be used within DataTable')
  }
  return context
}

export interface DataTableProps extends React.HTMLAttributes<HTMLDivElement> {
  selectable?: boolean
  selectedKeys?: (string | number)[]
  onSelectionChange?: (keys: (string | number)[]) => void
  zebraStriping?: boolean
  stickyHeader?: boolean
}

function DataTable({
  selectable = false,
  selectedKeys = [],
  onSelectionChange,
  zebraStriping = false,
  stickyHeader = false,
  className,
  children,
  ...props
}: DataTableProps) {
  return (
    <DataTableContext.Provider
      value={{ selectable, selectedKeys, onSelectionChange, zebraStriping }}
    >
      <div
        className={cn(
          'admin-data-table flex flex-col',
          stickyHeader && '[&_.table-container]:max-h-[600px] [&_.table-container]:overflow-auto',
          className,
        )}
        {...props}
      >
        <div className="table-container relative w-full">
          <Table
            className={cn(
              stickyHeader &&
                '[&_thead]:sticky [&_thead]:top-0 [&_thead]:z-10 [&_thead]:bg-background',
            )}
          >
            {children}
          </Table>
        </div>
      </div>
    </DataTableContext.Provider>
  )
}

function DataTableToolbar({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('admin-data-table__toolbar', className)} {...props}>
      {children}
    </div>
  )
}

function DataTableBulkActions({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { selectedKeys } = useDataTable()

  if (!selectedKeys || selectedKeys.length === 0) return null

  return (
    <div className={cn('admin-data-table__bulk-bar', className)} {...props}>
      <span className="text-[var(--text-sm)] font-medium ml-2 mr-4 text-brand-foreground">
        {selectedKeys.length} selected
      </span>
      {children}
    </div>
  )
}

type DataTableHeaderProps = React.HTMLAttributes<HTMLTableSectionElement>

function DataTableHeader({ className, children, ...props }: DataTableHeaderProps) {
  return (
    <BaseTableHeader className={className} {...props}>
      {children}
    </BaseTableHeader>
  )
}

interface DataTableColumnProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  sortable?: boolean
  sortDirection?: 'asc' | 'desc' | null
  onSort?: () => void
}

function DataTableColumn({
  sortable,
  sortDirection,
  onSort,
  className,
  children,
  ...props
}: DataTableColumnProps) {
  if (!sortable) {
    return (
      <BaseTableHead className={className} {...props}>
        {children}
      </BaseTableHead>
    )
  }

  return (
    <BaseTableHead className={className} {...props}>
      <button
        type="button"
        onClick={onSort}
        className={cn(
          'flex items-center gap-1 hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded px-1 -ml-1',
          sortDirection && 'text-foreground',
        )}
      >
        {children}
        <span className="w-4 h-4 flex items-center justify-center">
          {sortDirection === 'asc' ? (
            <ArrowUp className="w-3 h-3" />
          ) : sortDirection === 'desc' ? (
            <ArrowDown className="w-3 h-3" />
          ) : (
            <ChevronsUpDown className="w-3 h-3 opacity-50" />
          )}
        </span>
      </button>
    </BaseTableHead>
  )
}

function DataTableBody({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <BaseTableBody className={className} {...props}>
      {children}
    </BaseTableBody>
  )
}

interface DataTableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  rowKey?: string | number
  isSelected?: boolean
}

function DataTableRow({ rowKey, isSelected, className, children, ...props }: DataTableRowProps) {
  const { zebraStriping, selectable, selectedKeys, onSelectionChange } = useDataTable()

  const selected = isSelected ?? (rowKey !== undefined && selectedKeys?.includes(rowKey))

  const handleSelect = () => {
    if (!selectable || !onSelectionChange || rowKey === undefined) return
    if (selected) {
      onSelectionChange(selectedKeys!.filter((k) => k !== rowKey))
    } else {
      onSelectionChange([...(selectedKeys || []), rowKey])
    }
  }

  return (
    <BaseTableRow
      data-state={selected ? 'selected' : undefined}
      className={cn(
        zebraStriping && 'even:bg-muted/20',
        'transition-colors duration-[var(--motion-fast)]',
        className,
      )}
      {...props}
    >
      {selectable && (
        <BaseTableCell className="w-[40px] px-4">
          <Checkbox checked={selected} onCheckedChange={handleSelect} aria-label={`Select row`} />
        </BaseTableCell>
      )}
      {children}
    </BaseTableRow>
  )
}

interface DataTableCellProps extends Omit<React.TdHTMLAttributes<HTMLTableCellElement>, 'align'> {
  align?: 'left' | 'center' | 'right' | 'numeric'
}

function DataTableCell({ align = 'left', className, children, ...props }: DataTableCellProps) {
  return (
    <BaseTableCell
      className={cn(
        align === 'center' && 'text-center',
        align === 'right' && 'text-right',
        align === 'numeric' && 'text-right tabular-nums',
        className,
      )}
      {...props}
    >
      {children}
    </BaseTableCell>
  )
}

function DataTableFilter({
  placeholder = 'Search...',
  value,
  onChange,
  className,
}: {
  placeholder?: string
  value: string
  onChange: (value: string) => void
  className?: string
}) {
  return (
    <div className={cn('relative max-w-sm w-full', className)}>
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9"
      />
    </div>
  )
}

function DataTableEmpty({
  colSpan,
  className,
  children = 'No results found.',
}: React.TdHTMLAttributes<HTMLTableCellElement> & { colSpan: number }) {
  return (
    <BaseTableRow>
      <BaseTableCell
        colSpan={colSpan}
        className={cn('h-24 text-center text-muted-foreground', className)}
      >
        {children}
      </BaseTableCell>
    </BaseTableRow>
  )
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
}
