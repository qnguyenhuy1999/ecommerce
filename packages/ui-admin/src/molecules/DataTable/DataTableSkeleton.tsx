import { Skeleton } from '@ecom/ui'
import { cn } from '@ecom/ui/utils'

/**
 * Server-compatible skeleton for DataTable streaming.
 * Renders a grid of skeleton rows using @ecom/ui Skeleton atoms.
 */
export function DataTableSkeleton({
  rowCount = 6,
  columnCount = 5,
  selectable = false,
  className,
}: {
  /** Number of skeleton rows to render */
  rowCount?: number
  /** Number of columns per row */
  columnCount?: number
  /** Whether a selection column exists */
  selectable?: boolean
  className?: string
}) {
  return (
    <div className={cn('flex flex-col', className)}>
      {Array.from({ length: rowCount }).map((_, rowIdx) => (
        <div
          key={rowIdx}
          className={cn(
            'flex items-center gap-4 px-4 py-3 border-b border-border/60',
            rowIdx === rowCount - 1 && 'border-b-0',
          )}
        >
          {selectable && <Skeleton className="h-4 w-4 shrink-0" />}
          {Array.from({ length: columnCount }).map((_, colIdx) => (
            <Skeleton
              key={colIdx}
              className="h-4"
              style={{ width: `${60 + ((colIdx * 17) % 35)}%` }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
