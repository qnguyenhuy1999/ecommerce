import React from 'react'

import { cn, TableBody as BaseTableBody } from '@ecom/ui'

import {
  DataTableSectionContext,
  useDataTable,
} from './DataTableContext'
import { DataTableSkeletonRow } from './DataTableSkeletonRow'

export interface DataTableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  /** Override loading for just the body. Defaults to DataTable `loading`. */
  loading?: boolean
  skeletonRowCount?: number
  skeletonColumnCount?: number
}

export function DataTableBody({
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
