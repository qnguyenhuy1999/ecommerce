'use client'

import React from 'react'

import { ChevronRight, MoreHorizontal } from 'lucide-react'

import { cn } from '../../lib/utils'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[]
  separator?: React.ReactNode
  collapsible?: boolean
}

function Breadcrumb({
  items,
  separator = <ChevronRight className="w-4 h-4" />,
  collapsible = false,
  className,
  ...props
}: BreadcrumbProps) {
  const [expanded, setExpanded] = React.useState(false)

  const showCollapsible = collapsible && items.length > 3 && !expanded
  const visibleItems = showCollapsible
    ? [items[0], { label: '...', isEllipsis: true }, items[items.length - 1]]
    : items

  return (
    <nav
      className={cn(
        'flex items-center gap-1 text-[var(--text-sm)] text-muted-foreground',
        className,
      )}
      aria-label="breadcrumb"
      {...props}
    >
      {visibleItems.map((item: BreadcrumbItem & { isEllipsis?: boolean }, i) => {
        const isLast = i === visibleItems.length - 1
        return (
          <React.Fragment key={i}>
            {i > 0 && (
              <span className="mx-1 opacity-40 shrink-0" aria-hidden="true">
                {separator}
              </span>
            )}
            {item.isEllipsis ? (
              <button
                type="button"
                onClick={() => {
                  setExpanded(true)
                }}
                className="flex items-center justify-center w-6 h-6 rounded hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Show hidden breadcrumbs"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            ) : isLast || !item.href ? (
              <span
                className="font-medium text-foreground max-w-[200px] truncate"
                aria-current={isLast ? 'page' : undefined}
                title={item.label}
              >
                {item.label}
              </span>
            ) : (
              <a
                href={item.href}
                className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring max-w-[200px] truncate"
                title={item.label}
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
