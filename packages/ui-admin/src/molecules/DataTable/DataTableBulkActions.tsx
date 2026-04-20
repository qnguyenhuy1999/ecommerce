'use client'

import React from 'react'

import { cn } from '@ecom/ui'

import { useDataTable } from './DataTableContext'

export function DataTableBulkActions({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { selectedKeys } = useDataTable()

  if (!selectedKeys || selectedKeys.length === 0) return null

  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-2.5',
        'bg-[var(--intent-info-muted)] border-b border-border/60',
        'animate-in slide-in-from-top-2 fade-in duration-200',
        className,
      )}
      {...props}
    >
      <span className="text-[var(--text-sm)] font-medium text-[var(--intent-info)]">
        {selectedKeys.length} selected
      </span>
      <span className="h-4 w-px bg-[var(--intent-info)]/20" />
      {children}
    </div>
  )
}
