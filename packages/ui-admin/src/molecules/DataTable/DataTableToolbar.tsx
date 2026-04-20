'use client'

import React from 'react'

import { cn } from '@ecom/ui'

import { useDataTable } from './DataTableContext'

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

export function DataTableToolbar({
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
