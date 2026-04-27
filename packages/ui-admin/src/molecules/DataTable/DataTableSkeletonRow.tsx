import { TableCell as BaseTableCell, TableRow as BaseTableRow } from '@ecom/ui'
import { cn } from '@ecom/ui/utils'

import { useDataTable } from './DataTableContext'

export interface DataTableSkeletonRowProps {
  columnCount?: number
  selectable?: boolean
  className?: string
}

export function DataTableSkeletonRow({
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
        <BaseTableCell className={cn('w-12', paddingX, paddingY)}>
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
