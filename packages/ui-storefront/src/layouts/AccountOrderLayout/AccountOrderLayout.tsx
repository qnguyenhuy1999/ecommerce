import React from 'react'

import { Package } from 'lucide-react'

import { EmptyState } from '@ecom/ui'

import { useOrderHistoryFilter } from '../../hooks/useOrderHistoryFilter'
import type { OrderHistoryTab } from '../../hooks/useOrderHistoryFilter'
import { AccountPageLayout } from '../AccountPageLayout/AccountPageLayout'
import type { AccountPageLayoutProps } from '../AccountPageLayout/AccountPageLayout'
import { OrderCard } from '../../molecules/OrderCard/OrderCard'
import type { OrderCardProps } from '../../molecules/OrderCard/OrderCard'
import { OrderFilterBar } from '../../molecules/OrderFilterBar/OrderFilterBar'
import { EmptyStateCard } from '../shared/EmptyStateCard'

const DEFAULT_DATE_RANGE_OPTIONS = [
  { value: 'all', label: 'All time' },
  { value: '3m', label: 'Last 3 months' },
  { value: '6m', label: 'Last 6 months' },
  { value: 'ytd', label: 'This year' },
]

export interface AccountOrderLayoutProps extends Omit<AccountPageLayoutProps, 'children'> {
  orders: OrderCardProps[]
  activeTab?: OrderHistoryTab
  onTabChange?: (tab: OrderHistoryTab) => void
  searchQuery?: string
  onSearchChange?: (query: string) => void
  dateRangeOptions?: { value: string; label: string }[]
  dateRange?: string
  onDateRangeChange?: (value: string) => void
  pagination?: React.ReactNode
  emptyState?: React.ReactNode
  onStartShopping?: () => void
}

function AccountOrderLayout({
  orders,
  activeTab = 'all',
  onTabChange,
  searchQuery,
  onSearchChange,
  dateRangeOptions = DEFAULT_DATE_RANGE_OPTIONS,
  dateRange = 'all',
  onDateRangeChange,
  pagination,
  emptyState,
  onStartShopping,
  ...layoutProps
}: AccountOrderLayoutProps) {
  const { query, setQuery, visibleOrders, isFiltered } = useOrderHistoryFilter({
    orders,
    tab: activeTab,
    searchQuery,
    onSearchChange,
    dateRange,
  })

  return (
    <AccountPageLayout {...layoutProps}>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">Order history</h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Check the status of recent orders, manage returns, and discover similar products.
          </p>
        </div>

        <OrderFilterBar
          query={query}
          onQueryChange={setQuery}
          activeTab={activeTab}
          onTabChange={(tab) => onTabChange?.(tab)}
          dateRange={dateRange}
          onDateRangeChange={onDateRangeChange}
          dateRangeOptions={dateRangeOptions}
        />

        {visibleOrders.length === 0 ? (
          <div className="mt-4">
            <EmptyStateCard>
              {emptyState ?? (
                <EmptyState
                  icon={<Package className="h-12 w-12 text-[var(--text-tertiary)]" aria-hidden="true" />}
                  title={isFiltered ? 'No orders match these filters' : 'No orders yet'}
                  description={
                    isFiltered
                      ? 'Try a broader date range or clear the search to see more orders.'
                      : "Looks like you haven't placed an order yet. When you do, it will show up here."
                  }
                  action={
                    isFiltered
                      ? undefined
                      : onStartShopping
                        ? {
                            label: 'Start shopping',
                            onClick: onStartShopping,
                            variant: 'default',
                          }
                        : undefined
                  }
                />
              )}
            </EmptyStateCard>
          </div>
        ) : (
          <div className="mt-4 flex flex-col space-y-4">
            {visibleOrders.map((order) => (
              <OrderCard key={order.orderNumber} {...order} />
            ))}
          </div>
        )}

        {pagination && visibleOrders.length > 0 && (
          <div className="mt-6 flex justify-center">{pagination}</div>
        )}
      </div>
    </AccountPageLayout>
  )
}

export { AccountOrderLayout }
