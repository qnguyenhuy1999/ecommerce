import { Search } from 'lucide-react'

import { Input, cn } from '@ecom/ui'
import type { OrderHistoryTab } from '../../hooks/useOrderHistoryFilter'

export interface OrderFilterBarProps {
  query: string
  onQueryChange: (query: string) => void
  activeTab: OrderHistoryTab
  onTabChange: (tab: OrderHistoryTab) => void
  dateRange: string
  onDateRangeChange?: (value: string) => void
  dateRangeOptions?: { value: string; label: string }[]
  className?: string
}

const STATUS_TABS: { value: OrderHistoryTab; label: string }[] = [
  { value: 'all', label: 'All Orders' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

function OrderFilterBar({
  query,
  onQueryChange,
  activeTab,
  onTabChange,
  dateRange,
  onDateRangeChange,
  dateRangeOptions = [],
  className,
}: OrderFilterBarProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
    >
      {/* Search Input */}
      <div className="relative w-full max-w-md">
        <Input
          prefixIcon={<Search className="h-4 w-4 text-[var(--text-tertiary)]" />}
          type="text"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search by order ID or product name..."
          className="h-10 w-full pl-9 pr-9 rounded-full border-[var(--border-subtle)] bg-[var(--surface-base)] text-sm focus-visible:ring-1 focus-visible:ring-offset-0"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Pill Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {STATUS_TABS.map((tab) => {
            const isActive = activeTab === tab.value
            return (
              <button
                key={tab.value}
                onClick={() => onTabChange(tab.value)}
                className={cn(
                  'rounded-full px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap shrink-0',
                  isActive
                    ? 'bg-[var(--text-primary)] text-[var(--surface-base)] shadow-sm'
                    : 'bg-[var(--surface-subtle)] text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]',
                )}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Date Range Select */}
        {dateRangeOptions.length > 0 && onDateRangeChange && (
          <label className="relative flex items-center">
            <span className="sr-only">Date range</span>
            <select
              value={dateRange}
              onChange={(event) => onDateRangeChange(event.target.value)}
              className={cn(
                'h-9 cursor-pointer appearance-none rounded-full border border-[var(--border-subtle)] bg-[var(--surface-base)]',
                'px-4 pr-8',
                'text-sm font-medium text-[var(--text-primary)]',
                'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--focus-ring-color)]',
              )}
            >
              {dateRangeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {/* Custom down arrow for select since appearance-none removes default */}
            <svg
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-secondary)]"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </label>
        )}
      </div>
    </div>
  )
}

export { OrderFilterBar }
