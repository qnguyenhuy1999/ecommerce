'use client'

import React from 'react'

import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  ChevronsUpDown,
  PackageX,
  Pencil,
  Search,
  X,
  XCircle,
} from 'lucide-react'

import {
  Badge,
  Checkbox,
  cn,
  Input,
  Kbd,
  Table as BaseTable,
  TableBody as BaseTableBody,
  TableCell as BaseTableCell,
  TableHead as BaseTableHead,
  TableHeader as BaseTableHeader,
  TableRow as BaseTableRow,
} from '@ecom/ui'

/* ─── Context ──────────────────────────────────────────────────────────────── */

interface DataTableContextValue {
  selectable: boolean
  selectedKeys: (string | number)[]
  onSelectionChange?: (keys: (string | number)[]) => void
  /** Row keys currently rendered (ex: current page). Enables "select all on page". */
  allRowKeys?: (string | number)[]
  zebraStriping: boolean
  stickyHeader: boolean
  density: 'compact' | 'default' | 'comfortable'
  loading: boolean
}

const DataTableContext = React.createContext<DataTableContextValue | null>(null)

export function useDataTable() {
  const ctx = React.useContext(DataTableContext)
  if (!ctx) throw new Error('DataTable sub-components must be used within <DataTable>.')
  return ctx
}

type DataTableSection = 'header' | 'body'

const DataTableSectionContext = React.createContext<DataTableSection>('body')

function useDataTableSection() {
  return React.useContext(DataTableSectionContext)
}

/* ─── Root ────────────────────────────────────────────────────────────────── */

export interface DataTableProps extends Omit<
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

function DataTable({
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
      React.isValidElement(c) &&
      (c.type as React.ComponentType<unknown>) === DataTableBulkActions,
  ) as React.ReactElement<React.HTMLAttributes<HTMLDivElement>> | undefined

  const paginationChild = childArray.find(
    (c) =>
      React.isValidElement(c) &&
      (c.type as React.ComponentType<unknown>) === DataTablePagination,
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

        <BaseTable
          containerClassName={cn(stickyHeader && 'max-h-[var(--space-96)]')}
          className={cn(
            'w-full caption-bottom text-sm',
            tableLayout === 'fixed' ? 'table-fixed' : 'table-auto',
          )}
        >
          {tableChildren}
        </BaseTable>

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

/* ─── Toolbar ──────────────────────────────────────────────────────────────── */

export interface DataTableToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Optional heading shown on the left side. */
  heading?: React.ReactNode
  /** Optional subheading under the title. */
  subheading?: React.ReactNode
  /** Left side content — typically search + filter inputs. */
  left?: React.ReactNode
  /** Right side content — typically action buttons. */
  right?: React.ReactNode
}

function DataTableToolbar({
  heading,
  subheading,
  left,
  right,
  className,
  children,
  ...props
}: DataTableToolbarProps) {
  const { density } = useDataTable()
  const paddingY = density === 'compact' ? 'py-2.5' : density === 'comfortable' ? 'py-3.5' : 'py-3'

  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-between gap-3 px-4',
        paddingY,
        'border-b border-border/60 shrink-0',
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {(heading || subheading) && (
          <div className="min-w-0">
            {heading && (
              <p className="text-[var(--text-base)] font-semibold text-foreground leading-tight truncate">
                {heading}
              </p>
            )}
            {subheading && (
              <p className="mt-0.5 text-[var(--text-sm)] text-muted-foreground truncate">
                {subheading}
              </p>
            )}
          </div>
        )}
        {left && <div className="flex items-center gap-2 min-w-0">{left}</div>}
      </div>
      {right ? (
        <div className="flex items-center gap-2 shrink-0">{right}</div>
      ) : children ? (
        <div className="flex items-center gap-2 shrink-0">{children}</div>
      ) : null}
    </div>
  )
}

/* ─── Bulk Actions ─────────────────────────────────────────────────────────── */

function DataTableBulkActions({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { selectedKeys } = useDataTable()

  if (!selectedKeys || selectedKeys.length === 0) return null

  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-2.5',
        'bg-[var(--intent-info-muted)] border-b border-border/60',
        'animate-in slide-in-from-top-2 fade-in duration-200',
        className,
      )}
      {...props}
    >
      <span className="text-[var(--text-sm)] font-medium text-[var(--intent-info)]">
        {selectedKeys.length} selected
      </span>
      <span className="h-4 w-px bg-[var(--intent-info)]/20" />
      {children}
    </div>
  )
}

/* ─── Column Header ───────────────────────────────────────────────────────── */

export interface DataTableColumnProps extends Omit<React.ThHTMLAttributes<HTMLTableCellElement>, 'align'> {
  sortable?: boolean
  sortDirection?: 'asc' | 'desc' | null
  onSort?: () => void
  align?: 'left' | 'center' | 'right' | 'numeric'
  /** Visually indent the column header (for nested groups). */
  indent?: number
}

function DataTableColumn({
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

/* ─── Header ───────────────────────────────────────────────────────────────── */

type DataTableHeaderProps = React.HTMLAttributes<HTMLTableSectionElement>

function DataTableHeader({ className, children, ...props }: DataTableHeaderProps) {
  return (
    <DataTableSectionContext.Provider value="header">
      <BaseTableHeader className={cn(className)} {...props}>
        {children}
      </BaseTableHeader>
    </DataTableSectionContext.Provider>
  )
}

/* ─── Body ─────────────────────────────────────────────────────────────────── */

export interface DataTableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  /** Override loading for just the body. Defaults to DataTable `loading`. */
  loading?: boolean
  skeletonRowCount?: number
  skeletonColumnCount?: number
}

function DataTableBody({
  loading,
  skeletonRowCount = 6,
  skeletonColumnCount = 6,
  className,
  children,
  ...props
}: DataTableBodyProps) {
  const ctx = useDataTable()
  const isLoading = loading ?? ctx.loading

  return (
    <DataTableSectionContext.Provider value="body">
      <BaseTableBody className={cn('[&_tr:last-child]:border-0', className)} {...props}>
        {isLoading
          ? Array.from({ length: skeletonRowCount }).map((_, i) => (
              <DataTableSkeletonRow
                key={i}
                columnCount={skeletonColumnCount}
                selectable={ctx.selectable}
              />
            ))
          : children}
      </BaseTableBody>
    </DataTableSectionContext.Provider>
  )
}

/* ─── Row ──────────────────────────────────────────────────────────────────── */

export interface DataTableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  rowKey?: string | number
  isSelected?: boolean
  accent?: 'success' | 'warning' | 'danger' | 'info'
  onRowClick?: (e: React.MouseEvent<HTMLTableRowElement>) => void
}

function DataTableRow({
  rowKey,
  isSelected,
  accent,
  onRowClick,
  className,
  children,
  ...props
}: DataTableRowProps) {
  const section = useDataTableSection()
  const { zebraStriping, selectable, selectedKeys, onSelectionChange, allRowKeys } = useDataTable()

  const selected =
    isSelected ??
    (section === 'body' && rowKey !== undefined ? selectedKeys?.includes(rowKey) : false)

  const accentBorder =
    accent === 'success'
      ? 'border-l-[var(--intent-success)]'
      : accent === 'warning'
        ? 'border-l-[var(--intent-warning)]'
        : accent === 'danger'
          ? 'border-l-[var(--intent-danger)]'
          : accent === 'info'
            ? 'border-l-[var(--intent-info)]'
            : undefined

  const pageKeys = allRowKeys ?? []
  const pageSelectedCount = pageKeys.filter((k) => selectedKeys?.includes(k)).length
  const isAllPageSelected = pageKeys.length > 0 && pageSelectedCount === pageKeys.length
  const isSomePageSelected = pageSelectedCount > 0 && !isAllPageSelected

  const toggleRow = (key: string | number, next: boolean) => {
    if (!onSelectionChange) return
    const existing = selectedKeys ?? []
    onSelectionChange(
      next ? Array.from(new Set([...existing, key])) : existing.filter((k) => k !== key),
    )
  }

  const toggleAllOnPage = (next: boolean) => {
    if (!onSelectionChange) return
    const existing = selectedKeys ?? []
    if (pageKeys.length === 0) return
    if (next) {
      onSelectionChange(Array.from(new Set([...existing, ...pageKeys])))
    } else {
      const pageKeySet = new Set(pageKeys)
      onSelectionChange(existing.filter((k) => !pageKeySet.has(k)))
    }
  }

  const interactive = section === 'body' && !!onRowClick

  const handleRowKeyDown = (e: React.KeyboardEvent<HTMLTableRowElement>) => {
    if (!interactive) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onRowClick?.(e as unknown as React.MouseEvent<HTMLTableRowElement>)
    }
  }

  return (
    <BaseTableRow
      data-state={section === 'body' && selected ? 'selected' : undefined}
      onClick={onRowClick}
      onKeyDown={handleRowKeyDown}
      tabIndex={interactive ? 0 : undefined}
      className={cn(
        section === 'header'
          ? 'border-b border-border/60'
          : 'border-b border-border/60 transition-colors duration-[var(--motion-fast)] group/row',
        section === 'body' && zebraStriping && 'even:bg-muted/10',
        section === 'body' &&
          (selected
            ? 'bg-[var(--state-selected)] hover:bg-[var(--state-selected)]'
            : 'hover:bg-[var(--state-hover)]'),
        section === 'body' && accent && ['border-l-2', accentBorder],
        interactive &&
          'cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className,
      )}
      {...props}
    >
      {selectable && (
        <>
          {section === 'header' ? (
            <BaseTableHead className="w-[var(--space-12)] px-4">
              <Checkbox
                checked={isAllPageSelected ? true : isSomePageSelected ? 'indeterminate' : false}
                disabled={!onSelectionChange || pageKeys.length === 0}
                aria-label="Select all rows on this page"
                onClick={(e) => e.stopPropagation()}
                onCheckedChange={(next) => toggleAllOnPage(Boolean(next))}
              />
            </BaseTableHead>
          ) : (
            <BaseTableCell className="w-[var(--space-12)] px-4">
              <Checkbox
                checked={selected}
                disabled={!onSelectionChange || rowKey === undefined}
                aria-label={`Select row ${rowKey}`}
                onClick={(e) => e.stopPropagation()}
                onCheckedChange={(next) => {
                  if (rowKey === undefined) return
                  toggleRow(rowKey, Boolean(next))
                }}
              />
            </BaseTableCell>
          )}
        </>
      )}
      {children}
    </BaseTableRow>
  )
}

/* ─── Cell ─────────────────────────────────────────────────────────────────── */

export interface DataTableCellProps extends Omit<React.TdHTMLAttributes<HTMLTableCellElement>, 'align'> {
  align?: 'left' | 'center' | 'right' | 'numeric'
  truncate?: boolean
  muted?: boolean
  /** Prevent child text from wrapping (useful for SKUs, codes, badges). */
  noWrap?: boolean
}

function DataTableCell({
  align = 'left',
  truncate = false,
  noWrap = false,
  className,
  children,
  muted,
  ...props
}: DataTableCellProps) {
  const { density } = useDataTable()

  const paddingY = density === 'compact' ? 'py-2' : density === 'comfortable' ? 'py-4' : 'py-3'
  const paddingX = density === 'compact' ? 'px-3' : 'px-4'

  return (
    <BaseTableCell
      className={cn(
        paddingX,
        paddingY,
        'align-middle text-[var(--text-sm)] text-foreground',
        align === 'center' && 'text-center',
        align === 'right' && 'text-right',
        align === 'numeric' && 'text-right tabular-nums',
        truncate && 'max-w-[var(--space-48)] truncate overflow-hidden',
        noWrap && 'whitespace-nowrap',
        muted && 'text-muted-foreground',
        className,
      )}
      {...props}
    >
      {children}
    </BaseTableCell>
  )
}

/* ─── Filter ───────────────────────────────────────────────────────────────── */

export interface DataTableFilterProps {
  placeholder?: string
  value: string
  onChange: (value: string) => void
  className?: string
}

function DataTableFilter({
  placeholder = 'Search...',
  value,
  onChange,
  className,
}: DataTableFilterProps) {
  return (
    <div className={cn('relative w-full max-w-xs', className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      <Input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Escape' && value) onChange('')
        }}
        className="pl-9 pr-8 h-8 text-[var(--text-sm)] bg-muted/50 border-border/60 focus:bg-background"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Clear search"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  )
}

/* ─── Empty ────────────────────────────────────────────────────────────────── */

export interface DataTableEmptyProps extends React.HTMLAttributes<HTMLTableRowElement> {
  colSpan: number
  icon?: React.ReactNode
  title?: string
  description?: string
  action?: React.ReactNode
}

function DataTableEmpty({
  colSpan,
  icon,
  title = 'No results found',
  description = "Try adjusting your search or filter to find what you're looking for.",
  action,
  className,
  children,
}: DataTableEmptyProps) {
  return (
    <BaseTableRow>
      <BaseTableCell colSpan={colSpan} className={cn('h-32 text-center', className)}>
        <div className="flex flex-col items-center gap-3 py-4">
          {icon ? (
            <span className="text-muted-foreground/50 flex items-center justify-center">
              {icon}
            </span>
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/50">
              <PackageX className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
          <div>
            {title && (
              <p className="text-[var(--text-base)] font-semibold text-foreground">{title}</p>
            )}
            {description && (
              <p className="mt-1 text-[var(--text-sm)] text-muted-foreground max-w-xs mx-auto">
                {description}
              </p>
            )}
          </div>
          {action}
          {!action && children && <div className="mt-1">{children}</div>}
        </div>
      </BaseTableCell>
    </BaseTableRow>
  )
}

/* ─── Pagination ───────────────────────────────────────────────────────────── */

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

function DataTablePagination({
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
        {[
          { icon: 'first', aria: 'First page', disabled: page <= 1, action: () => onPageChange(1) },
          {
            icon: 'prev',
            aria: 'Previous page',
            disabled: page <= 1,
            action: () => onPageChange(page - 1),
          },
        ].map(({ icon, aria, disabled, action }) => (
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

        {[
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
        ].map(({ icon, aria, disabled, action }) => (
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

/* ─── Skeleton Row ────────────────────────────────────────────────────────── */

export interface DataTableSkeletonRowProps {
  columnCount?: number
  selectable?: boolean
  className?: string
}

function DataTableSkeletonRow({
  columnCount = 5,
  selectable = false,
  className,
}: DataTableSkeletonRowProps) {
  const { density } = useDataTable()
  const paddingY = density === 'compact' ? 'py-2' : density === 'comfortable' ? 'py-4' : 'py-3'
  const paddingX = density === 'compact' ? 'px-3' : 'px-4'

  return (
    <BaseTableRow className={cn('border-b border-border/60', className)}>
      {selectable && (
        <BaseTableCell className={cn('w-[var(--space-12)]', paddingX, paddingY)}>
          <div className="h-4 w-4 rounded bg-muted animate-pulse" />
        </BaseTableCell>
      )}
      {Array.from({ length: columnCount }).map((_, i) => (
        <BaseTableCell key={i} className={cn(paddingX, paddingY)}>
          <div
            className="h-4 rounded bg-muted animate-pulse"
            style={{ width: `${60 + ((i * 17) % 35)}%` }}
          />
        </BaseTableCell>
      ))}
    </BaseTableRow>
  )
}

/* ─── StatusBadge helper ──────────────────────────────────────────────────── */

export interface DataTableStatusBadgeProps {
  status: 'active' | 'low_stock' | 'out_of_stock' | 'draft'
  className?: string
}

const DATA_TABLE_STATUS_CONFIG = {
  active: {
    label: 'Active',
    variant: 'success' as const,
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
  },
  low_stock: {
    label: 'Low Stock',
    variant: 'warning' as const,
    icon: <AlertTriangle className="h-3.5 w-3.5" />,
  },
  out_of_stock: {
    label: 'Out of Stock',
    variant: 'destructive' as const,
    icon: <XCircle className="h-3.5 w-3.5" />,
  },
  draft: {
    label: 'Draft',
    variant: 'secondary' as const,
    icon: <Pencil className="h-3.5 w-3.5" />,
  },
} as const

export function DataTableStatusBadge({ status, className }: DataTableStatusBadgeProps) {
  const { label, variant, icon } = DATA_TABLE_STATUS_CONFIG[status] ?? DATA_TABLE_STATUS_CONFIG.draft
  return (
    <Badge variant={variant} size="sm" icon={icon} className={cn('shrink-0', className)}>
      {label}
    </Badge>
  )
}

/* ─── Export ──────────────────────────────────────────────────────────────── */

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
}
