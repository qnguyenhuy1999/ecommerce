// Server: renders stock badge from props.
// All animation/threshold logic is delegated to StockBadgeClient (client leaf).
// This file stays server-only (no 'use client').

import React from 'react'

import { Badge } from '@ecom/ui'

export interface StockBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  status: 'in-stock' | 'low-stock' | 'out-of-stock'
  count?: number
}

function StockBadge({ status, count, className, ...props }: StockBadgeProps) {
  // Static rendering — animation is handled by StockBadgeClient if needed
  const label =
    status === 'low-stock' && count !== undefined
      ? `Only ${count} left`
      : status === 'in-stock'
        ? 'In Stock'
        : status === 'out-of-stock'
          ? 'Out of Stock'
          : null

  if (!label) return null

  const variantMap = {
    'in-stock': 'success',
    'low-stock': 'warning',
    'out-of-stock': 'destructive',
  } as const

  return (
    <Badge variant={variantMap[status]} className={className} {...props}>
      {label}
    </Badge>
  )
}

export { StockBadge }
