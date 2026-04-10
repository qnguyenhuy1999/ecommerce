import type * as React from 'react'

export type SortDirection = 'asc' | 'desc' | null

export interface ColumnDef<T> {
  key: keyof T | string
  header: string
  cell?: (row: T) => React.ReactNode
  sortable?: boolean
  className?: string
}

export interface DataTableProps<
  T extends Record<string, unknown> = Record<string, unknown>,
> extends React.HTMLAttributes<HTMLDivElement> {
  columns: ColumnDef<T>[]
  data: T[]
  keyField?: keyof T
  page?: number
  totalPages?: number
  onPageChange?: (page: number) => void
  pageSize?: number
  selectable?: boolean
  selectedKeys?: (string | number)[]
  onSelectionChange?: (keys: (string | number)[]) => void
  onSortChange?: (key: string, direction: SortDirection) => void
  sortKey?: string
  sortDirection?: SortDirection
  loading?: boolean
  emptyMessage?: string
  className?: string
}
