import React from 'react'

import {
  TableCell as BaseTableCell,
  cn,
} from '@ecom/ui'

import { useDataTable } from './DataTableContext'

export interface DataTableCellProps extends Omit<React.TdHTMLAttributes<HTMLTableCellElement>, 'align'> {
  align?: 'left' | 'center' | 'right' | 'numeric'
  truncate?: boolean
  muted?: boolean
  /** Prevent child text from wrapping (useful for SKUs, codes, badges). */
  noWrap?: boolean
}

export function DataTableCell({
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
