'use client'

import { useState, useCallback, useEffect, useMemo } from 'react'

import { Filter, Search } from 'lucide-react'

import { Badge, Button, cn } from '@ecom/ui'

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

  const activeGroups = useMemo(
    () => groups.filter((group) => (activeCountByGroup[group.id] ?? 0) > 0),
    [groups, activeCountByGroup],
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
        'filter-sidebar w-full md:w-80 shrink-0 flex flex-col gap-5 p-5',
        'rounded-[28px] border border-[var(--border-default)]',
        'bg-[linear-gradient(180deg,var(--surface-base)_0%,var(--surface-subtle)_100%)]',
        'shadow-[0_22px_48px_-30px_rgba(15,23,42,0.55)]',
        className,
      )}
      {...props}
    >
      {/* Header panel */}
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-4 shadow-[0_14px_24px_-22px_rgba(15,23,42,0.9)]">
        <div className="flex items-center justify-between">
          <h2 className="text-[var(--text-lg)] font-bold text-[var(--text-primary)] flex items-center gap-2.5 tracking-tight">
            <Filter className="w-5 h-5 text-[var(--action-primary)]" />
            Refine Results
            {activeCount > 0 && (
              <Badge
                variant="secondary"
                className="ml-1 font-bold text-[var(--surface-base)] bg-[var(--text-primary)] border-0"
              >
                {activeCount}
              </Badge>
            )}
          </h2>

          {activeCount > 0 && <FilterClear onClick={handleClearAll} />}
        </div>

        {activeGroups.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {activeGroups.map((group) => (
              <span
                key={group.id}
                className="inline-flex items-center gap-1 rounded-full border border-[var(--border-default)] bg-[var(--surface-base)] px-2.5 py-1 text-[length:var(--text-micro)] font-semibold text-[var(--text-secondary)]"
              >
                {group.title}
                <span className="text-[var(--text-primary)]">{activeCountByGroup[group.id]}</span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Filter groups */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-3">
        {groups.map((group) => (
          <FilterGroup
            key={group.id}
            groupId={group.id}
            title={group.title}
            type={group.type}
            options={group.options}
            range={group.range}
            selected={selectedOptions[group.id] ?? new Set()}
            onOptionToggle={handleOptionToggle}
            onRangeChange={handleRangeChange}
            activeCount={activeCountByGroup[group.id] ?? 0}
          />
        ))}

        {groups.length === 0 && (
          <div className="py-12 text-center rounded-2xl border border-dashed border-[var(--border-default)] bg-[var(--surface-elevated)]">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--surface-muted)] mb-3">
              <Search className="w-5 h-5 text-[var(--text-tertiary)]" />
            </div>
            <p className="text-[var(--text-sm)] text-[var(--text-secondary)] font-medium">
              No filters available
            </p>
          </div>
        )}
      </div>

      {/* Sticky apply button */}
      <div className="sticky bottom-0 pt-2 pb-1 bg-[linear-gradient(180deg,transparent_0%,var(--surface-subtle)_28%)]">
        <Button
          className="w-full rounded-xl h-11 text-[var(--text-sm)] font-semibold text-[var(--action-primary-foreground)]"
          size="lg"
        >
          Apply Filters
        </Button>
      </div>
    </div>
  )
}
