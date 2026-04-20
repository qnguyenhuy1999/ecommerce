'use client'

import React from 'react'

/* ─── DataTable Context ──────────────────────────────────────────────────────── */

export interface DataTableContextValue {
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

export const DataTableContext = React.createContext<DataTableContextValue | null>(null)

export function useDataTable() {
  const ctx = React.useContext(DataTableContext)
  if (!ctx) throw new Error('DataTable sub-components must be used within <DataTable>.')
  return ctx
}

/* ─── Section Context ────────────────────────────────────────────────────────── */

type DataTableSection = 'header' | 'body'

export const DataTableSectionContext = React.createContext<DataTableSection>('body')

export function useDataTableSection() {
  return React.useContext(DataTableSectionContext)
}
