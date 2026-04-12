'use client'

import React from 'react'

const DataTableContext = React.createContext<{
  selectable?: boolean
  selectedKeys?: (string | number)[]
  onSelectionChange?: (keys: (string | number)[]) => void
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
}

function DataTable({
  selectable,
  selectedKeys,
  onSelectionChange,
  className,
  children,
  ...props
}: DataTableProps) {
  return (
    <DataTableContext.Provider value={{ selectable, selectedKeys, onSelectionChange }}>
      <div className={`flex flex-col space-y-4 ${className || ''}`} {...props}>
        {children}
      </div>
    </DataTableContext.Provider>
  )
}

function DataTableToolbar({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`flex items-center justify-between p-1 ${className || ''}`} {...props}>
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
    <div
      className={`flex items-center gap-2 p-2 bg-muted/50 border rounded-[var(--radius-sm)] transition-opacity duration-[var(--motion-duration-fast)] ${className || ''}`}
      {...props}
    >
      <span className="text-sm font-medium ml-2 mr-4">{selectedKeys.length} selected</span>
      {children}
    </div>
  )
}

export { DataTable, DataTableToolbar, DataTableBulkActions }
