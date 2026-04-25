import React from 'react'

import { Package, Search } from 'lucide-react'

import {
  EmptyState,
  Input,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  cn,
} from '@ecom/ui'

import { useOrderHistoryFilter } from '../../hooks/useOrderHistoryFilter'
import type { OrderHistoryTab } from '../../hooks/useOrderHistoryFilter'
import type { AccountSidebarProps } from '../../molecules/AccountSidebar/AccountSidebar'
import { OrderCard } from '../../molecules/OrderCard/OrderCard'
import type { OrderCardProps } from '../../molecules/OrderCard/OrderCard'
import { AccountDashboardShell } from '../shared/AccountDashboardShell'
import { EmptyStateCard } from '../shared/EmptyStateCard'
import { PageContainer } from '../shared/PageContainer'
import { PageHeader } from '../shared/PageHeader'
import { StorefrontPageShell } from '../shared/StorefrontPageShell'
import type { StorefrontFooter } from '../StorefrontFooter/StorefrontFooter'
import type { StorefrontHeader } from '../StorefrontHeader/StorefrontHeader'

export type { OrderHistoryTab }

const STATUS_TABS: { value: OrderHistoryTab; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

export interface OrderHistoryPageLayoutProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  promoBar?: React.ReactNode
  header?: React.ReactNode
  footer?: React.ReactNode
  headerProps?: React.ComponentProps<typeof StorefrontHeader>
  footerProps?: React.ComponentProps<typeof StorefrontFooter>
  /**
   * Optional account sidebar. When provided, the order history renders inside
   * the My Account dashboard chrome (sticky desktop rail + mobile drawer).
   * Standalone mode (no sidebarProps) is preserved for back-compat.
   */
  sidebarProps?: AccountSidebarProps
  orders: OrderCardProps[]
  /**
   * Coarse intent filter. Defaults to 'all'. The layout filters orders
   * client-side; pair with `onTabChange` to drive server-side filtering.
   */
  activeTab?: OrderHistoryTab
  onTabChange?: (tab: OrderHistoryTab) => void
  /** Optional search query (controlled). When provided, the input becomes a controlled component. */
  searchQuery?: string
  onSearchChange?: (query: string) => void
  /** Date range options shown in the dropdown. The layout never filters on this — the consumer reacts via `onDateRangeChange`. */
  dateRangeOptions?: { value: string; label: string }[]
  dateRange?: string
  onDateRangeChange?: (value: string) => void
  pagination?: React.ReactNode
  emptyState?: React.ReactNode
  onStartShopping?: () => void
  newsletter?: React.ReactNode
}

const DEFAULT_DATE_RANGE_OPTIONS = [
  { value: 'all', label: 'All time' },
  { value: '3m', label: 'Last 3 months' },
  { value: '6m', label: 'Last 6 months' },
  { value: 'ytd', label: 'This year' },
]

/**
 * Order History dashboard. Composes the storefront shell + standard page
 * container + page header from shared primitives, and delegates filter state
 * to `useOrderHistoryFilter` so the layout itself stays presentational.
 */
function OrderHistoryPageLayout({
  promoBar,
  header,
  footer,
  headerProps,
  footerProps,
  sidebarProps,
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
  newsletter,
  className,
  ...props
}: OrderHistoryPageLayoutProps) {
  const { query, setQuery, visibleOrders, isFiltered } = useOrderHistoryFilter({
    orders,
    tab: activeTab,
    searchQuery,
    onSearchChange,
    dateRange,
  })

  const totalCount = orders.length

  const body = (
    <>
      <PageHeader>
          <PageHeader.Eyebrow>My account</PageHeader.Eyebrow>
          <PageHeader.Title>Order history</PageHeader.Title>
          <PageHeader.Actions>
            <span className="text-[length:var(--text-sm)] text-[var(--text-secondary)]">
              {totalCount} order{totalCount === 1 ? '' : 's'}
            </span>
          </PageHeader.Actions>
        </PageHeader>

        {/* Single Tabs root — wraps the toolbar and content so trigger/panel
            keyboard nav and ARIA wiring stay connected. */}
        <Tabs value={activeTab} onValueChange={(v) => onTabChange?.(v as OrderHistoryTab)}>
          <div
            className={cn(
              'mb-[var(--space-6)] flex flex-col gap-[var(--space-3)]',
              'lg:flex-row lg:items-center lg:justify-between lg:gap-[var(--space-4)]',
            )}
          >
            <label className="relative block w-full lg:max-w-sm">
              <span className="sr-only">Search orders</span>
              <Search
                className="pointer-events-none absolute left-[var(--space-3)] top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-tertiary)]"
                aria-hidden="true"
              />
              <Input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by order # or product name"
                className={cn(
                  'h-10 pl-[var(--space-9)] pr-[var(--space-3)]',
                  'rounded-[var(--radius-md)] border-[var(--border-subtle)] bg-[var(--surface-base)]',
                  'text-[length:var(--text-sm)]',
                )}
              />
            </label>

            <div className="flex flex-wrap items-center gap-[var(--space-3)]">
              <TabsList className="h-9 rounded-[var(--radius-md)] bg-[var(--surface-subtle)] p-[var(--space-1)]">
                {STATUS_TABS.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className={cn(
                      'h-7 rounded-[var(--radius-sm)] px-[var(--space-3)]',
                      'text-[length:var(--text-xs)] font-medium',
                      'data-[state=active]:bg-[var(--surface-base)] data-[state=active]:text-[var(--text-primary)] data-[state=active]:shadow-[var(--elevation-xs)]',
                    )}
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              <label className="flex items-center gap-[var(--space-2)] text-[length:var(--text-xs)] text-[var(--text-secondary)]">
                <span className="sr-only">Date range</span>
                <select
                  value={dateRange}
                  onChange={(event) => onDateRangeChange?.(event.target.value)}
                  className={cn(
                    'h-9 rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--surface-base)]',
                    'px-[var(--space-3)] pr-[var(--space-7)]',
                    'text-[length:var(--text-xs)] font-medium text-[var(--text-primary)]',
                    'focus-visible:border-[var(--action-primary)] focus-visible:outline-none',
                  )}
                >
                  {dateRangeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {STATUS_TABS.map((tab) => (
            <TabsContent key={tab.value} value={tab.value} className="mt-0">
              {visibleOrders.length === 0 ? (
                <EmptyStateCard>
                  {emptyState ?? (
                    <EmptyState
                      icon={
                        <Package
                          className="h-10 w-10 text-[var(--text-tertiary)]"
                          aria-hidden="true"
                        />
                      }
                      title={
                        isFiltered
                          ? 'No orders match these filters'
                          : "You haven't placed any orders yet"
                      }
                      description={
                        isFiltered
                          ? 'Try a broader date range or clear the search to see more orders.'
                          : 'When you place an order, it will show up here so you can track it, reorder, or download an invoice.'
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
              ) : (
                <div
                  className={cn(
                    'overflow-hidden rounded-[var(--radius-md)]',
                    'border border-[var(--border-subtle)]',
                    'bg-[var(--surface-base)]',
                  )}
                >
                  <ul role="list">
                    {visibleOrders.map((order) => (
                      <li key={order.orderNumber}>
                        <OrderCard {...order} />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {pagination && visibleOrders.length > 0 && (
                <div className="mt-[var(--space-6)] flex justify-center">{pagination}</div>
              )}
            </TabsContent>
          ))}
        </Tabs>
    </>
  )

  return (
    <StorefrontPageShell
      className={className}
      promoBar={promoBar}
      header={header}
      footer={footer}
      headerProps={headerProps}
      footerProps={footerProps}
      newsletter={newsletter}
      {...props}
    >
      <PageContainer>
        {sidebarProps ? (
          <AccountDashboardShell sidebarProps={sidebarProps}>{body}</AccountDashboardShell>
        ) : (
          body
        )}
      </PageContainer>
    </StorefrontPageShell>
  )
}

export { OrderHistoryPageLayout }
