import React from 'react'

import { PackageX } from 'lucide-react'

import { TableCell as BaseTableCell, TableRow as BaseTableRow, cn } from '@ecom/ui'

export interface DataTableEmptyProps extends React.HTMLAttributes<HTMLTableRowElement> {
  colSpan: number
  icon?: React.ReactNode
  title?: string
  description?: string
  action?: React.ReactNode
}

export function DataTableEmpty({
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
