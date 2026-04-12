'use client'

import React from 'react'
import { cn } from '@ecom/ui'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[]
  separator?: React.ReactNode
}

function Breadcrumb({
  items,
  separator = (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  ),
  className,
  ...props
}: BreadcrumbProps) {
  return (
    <nav
      className={cn('flex items-center gap-1 text-sm text-muted-foreground', className)}
      aria-label="breadcrumb"
      {...props}
    >
      {items.map((item, i) => {
        const isLast = i === items.length - 1
        return (
          <React.Fragment key={i}>
            {i > 0 && (
              <span className="mx-1 opacity-40" aria-hidden="true">
                {separator}
              </span>
            )}
            {isLast || !item.href ? (
              <span
                className="font-medium text-foreground"
                aria-current={isLast ? 'page' : undefined}
              >
                {item.label}
              </span>
            ) : (
              <a
                href={item.href}
                className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {item.label}
              </a>
            )}
          </React.Fragment>
        )
      })}
    </nav>
  )
}

export { Breadcrumb }
export type { BreadcrumbProps, BreadcrumbItem }
