'use client'

import React from 'react'

import { cn } from '@ecom/ui'

import { useDataTable } from './DataTableContext'

export interface DataTableToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  heading?: React.ReactNode
  subheading?: React.ReactNode
  left?: React.ReactNode
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
  const paddingY = density === 'compact' ? 'py-2.5' : density === 'comfortable' ? 'py-4' : 'py-3.5'

  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-subtle)] bg-[var(--surface-elevated)]/82 px-5',
        paddingY,
        className,
      )}
      {...props}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {(heading || subheading) && (
          <div className="min-w-0">
            {heading && (
              <p className="truncate text-[length:var(--text-base)] font-semibold leading-tight text-foreground">
                {heading}
              </p>
            )}
            {subheading && (
              <p className="mt-0.5 truncate text-sm text-muted-foreground">{subheading}</p>
            )}
          </div>
        )}
        {left && <div className="flex min-w-0 items-center gap-2">{left}</div>}
      </div>
      {right ? (
        <div className="flex shrink-0 items-center gap-2">{right}</div>
      ) : children ? (
        <div className="flex shrink-0 items-center gap-2">{children}</div>
      ) : null}
    </div>
  )
}
