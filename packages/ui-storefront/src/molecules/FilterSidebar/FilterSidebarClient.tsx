'use client'

import { useState, useCallback, useEffect, useMemo } from 'react'

import { Filter, Search } from 'lucide-react'

import { cn } from '@ecom/ui'

import { FilterGroup } from './FilterGroup'
import { FilterClear } from './FilterClear'

// ─── Public Types ─────────────────────────────────────────────────────────
export interface FilterOption {
  label: string
  value: string
  count?: number
  color?: string
}

export interface FilterGroupSpec {
  id: string
  title: string
  type: 'checkbox' | 'color' | 'size' | 'range'
  options?: FilterOption[]
  range?: { min: number; max: number; step: number; current: [number, number] }
}

export interface FilterSidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  groups: FilterGroupSpec[]
  onFilterChange?: (groupId: string, value: unknown) => void
  onClearAll?: () => void
}

// ─── Internal State Types ───────────────────────────────────────────────────
type SelectedState = Record<string, Set<string>>
type RangeState = Record<string, [number, number]>

function isRangeGroup(
  group: FilterGroupSpec,
): group is FilterGroupSpec & { range: NonNullable<FilterGroupSpec['range']> } {
  return group.type === 'range' && Boolean(group.range)
}

function buildInitialSelectedState(groups: FilterGroupSpec[]): SelectedState {
  const initial: SelectedState = {}
  for (const group of groups) {
    if (group.type !== 'range') {
      initial[group.id] = new Set()
    }
  }
  return initial
}

function buildInitialRangeState(groups: FilterGroupSpec[]): RangeState {
  const initial: RangeState = {}
  for (const group of groups) {
    if (isRangeGroup(group)) {
      initial[group.id] = [...group.range.current] as [number, number]
    }
  }
  return initial
}

function isSameRange(a?: [number, number], b?: [number, number]) {
  if (!a || !b) return false
  return a[0] === b[0] && a[1] === b[1]
}

// ─── FilterSidebarClient (client — owns all filter state) ──────────────────
export function FilterSidebarClient({
  groups = [],
  onFilterChange,
  onClearAll,
  className,
  ...props
}: FilterSidebarProps) {
  const [selectedOptions, setSelectedOptions] = useState<SelectedState>({})
  const [rangeValues, setRangeValues] = useState<RangeState>({})

  const initialRangeValues = useMemo(() => buildInitialRangeState(groups), [groups])

  useEffect(() => {
    setSelectedOptions(buildInitialSelectedState(groups))
    setRangeValues(buildInitialRangeState(groups))
  }, [groups])

  const activeCountByGroup = useMemo(() => {
    const result: Record<string, number> = {}
    for (const group of groups) {
      if (isRangeGroup(group)) {
        result[group.id] = isSameRange(rangeValues[group.id], initialRangeValues[group.id]) ? 0 : 1
      } else {
        result[group.id] = selectedOptions[group.id]?.size ?? 0
      }
    }
    return result
  }, [groups, selectedOptions, rangeValues, initialRangeValues])

  const activeCount = useMemo(
    () => Object.values(activeCountByGroup).reduce((total, count) => total + count, 0),
    [activeCountByGroup],
  )

  const handleOptionToggle = useCallback(
    (groupId: string, value: string, checked: boolean) => {
      setSelectedOptions((prev) => {
        const nextGroup = new Set(prev[groupId] ?? [])
        if (checked) nextGroup.add(value)
        else nextGroup.delete(value)
        return { ...prev, [groupId]: nextGroup }
      })
      onFilterChange?.(groupId, { value, checked })
    },
    [onFilterChange],
  )

  const handleRangeChange = useCallback(
    (groupId: string, value: [number, number]) => {
      setRangeValues((prev) => ({ ...prev, [groupId]: value }))
      onFilterChange?.(groupId, value)
    },
    [onFilterChange],
  )

  const handleClearAll = () => {
    setSelectedOptions(buildInitialSelectedState(groups))
    setRangeValues(initialRangeValues)
    onClearAll?.()
  }

  return (
    <div
      className={cn(
        'filter-sidebar w-full flex flex-col',
        className,
      )}
      {...props}
    >
      {/* Header — flush with the page, not a boxed panel */}
      <div className="flex items-center justify-between gap-[var(--space-2)] pb-[var(--space-3)]">
        <h2 className="flex items-center gap-[var(--space-2)] text-[length:var(--text-sm)] font-semibold uppercase tracking-[0.1em] text-[var(--text-tertiary)]">
          <Filter className="h-3.5 w-3.5" aria-hidden="true" />
          Filters
          {activeCount > 0 && (
            <span
              className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-[var(--action-primary)] px-[var(--space-1-5)] text-[length:var(--text-micro)] font-semibold text-[var(--action-primary-foreground)]"
              aria-label={`${activeCount} filter${activeCount === 1 ? '' : 's'} active`}
            >
              {activeCount}
            </span>
          )}
        </h2>
        {activeCount > 0 && <FilterClear onClick={handleClearAll} />}
      </div>

      {/* Filter groups — light separators, no boxing */}
      <div className="flex-1">
        {groups.map((group) => (
          <FilterGroup
            key={group.id}
            groupId={group.id}
            title={group.title}
            type={group.type}
            options={group.options}
            range={
              group.range
                ? {
                    ...group.range,
                    current: rangeValues[group.id] ?? group.range.current,
                  }
                : undefined
            }
            selected={selectedOptions[group.id] ?? new Set()}
            onOptionToggle={handleOptionToggle}
            onRangeChange={handleRangeChange}
            activeCount={activeCountByGroup[group.id] ?? 0}
          />
        ))}

        {groups.length === 0 && (
          <div className="my-[var(--space-6)] flex flex-col items-center justify-center gap-[var(--space-2)] rounded-[var(--radius-lg)] border border-dashed border-[var(--border-subtle)] bg-[var(--surface-subtle)] px-[var(--space-4)] py-[var(--space-8)] text-center">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface-base)] text-[var(--text-tertiary)]">
              <Search className="h-4 w-4" aria-hidden="true" />
            </span>
            <p className="text-[length:var(--text-sm)] font-medium text-[var(--text-secondary)]">
              No filters available
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
