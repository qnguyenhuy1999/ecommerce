'use client'

import React from 'react'

import { Filter } from 'lucide-react'

import {
  cn,
  Slider,
  Checkbox,
  ScrollArea,
  Button,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@ecom/ui'

export interface FilterOption {
  label: string
  value: string
  count?: number
  color?: string
}

export interface FilterGroup {
  id: string
  title: string
  type: 'checkbox' | 'color' | 'size' | 'range'
  options?: FilterOption[]
  range?: { min: number; max: number; step: number; current: [number, number] }
}

export interface FilterSidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  groups: FilterGroup[]
  onFilterChange?: (groupId: string, value: unknown) => void
  onClearAll?: () => void
}

// ─── Collapsible group ──────────────────────────────────────────────────────
function CollapsibleFilterGroup({
  group,
  onFilterChange,
}: {
  group: FilterGroup
  onFilterChange?: (id: string, val: unknown) => void
}) {
  return (
    <AccordionItem value={group.id} variant="ghost" className="border-b rounded-none mb-0 pb-1">
      <AccordionTrigger className="hover:no-underline font-semibold text-[var(--text-sm)] py-5 px-0">
        {group.title}
      </AccordionTrigger>
      <AccordionContent className="px-0 pb-4">
        {group.type === 'checkbox' && (
          <div className="space-y-3">
            {group.options?.map((opt) => (
              <label key={opt.value} className="flex items-center gap-3 cursor-pointer group/label">
                <Checkbox
                  onCheckedChange={(c) =>
                    onFilterChange?.(group.id, { value: opt.value, checked: c })
                  }
                  aria-label={opt.label}
                />
                <span
                  className={cn(
                    'text-[var(--text-sm)] font-medium text-muted-foreground',
                    'group-hover/label:text-foreground transition-colors duration-[var(--motion-fast)] flex-1',
                  )}
                >
                  {opt.label}
                </span>
                {opt.count !== undefined && (
                  <span className="text-[var(--text-micro)] text-muted-foreground/70">
                    {opt.count}
                  </span>
                )}
              </label>
            ))}
          </div>
        )}

        {group.type === 'color' && (
          <div className="flex flex-wrap gap-2">
            {group.options?.map((opt) => (
              <label
                key={opt.value}
                className="relative cursor-pointer group/color"
                title={opt.label}
              >
                <input
                  type="checkbox"
                  className="peer sr-only"
                  onChange={(e) =>
                    onFilterChange?.(group.id, { value: opt.value, checked: e.target.checked })
                  }
                />
                <div
                  className={cn(
                    'w-8 h-8 rounded-full border border-border flex items-center justify-center',
                    'peer-checked:ring-2 ring-offset-2 ring-brand',
                    'group-hover/color:scale-110 shadow-sm',
                    'transition-all duration-[var(--motion-fast)] ease-[var(--motion-ease-default)]',
                  )}
                  style={{ backgroundColor: opt.color || opt.value }}
                />
              </label>
            ))}
          </div>
        )}

        {group.type === 'size' && (
          <div className="flex flex-wrap gap-2">
            {group.options?.map((opt) => (
              <label key={opt.value} className="cursor-pointer">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  onChange={(e) =>
                    onFilterChange?.(group.id, { value: opt.value, checked: e.target.checked })
                  }
                />
                <div
                  className={cn(
                    'flex items-center justify-center min-w-[40px] h-10 px-2',
                    'rounded-[var(--radius-sm)] border text-[var(--text-sm)] font-medium text-muted-foreground',
                    'peer-checked:bg-foreground peer-checked:text-background peer-checked:border-foreground',
                    'transition-all duration-[var(--motion-fast)] ease-[var(--motion-ease-default)]',
                    'hover:border-brand hover:text-foreground',
                  )}
                >
                  {opt.label}
                </div>
              </label>
            ))}
          </div>
        )}

        {group.type === 'range' && group.range && (
          <div className="px-2 pt-6 pb-2">
            <Slider
              min={group.range.min}
              max={group.range.max}
              step={group.range.step}
              defaultValue={group.range.current[1]}
              onChange={(val) => onFilterChange?.(group.id, val)}
              formatLabel={(val) => `$${val}`}
            />
            <div
              className={cn(
                'flex items-center justify-between mt-4 text-[var(--text-sm)] font-medium text-muted-foreground',
              )}
            >
              <span>${group.range.min}</span>
              <span>${group.range.max}</span>
            </div>
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  )
}

// ─── FilterSidebar ───────────────────────────────────────────────────────────
function FilterSidebar({
  groups,
  onFilterChange,
  onClearAll,
  className,
  ...props
}: FilterSidebarProps) {
  return (
    <div className={cn('w-full md:w-64 shrink-0 flex flex-col', className)} {...props}>
      <div className="flex items-center justify-between pb-4 border-b">
        <h2 className="text-[var(--text-lg)] font-semibold flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filters
        </h2>
        {onClearAll && (
          <Button
            variant="link"
            size="sm"
            onClick={onClearAll}
            className="text-[var(--text-micro)] font-semibold text-muted-foreground hover:text-foreground p-0 h-auto"
          >
            Clear all
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1 pr-4 -mr-4">
        <Accordion type="multiple" defaultValue={groups.map((g) => g.id)} className="w-full">
          {groups.map((group) => (
            <CollapsibleFilterGroup key={group.id} group={group} onFilterChange={onFilterChange} />
          ))}
        </Accordion>
        {groups.length === 0 && (
          <div className="py-8 text-center text-[var(--text-sm)] text-muted-foreground border-b">
            No filters available
          </div>
        )}
      </ScrollArea>
    </div>
  )
}

export { FilterSidebar }
