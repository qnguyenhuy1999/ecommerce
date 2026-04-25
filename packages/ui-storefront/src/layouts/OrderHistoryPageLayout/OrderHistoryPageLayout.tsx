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

import { OrderCard } from '../../molecules/OrderCard/OrderCard'
import type { OrderCardProps } from '../../molecules/OrderCard/OrderCard'
import type { OrderStatus } from '../../atoms/OrderStatusBadge/OrderStatusBadge'
import { StorefrontFooter } from '../StorefrontFooter/StorefrontFooter'
import { StorefrontHeader } from '../StorefrontHeader/StorefrontHeader'
import { StorefrontShell } from '../StorefrontShell/StorefrontShell'

/**
 * Consolidated tab values. The layout maps these to underlying status sets so
 * shoppers don't have to think in terms of every backend state — they pick a
 * coarse intent ("Active", "Completed", "Cancelled") and the layout filters.
 */
export type OrderHistoryTab = 'all' | 'active' | 'completed' | 'cancelled'

const STATUS_TABS: { value: OrderHistoryTab; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

const ACTIVE_STATUSES: OrderStatus[] = ['PENDING_PAYMENT', 'PAID', 'PROCESSING', 'SHIPPED']
const COMPLETED_STATUSES: OrderStatus[] = ['COMPLETED']
const CANCELLED_STATUSES: OrderStatus[] = ['CANCELLED', 'REFUNDED', 'PENDING_REFUND']

export interface OrderHistoryPageLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  promoBar?: React.ReactNode
  header?: React.ReactNode
  footer?: React.ReactNode
  headerProps?: React.ComponentProps<typeof StorefrontHeader>
  footerProps?: React.ComponentProps<typeof StorefrontFooter>
  orders: OrderCardProps[]
  /**
   * Coarse intent filter. Defaults to 'all'. The layout filters orders
   * client-side when consumers pass the full list; pair with `onTabChange`
   * to drive server-side filtering.
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

function filterOrders(orders: OrderCardProps[], tab: OrderHistoryTab, query?: string) {
  let next = orders
  if (tab !== 'all') {
    const allowed: OrderStatus[] =
      tab === 'active'
        ? ACTIVE_STATUSES
        : tab === 'completed'
          ? COMPLETED_STATUSES
          : CANCELLED_STATUSES
    next = next.filter((o) => allowed.includes(o.status))
  }
  const trimmed = query?.trim().toLowerCase()
  if (trimmed) {
    next = next.filter((o) => {
      if (o.orderNumber.toLowerCase().includes(trimmed)) return true
      return o.items.some((i) => i.title.toLowerCase().includes(trimmed))
    })
  }
  return next
}

function OrderHistoryPageLayout({
  promoBar,
  header,
  footer,
  headerProps,
  footerProps,
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
  const [internalQuery, setInternalQuery] = React.useState('')
  const query = searchQuery ?? internalQuery

  const handleSearchChange = (value: string) => {
    if (searchQuery === undefined) setInternalQuery(value)
    onSearchChange?.(value)
  }

  const visibleOrders = React.useMemo(
    () => filterOrders(orders, activeTab, query),
    [orders, activeTab, query],
  )

  const totalCount = orders.length
  const isFiltered = activeTab !== 'all' || Boolean(query.trim()) || dateRange !== 'all'

  return (
    <StorefrontShell
      className={className}
      header={
        header ?? (
          <div>
            {promoBar}
            <StorefrontHeader {...headerProps} />
          </div>
        )
      }
      footer={footer ?? <StorefrontFooter newsletter={newsletter} {...footerProps} />}
      {...props}
    >
      <div
        className={cn(
          'mx-auto w-full max-w-[var(--storefront-content-max-width)]',
          'px-[var(--space-4)] sm:px-[var(--space-6)] lg:px-[var(--space-8)]',
          'py-[var(--space-8)] lg:py-[var(--space-12)]',
        )}
      >
        {/* Page header — title + summary count */}
        <div className="mb-[var(--space-6)] flex flex-col gap-[var(--space-1)]">
          <p className="text-[length:var(--text-xs)] font-semibold uppercase tracking-[0.14em] text-[var(--text-tertiary)]">
            My account
          </p>
          <div className="flex flex-wrap items-baseline justify-between gap-[var(--space-3)]">
            <h1 className="text-[length:var(--font-size-heading-xl)] font-bold tracking-[-0.015em] leading-[var(--line-height-tight)] text-[var(--text-primary)] sm:text-[length:var(--font-size-display-sm)]">
              Order history
            </h1>
            <p className="text-[length:var(--text-sm)] text-[var(--text-secondary)]">
              {totalCount} order{totalCount === 1 ? '' : 's'}
            </p>
          </div>
        </div>

        {/* Single Tabs root — wraps the toolbar and content so trigger/panel
            keyboard nav and ARIA wiring stay connected. */}
        <Tabs
          value={activeTab}
          onValueChange={(v) => onTabChange?.(v as OrderHistoryTab)}
        >
          {/* Control bar — search + tabs + date range */}
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
                onChange={(event) => handleSearchChange(event.target.value)}
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
                <div
                  className={cn(
                    'rounded-[var(--radius-lg)] border border-dashed border-[var(--border-subtle)]',
                    'bg-[var(--surface-subtle)]',
                    'px-[var(--space-6)] py-[var(--space-12)]',
                  )}
                >
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
                </div>
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
      </div>
    </StorefrontShell>
  )
}

export { OrderHistoryPageLayout }
