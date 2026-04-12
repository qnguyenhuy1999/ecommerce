'use client'

import React from 'react'

import { Filter, ChevronDown } from 'lucide-react'

import { cn, Slider, Checkbox, ScrollArea } from '@ecom/ui'

export interface FilterOption {
  label: string
  value: string
  count?: number
  color?: string // For color swatches
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
  onFilterChange?: (groupId: string, value: any) => void
  onClearAll?: () => void
}

function CollapsibleFilterGroup({
  group,
  onFilterChange,
}: {
  group: FilterGroup
  onFilterChange?: (id: string, val: any) => void
}) {
  const [isOpen, setIsOpen] = React.useState(true)

  return (
    <div className="py-5 border-b last:border-b-0 border-border">
      <button
        className="flex items-center justify-between w-full font-semibold text-sm hover:text-brand transition-colors"
        onClick={() => {
          setIsOpen(!isOpen)
        }}
        aria-expanded={isOpen}
      >
        {group.title}
        <ChevronDown
          className={cn(
            'w-4 h-4 text-muted-foreground transition-transform duration-200',
            isOpen ? 'rotate-180' : '',
          )}
        />
      </button>

      <div
        className={cn(
          'overflow-hidden transition-all duration-300 ease-in-out',
          isOpen ? 'max-h-[500px] mt-4 opacity-100' : 'max-h-0 mt-0 opacity-0',
        )}
      >
        {group.type === 'checkbox' && (
          <div className="space-y-3">
            {group.options?.map((opt) => (
              <label key={opt.value} className="flex items-center gap-3 cursor-pointer group/label">
                <Checkbox
                  onCheckedChange={(c) =>
                    onFilterChange?.(group.id, { value: opt.value, checked: c })
                  }
                />
                <span className="text-sm font-medium text-muted-foreground group-hover/label:text-foreground transition-colors flex-1">
                  {opt.label}
                </span>
                {opt.count !== undefined && (
                  <span className="text-xs text-muted-foreground/70">{opt.count}</span>
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
                    'peer-checked:ring-2 ring-offset-2 ring-brand transition-all',
                    'group-hover/color:scale-110 shadow-sm',
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
                <div className="flex items-center justify-center min-w-[40px] h-10 px-2 rounded-[8px] border text-sm font-medium text-muted-foreground transition-all hover:border-brand peer-checked:bg-foreground peer-checked:text-background peer-checked:border-foreground">
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
            <div className="flex items-center justify-between mt-4 text-sm font-medium text-muted-foreground">
              <span>${group.range.min}</span>
              <span>${group.range.max}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

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
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filters
        </h2>
        {onClearAll && (
          <button
            onClick={onClearAll}
            className="text-xs font-semibold text-muted-foreground hover:text-foreground underline underline-offset-4"
          >
            Clear all
          </button>
        )}
      </div>

      <ScrollArea className="flex-1 pr-4 -mr-4">
        {groups.map((group) => (
          <CollapsibleFilterGroup key={group.id} group={group} onFilterChange={onFilterChange} />
        ))}
        {groups.length === 0 && (
          <div className="py-8 text-center text-sm text-muted-foreground border-b">
            No filters available
          </div>
        )}
      </ScrollArea>
    </div>
  )
}

export { FilterSidebar }
