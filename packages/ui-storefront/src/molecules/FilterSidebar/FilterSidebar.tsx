'use client'

import React, { useState, useCallback, useEffect, useMemo } from 'react'

import { Filter, ChevronDown, ChevronUp, X, Search } from 'lucide-react'

import { cn, Slider, Checkbox, Button, Badge } from '@ecom/ui'

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

type SelectedState = Record<string, Set<string>>
type RangeState = Record<string, [number, number]>

function isRangeGroup(
  group: FilterGroup,
): group is FilterGroup & { range: NonNullable<FilterGroup['range']> } {
  return group.type === 'range' && Boolean(group.range)
}

function buildInitialSelectedState(groups: FilterGroup[]): SelectedState {
  const initial: SelectedState = {}
  for (const group of groups) {
    if (group.type !== 'range') {
      initial[group.id] = new Set()
    }
  }
  return initial
}

function buildInitialRangeState(groups: FilterGroup[]): RangeState {
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

// ─── Collapsible filter group ─────────────────────────────────────────────────
function FilterGroupSection({
  group,
  collapsed,
  activeCount,
  onToggle,
  selected,
  currentRange,
  onOptionToggle,
  onRangeChange,
}: {
  group: FilterGroup
  collapsed: boolean
  activeCount: number
  onToggle: () => void
  selected: Set<string>
  currentRange?: [number, number]
  onOptionToggle: (groupId: string, value: string, checked: boolean) => void
  onRangeChange: (groupId: string, value: [number, number]) => void
}) {
  return (
    <div className="filter-group rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-4 shadow-[0_10px_30px_-24px_rgba(15,23,42,0.65)]">
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          'filter-group__header w-full flex items-center justify-between',
          'py-4 px-0',
          collapsed ? 'border-b-0' : 'border-b border-[var(--border-subtle)]',
          'bg-transparent cursor-pointer',
          'transition-colors duration-[var(--motion-fast)]',
          'hover:text-[var(--action-primary)] hover:border-[var(--border-default)]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring-color)] focus-visible:ring-offset-2 rounded-[var(--radius-xs)]',
        )}
      >
        <span className="flex items-center gap-2">
          <span className="text-[var(--text-sm)] font-semibold text-[var(--text-primary)] tracking-tight">
            {group.title}
          </span>
          {activeCount > 0 && (
            <span className="filter-group__badge inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded-full bg-[var(--text-primary)] text-[var(--surface-base)] text-[var(--text-micro)] font-bold leading-none">
              {activeCount}
            </span>
          )}
        </span>
        {collapsed ? (
          <ChevronDown className="w-4 h-4 text-[var(--text-secondary)] transition-transform duration-[var(--motion-fast)]" />
        ) : (
          <ChevronUp className="w-4 h-4 text-[var(--text-secondary)] transition-transform duration-[var(--motion-fast)]" />
        )}
      </button>

      {!collapsed && (
        <div className="filter-group__content pt-5 pb-6 animate-[slide-down_var(--motion-normal)_var(--motion-ease-out)]">
          {group.type === 'checkbox' && (
            <FilterCheckboxList
              group={group}
              selected={selected}
              onToggle={(value, checked) => onOptionToggle(group.id, value, checked)}
            />
          )}
          {group.type === 'size' && (
            <FilterSizeList
              group={group}
              selected={selected}
              onToggle={(value, checked) => onOptionToggle(group.id, value, checked)}
            />
          )}
          {group.type === 'color' && (
            <FilterColorList
              group={group}
              selected={selected}
              onToggle={(value, checked) => onOptionToggle(group.id, value, checked)}
            />
          )}
          {isRangeGroup(group) && currentRange && (
            <FilterRange
              group={group}
              current={currentRange}
              onChange={(value) => onRangeChange(group.id, value)}
            />
          )}
        </div>
      )}
    </div>
  )
}

// ─── Checkbox list ────────────────────────────────────────────────────────────
function FilterCheckboxList({
  group,
  selected,
  onToggle,
}: {
  group: FilterGroup
  selected: Set<string>
  onToggle: (value: string, checked: boolean) => void
}) {
  return (
    <div className="space-y-2">
      {group.options?.map((opt) => (
        <label
          key={opt.value}
          className={cn(
            'filter-option flex items-center gap-3 py-1 cursor-pointer group',
            'rounded-[var(--radius-xs)] px-2 -mx-2',
            'transition-colors duration-[var(--motion-fast)]',
            'hover:bg-[var(--surface-hover)]',
          )}
        >
          <span className="shrink-0">
            <Checkbox
              checked={selected.has(opt.value)}
              onCheckedChange={(c) => onToggle(opt.value, Boolean(c))}
              aria-label={opt.label}
              className="filter-option__checkbox"
            />
          </span>
          <span
            className={cn(
              'flex-1 text-[var(--text-sm)] font-medium text-[var(--text-secondary)]',
              'group-hover:text-[var(--text-primary)] transition-colors duration-[var(--motion-fast)]',
              selected.has(opt.value) && 'text-[var(--text-primary)] font-semibold',
            )}
          >
            {opt.label}
          </span>
          {opt.count !== undefined && (
            <span
              className={cn(
                'text-[var(--text-micro)] font-medium tabular-nums',
                'text-[var(--text-tertiary)]',
                'group-hover:text-[var(--text-secondary)] transition-colors duration-[var(--motion-fast)]',
                selected.has(opt.value) && 'text-[var(--action-primary)] font-semibold',
              )}
            >
              {opt.count.toLocaleString()}
            </span>
          )}
        </label>
      ))}
    </div>
  )
}

// ─── Size toggle pills ────────────────────────────────────────────────────────
function FilterSizeList({
  group,
  selected,
  onToggle,
}: {
  group: FilterGroup
  selected: Set<string>
  onToggle: (value: string, checked: boolean) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {group.options?.map((opt) => {
        const isSelected = selected.has(opt.value)
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onToggle(opt.value, !isSelected)}
            className={cn(
              'filter-size-btn inline-flex items-center justify-center',
              'min-w-[var(--space-10)] h-10 px-3',
              'text-[var(--text-sm)] font-semibold',
              'rounded-[var(--radius-sm)]',
              'border transition-all duration-[var(--motion-fast)]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring-color)] focus-visible:ring-offset-1',
              isSelected
                ? 'bg-[var(--text-primary)] text-[var(--surface-base)] border-[var(--text-primary)] shadow-sm'
                : 'bg-[var(--surface-base)] text-[var(--text-secondary)] border-[var(--border-default)] hover:bg-[var(--surface-hover)]',
              !isSelected && 'hover:border-[var(--text-primary)] hover:text-[var(--text-primary)]',
            )}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

// ─── Color swatches ───────────────────────────────────────────────────────────
function FilterColorList({
  group,
  selected,
  onToggle,
}: {
  group: FilterGroup
  selected: Set<string>
  onToggle: (value: string, checked: boolean) => void
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {group.options?.map((opt) => {
        const isSelected = selected.has(opt.value)
        return (
          <label
            key={opt.value}
            title={opt.label}
            className="filter-color-swatch cursor-pointer group"
          >
            <input
              type="checkbox"
              className="peer sr-only"
              checked={isSelected}
              onChange={() => onToggle(opt.value, !isSelected)}
            />
            <div
              className={cn(
                'relative w-9 h-9 rounded-full border-2',
                'flex items-center justify-center',
                'transition-all duration-[var(--motion-fast)] ease-[var(--motion-ease-bounce)]',
                'group-hover:scale-110',
                isSelected
                  ? 'border-[var(--action-primary)] ring-2 ring-[var(--action-primary)] ring-offset-2'
                  : 'border-[var(--border-default)]',
              )}
              style={{ backgroundColor: opt.color || opt.value }}
            >
              {isSelected && (
                <svg
                  viewBox="0 0 12 12"
                  className="w-4 h-4"
                  fill="none"
                  stroke={
                    isLightColor(opt.color || opt.value) ? 'currentColor' : 'var(--surface-base)'
                  }
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="2,6 5,9 10,3" />
                </svg>
              )}
            </div>
          </label>
        )
      })}
    </div>
  )
}

// ─── Price range slider ───────────────────────────────────────────────────────
function FilterRange({
  group,
  current,
  onChange,
}: {
  group: FilterGroup & { range: NonNullable<FilterGroup['range']> }
  current: [number, number]
  onChange: (value: [number, number]) => void
}) {
  const range = group.range

  return (
    <div className="px-1 space-y-4">
      <Slider
        min={range.min}
        max={range.max}
        step={range.step}
        value={current}
        onChange={(val) => {
          onChange(val as [number, number])
        }}
        formatLabel={(val) => `$${val}`}
      />
      <div className="flex items-center justify-between mt-5">
        <div className="flex flex-col gap-1">
          <span className="text-[var(--text-micro)] text-[var(--text-tertiary)] font-medium uppercase tracking-wider">
            Min
          </span>
          <span className="text-[var(--text-sm)] font-semibold text-[var(--text-primary)]">
            ${current[0]}
          </span>
        </div>
        <div className="h-px w-8 bg-[var(--border-default)]" />
        <div className="flex flex-col gap-1 text-right">
          <span className="text-[var(--text-micro)] text-[var(--text-tertiary)] font-medium uppercase tracking-wider">
            Max
          </span>
          <span className="text-[var(--text-sm)] font-semibold text-[var(--text-primary)]">
            ${current[1]}
          </span>
        </div>
      </div>
    </div>
  )
}

// ─── Helper: detect light background color ────────────────────────────────────
function isLightColor(color: string): boolean {
  if (color.startsWith('#')) {
    const hex = color.replace('#', '')
    if (hex.length === 3) {
      const r = parseInt(hex[0] + hex[0], 16)
      const g = parseInt(hex[1] + hex[1], 16)
      const b = parseInt(hex[2] + hex[2], 16)
      return r * 0.299 + g * 0.587 + b * 0.114 > 186
    }
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)
    return r * 0.299 + g * 0.587 + b * 0.114 > 186
  }
  return false
}

// ─── FilterSidebar ────────────────────────────────────────────────────────────
function FilterSidebar({
  groups = [],
  onFilterChange,
  onClearAll,
  className,
  ...props
}: FilterSidebarProps) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})
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

  const toggleGroup = (id: string) => {
    setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }))
  }

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

          {activeCount > 0 && onClearAll && (
            <button
              type="button"
              onClick={handleClearAll}
              className={cn(
                'flex items-center gap-1.5 text-[var(--text-sm)] font-semibold',
                'text-[var(--text-secondary)] hover:text-[var(--intent-danger)]',
                'transition-colors duration-[var(--motion-fast)]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring-color)] rounded-[var(--radius-xs)]',
              )}
            >
              <X className="w-3.5 h-3.5" />
              Reset
            </button>
          )}
        </div>

        {activeGroups.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {activeGroups.map((group) => (
              <span
                key={group.id}
                className="inline-flex items-center gap-1 rounded-full border border-[var(--border-default)] bg-[var(--surface-base)] px-2.5 py-1 text-[var(--text-micro)] font-semibold text-[var(--text-secondary)]"
              >
                {group.title}
                <span className="text-[var(--text-primary)]">{activeCountByGroup[group.id]}</span>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto pr-1 space-y-3">
        {groups.map((group) => (
          <FilterGroupSection
            key={group.id}
            group={group}
            collapsed={collapsed[group.id] ?? false}
            activeCount={activeCountByGroup[group.id] ?? 0}
            selected={selectedOptions[group.id] ?? new Set()}
            currentRange={rangeValues[group.id]}
            onToggle={() => toggleGroup(group.id)}
            onOptionToggle={handleOptionToggle}
            onRangeChange={handleRangeChange}
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

export { FilterSidebar }
