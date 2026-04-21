import React from 'react'

import {
  TableRow as BaseTableRow,
  TableCell as BaseTableCell,
  TableHead as BaseTableHead,
  Checkbox,
  cn,
} from '@ecom/ui'

import { useDataTable, useDataTableSection } from './DataTableContext'

export interface DataTableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  rowKey?: string | number
  isSelected?: boolean
  accent?: 'success' | 'warning' | 'danger' | 'info'
  onRowClick?: (e: React.MouseEvent<HTMLTableRowElement>) => void
}

export function DataTableRow({
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
