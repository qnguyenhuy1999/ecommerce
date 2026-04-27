'use client'

import React from 'react'

import { useOrderHistoryFilter } from '../../hooks/useOrderHistoryFilter'
import type { OrderHistoryTab } from '../../hooks/useOrderHistoryFilter'
import { AccountPageLayout } from '../AccountPageLayout/AccountPageLayout'
import type { AccountPageLayoutProps } from '../AccountPageLayout/AccountPageLayout'
import { OrderCard } from '../../molecules/OrderCard/OrderCard'
import type { OrderCardProps } from '../../molecules/OrderCard/OrderCard'
import { OrderFilterBar } from '../../molecules/OrderFilterBar/OrderFilterBar'
import { DEFAULT_DATE_RANGE_OPTIONS } from './AccountOrderLayout.fixtures'
import { AccountOrderLayoutEmptyState, AccountOrderLayoutHeader } from './AccountOrderLayout.server'

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
        <AccountOrderLayoutHeader />

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
          <AccountOrderLayoutEmptyState
            emptyState={emptyState}
            isFiltered={isFiltered}
            onStartShopping={onStartShopping}
          />
        ) : (
          <div className="flex flex-col mt-4 space-y-4">
            {visibleOrders.map((order) => (
              <OrderCard key={order.orderNumber} {...order} />
            ))}
          </div>
        )}

        {pagination && visibleOrders.length > 0 && (
          <div className="flex justify-center mt-6">{pagination}</div>
        )}
      </div>
    </AccountPageLayout>
  )
}

export { AccountOrderLayout }
