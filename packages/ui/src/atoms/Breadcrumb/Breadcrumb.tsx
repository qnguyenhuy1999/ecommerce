import React from 'react'

import { ChevronRight, MoreHorizontal } from 'lucide-react'

import { cn } from '../../lib/utils'
import { IconButton } from '../IconButton/IconButton'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[]
  separator?: React.ReactNode
  /**
   * If true, the breadcrumb will render a collapsed view when not expanded.
   * This component is intentionally stateless; pass `expanded` and `onExpand`
   * from a parent (molecule) to control the collapsed state.
   */
  collapsible?: boolean
  expanded?: boolean
  onExpand?: () => void
}

function Breadcrumb({
  items,
  separator = <ChevronRight className="w-4 h-4" />,
  collapsible = false,
  expanded = false,
  onExpand,
  className,
  ...props
}: BreadcrumbProps) {
  const showCollapsible = collapsible && items.length > 3 && !expanded
  const visibleItems = showCollapsible
    ? [items[0], { label: '...' }, items[items.length - 1]]
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
      {visibleItems.map((item: BreadcrumbItem, i) => {
        const isLast = i === visibleItems.length - 1
        return (
          <React.Fragment key={i}>
            {i > 0 && (
              <span className="mx-1 opacity-40 shrink-0" aria-hidden="true">
                {separator}
              </span>
            )}
            {item.label === '...' ? (
              <IconButton
                icon={<MoreHorizontal className="w-4 h-4" />}
                label="Show hidden breadcrumbs"
                variant="ghost"
                size="sm"
                onClick={onExpand}
                className="h-6 w-6"
              />
            ) : isLast || !item.href ? (
              <span
                className="font-medium text-foreground max-w-[var(--space-16)] truncate"
                aria-current={isLast ? 'page' : undefined}
                title={item.label}
              >
                {item.label}
              </span>
            ) : (
              <a
                href={item.href}
                className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring max-w-[var(--space-16)] truncate"
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
