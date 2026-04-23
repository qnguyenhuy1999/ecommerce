import React from 'react'

import { Package } from 'lucide-react'

import { EmptyState, Tabs, TabsContent, TabsList, TabsTrigger } from '@ecom/ui'

import { OrderCard } from '../../molecules/OrderCard/OrderCard'
import type { OrderCardProps } from '../../molecules/OrderCard/OrderCard'
import { StorefrontFooter } from '../StorefrontFooter/StorefrontFooter'
import { StorefrontHeader } from '../StorefrontHeader/StorefrontHeader'
import { StorefrontShell } from '../StorefrontShell/StorefrontShell'
import { StorefrontSection } from '../shared/StorefrontSection'

const STATUS_TABS: { value: string; label: string }[] = [
  { value: 'all', label: 'All Orders' },
  { value: 'PENDING_PAYMENT', label: 'Pending' },
  { value: 'PROCESSING', label: 'Processing' },
  { value: 'SHIPPED', label: 'Shipped' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
]

export interface OrderHistoryPageLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  promoBar?: React.ReactNode
  header?: React.ReactNode
  footer?: React.ReactNode
  headerProps?: React.ComponentProps<typeof StorefrontHeader>
  footerProps?: React.ComponentProps<typeof StorefrontFooter>
  orders: OrderCardProps[]
  statusFilter?: string
  onStatusChange?: (status: string) => void
  pagination?: React.ReactNode
  emptyState?: React.ReactNode
  newsletter?: React.ReactNode
}

function OrderHistoryPageLayout({
  promoBar,
  header,
  footer,
  headerProps,
  footerProps,
  orders,
  statusFilter = 'all',
  onStatusChange,
  pagination,
  emptyState,
  newsletter,
  className,
  ...props
}: OrderHistoryPageLayoutProps) {
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
      <StorefrontSection eyebrow="My Account" title="Order History">
        <Tabs value={statusFilter} onValueChange={onStatusChange}>
          <TabsList className="flex-wrap h-auto gap-1 mb-8">
            {STATUS_TABS.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="text-[length:var(--text-xs)] h-8"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* All tabs share the same content area */}
          {STATUS_TABS.map((tab) => (
            <TabsContent key={tab.value} value={tab.value} className="mt-0">
              {orders.length === 0 ? (
                <div className="py-16">
                  {emptyState ?? (
                    <EmptyState
                      icon={<Package className="w-10 h-10 text-[var(--text-tertiary)]" />}
                      title="No orders yet"
                      description="When you place an order, it'll appear here."
                      action={{ label: 'Start Shopping', onClick: () => {}, variant: 'default' }}
                    />
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {orders.map((order) => (
                      <OrderCard key={order.orderNumber} {...order} />
                    ))}
                  </div>
                  {pagination && <div className="pt-6 flex justify-center">{pagination}</div>}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </StorefrontSection>
    </StorefrontShell>
  )
}

export { OrderHistoryPageLayout }
