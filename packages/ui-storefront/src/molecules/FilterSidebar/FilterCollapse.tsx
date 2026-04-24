'use client'

import { useId, useState } from 'react'

import { ChevronDown, ChevronUp } from 'lucide-react'

import { cn, Button, Badge } from '@ecom/ui'

interface FilterCollapseProps {
  title: string
  defaultCollapsed?: boolean
  children: React.ReactNode
  activeCount?: number
}

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
    <div className="rounded-md border border-[var(--border-subtle)] bg-[var(--surface-elevated)] shadow-[var(--elevation-filter-md)]">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => setCollapsed((c) => !c)}
        aria-expanded={!collapsed}
        aria-controls={contentId}
        className={cn(
          'filter-group__header w-full flex items-center justify-between',
          'h-auto min-h-0 py-4 px-4',
          collapsed ? 'border-b-0' : 'border-b border-[var(--border-subtle)]',
          'bg-transparent',
          'transition-colors duration-[var(--motion-fast)]',
          'hover:text-[var(--action-primary)] hover:border-[var(--border-default)]',
          'focus-visible:ring-[var(--focus-ring-color)] focus-visible:ring-offset-2 rounded-t-md rounded-b-none',
        )}
      >
        <span className="flex items-center gap-2">
          <span className="text-[var(--text-sm)] font-semibold text-[var(--text-primary)] tracking-tight">
            {title}
          </span>
          {activeCount > 0 && (
            <Badge variant="destructive" className="ml-1 font-bold border-0">
              {activeCount}
            </Badge>
          )}
        </span>
        {collapsed ? (
          <ChevronDown className="w-4 h-4 text-current transition-transform duration-[var(--motion-fast)]" />
        ) : (
          <ChevronUp className="w-4 h-4 text-current transition-transform duration-[var(--motion-fast)]" />
        )}
      </Button>

      {!collapsed && (
        <div
          id={contentId}
          className="filter-group__content pt-5 pb-6 px-4 animate-[slide-down_var(--motion-normal)_var(--motion-ease-out)]"
        >
          {children}
        </div>
      )}
    </div>
  )
}
