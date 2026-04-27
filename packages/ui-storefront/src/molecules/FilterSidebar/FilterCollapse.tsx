'use client'

import { useId, useState } from 'react'

import { ChevronDown } from 'lucide-react'

import { cn } from '@ecom/ui/utils'

interface FilterCollapseProps {
  title: string
  defaultCollapsed?: boolean
  children: React.ReactNode
  activeCount?: number
}

/**
 * Lightweight, borderless filter section.
 * Renders as a list-style item with a separator on top so multiple groups
 * stack cleanly inside the sidebar without the "boxed form" feeling.
 */
export function FilterCollapse({
  title,
  defaultCollapsed = false,
  children,
  activeCount = 0,
}: FilterCollapseProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed)
  const id = useId()
  const contentId = `filter-collapse-${id}`

  return (
    <div className="border-t border-[var(--border-subtle)] first:border-t-0">
      <button
        type="button"
        onClick={() => setCollapsed((c) => !c)}
        aria-expanded={!collapsed}
        aria-controls={contentId}
        className={cn(
          'group flex w-full items-center justify-between gap-2',
          'py-4',
          'text-left',
          'transition-colors duration-[var(--motion-fast)]',
          'focus-visible:outline-none focus-visible:ring-[var(--focus-ring-width)] focus-visible:ring-[var(--focus-ring-color)] rounded-[var(--radius-sm)]',
        )}
      >
        <span className="flex items-center gap-2">
          <span className="text-sm font-semibold tracking-[-0.005em] text-[var(--text-primary)]">
            {title}
          </span>
          {activeCount > 0 && (
            <span
              className={cn(
                'inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full',
                'bg-[rgb(var(--brand-500-rgb)/0.12)] px-1.5 text-[length:var(--text-micro)] font-semibold text-[var(--action-primary)]',
              )}
              aria-label={`${activeCount} active`}
            >
              {activeCount}
            </span>
          )}
        </span>
        <ChevronDown
          className={cn(
            'h-4 w-4 shrink-0 text-[var(--text-tertiary)]',
            'transition-transform duration-[var(--motion-fast)]',
            'group-hover:text-[var(--text-primary)]',
            !collapsed && 'rotate-180',
          )}
          aria-hidden="true"
        />
      </button>

      {!collapsed && (
        <div id={contentId} className="pb-5 pt-1">
          {children}
        </div>
      )}
    </div>
  )
}
