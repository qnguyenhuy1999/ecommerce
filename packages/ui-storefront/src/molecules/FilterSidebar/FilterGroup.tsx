'use client'

import React from 'react'

import { cn, Button } from '@ecom/ui'

import { FilterCheckbox } from './FilterCheckbox'
import { FilterCollapse } from './FilterCollapse'
import { FilterRange } from './FilterRange'

interface FilterGroupContextValue {
  groupId: string
  selected: Set<string>
  onOptionToggle: (groupId: string, value: string, checked: boolean) => void
}

const FilterGroupContext = React.createContext<FilterGroupContextValue | null>(null)

export function useFilterGroup() {
  const context = React.useContext(FilterGroupContext)
  if (!context) {
    throw new Error('FilterGroup sub-components must be used within <FilterGroup>')
  }
  return context
}

// ─── FilterGroup root ───────────────────────────────────────────────────────
export interface FilterGroupProps {
  groupId: string
  title: string
  type: 'checkbox' | 'color' | 'size' | 'range'
  options?: { label: string; value: string; count?: number; color?: string }[]
  range?: { min: number; max: number; step: number; current: [number, number] }
  selected: Set<string>
  onOptionToggle: (groupId: string, value: string, checked: boolean) => void
  onRangeChange: (groupId: string, value: [number, number]) => void
  activeCount?: number
}

export function FilterGroup({
  groupId,
  title,
  type,
  options = [],
  range,
  selected,
  onOptionToggle,
  onRangeChange,
  activeCount = 0,
}: FilterGroupProps) {
  return (
    <FilterGroupContext.Provider value={{ groupId, selected, onOptionToggle }}>
      <FilterCollapse title={title} activeCount={activeCount}>
        <div>
          {type === 'checkbox' && (
            <div className="space-y-2">
              {options.map((opt) => (
                <FilterCheckbox
                  key={opt.value}
                  label={opt.label}
                  value={opt.value}
                  count={opt.count}
                  checked={selected.has(opt.value)}
                  onToggle={onOptionToggle}
                  groupId={groupId}
                />
              ))}
            </div>
          )}
          {type === 'size' && (
            <div className="flex flex-wrap gap-2">
              {options.map((opt) => {
                const isSelected = selected.has(opt.value)
                return (
                  <Button
                    key={opt.value}
                    type="button"
                    variant={isSelected ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onOptionToggle(groupId, opt.value, !isSelected)}
                    className={cn(
                      'min-w-10 h-10',
                      'min-h-0 px-3',
                      'text-sm font-semibold',
                      'transition-all duration-[var(--motion-fast)]',
                      'focus-visible:ring-[var(--focus-ring-color)] focus-visible:ring-offset-1',
                      isSelected
                        ? 'bg-[var(--text-primary)] text-[var(--surface-base)] border-[var(--text-primary)] shadow-sm hover:bg-[var(--text-primary)]'
                        : 'bg-[var(--surface-base)] text-[var(--text-secondary)] border-[var(--border-default)] hover:bg-[var(--surface-hover)]',
                      !isSelected &&
                        'hover:border-[var(--text-primary)] hover:text-[var(--text-primary)]',
                    )}
                  >
                    {opt.label}
                  </Button>
                )
              })}
            </div>
          )}
          {type === 'color' && (
            <div className="flex flex-wrap gap-3">
              {options.map((opt) => {
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
                      onChange={() => onOptionToggle(groupId, opt.value, !isSelected)}
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
                            isLightColor(opt.color || opt.value)
                              ? 'currentColor'
                              : 'var(--surface-base)'
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
          )}
          {type === 'range' && range && (
            <FilterRange
              min={range.min}
              max={range.max}
              step={range.step}
              current={range.current}
              onChange={(value) => onRangeChange(groupId, value)}
            />
          )}
        </div>
      </FilterCollapse>
    </FilterGroupContext.Provider>
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
