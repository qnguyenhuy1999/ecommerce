'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

import { useQuery } from '@tanstack/react-query'

import { orderClient } from '@ecom/api-client'
import type { OrderResponse } from '@ecom/api-types'

import {
  DEFAULT_ACCOUNT_NAV_ITEMS,
  OrderHistoryPageLayout,
  StorefrontFooter,
  StorefrontHeader,
} from '@ecom/ui-storefront'
import type { OrderCardProps, UseOrderHistoryTab as OrderHistoryTab } from '@ecom/ui-storefront'

import { useStorefrontChrome } from '@/components/storefront-chrome'

const ORDER_ITEM_PLACEHOLDER =
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop'

function toOrderCard(order: OrderResponse): OrderCardProps {
  const items = order.subOrders.flatMap((sub) =>
    sub.items.map((item) => ({
      title: item.productName,
      image: ORDER_ITEM_PLACEHOLDER,
    })),
  )
  const itemCount = order.subOrders.reduce(
    (sum, sub) => sum + sub.items.reduce((q, item) => q + item.quantity, 0),
    0,
  )
  return {
    orderNumber: order.orderNumber,
    date: new Date(order.createdAt).toLocaleDateString(),
    status: order.status,
    items,
    itemCount,
    total: order.totalAmount,
  }
}

const ORDERS_SIDEBAR_PROPS = {
  user: { name: 'Welcome', email: 'guest@marketplace' },
  activeItem: 'orders',
  items: DEFAULT_ACCOUNT_NAV_ITEMS,
} as const

export interface OrderHistoryViewProps {
  initialOrders: OrderResponse[]
}

/**
 * Client island for the order history page. Receives the orders fetched on
 * the server (via cookie-forwarded SSR) as `initialData` so the first paint
 * is data-complete; client-side filtering/search runs on top of that without
 * any network round-trip.
 */
export function OrderHistoryView({ initialOrders }: OrderHistoryViewProps) {
  const router = useRouter()
  const { promoBar, headerProps, footerProps } = useStorefrontChrome()

  const [tab, setTab] = React.useState<OrderHistoryTab>('all')
  const [searchQuery, setSearchQuery] = React.useState('')

  const { data, isError } = useQuery({
    queryKey: ['orders', 'list'],
    queryFn: () => orderClient.list({ page: 1, limit: 50 }),
    initialData: { success: true, data: initialOrders, meta: undefined },
  })

  const orders = React.useMemo(
    () => (data?.data ?? []).map(toOrderCard),
    [data?.data],
  )

  return (
    <OrderHistoryPageLayout
      promoBar={promoBar}
      header={<StorefrontHeader {...headerProps} />}
      footer={<StorefrontFooter {...footerProps} />}
      sidebarProps={ORDERS_SIDEBAR_PROPS}
      orders={orders}
      activeTab={tab}
      onTabChange={setTab}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      onStartShopping={() => router.push('/products')}
      emptyState={
        isError ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <h2 className="text-xl font-semibold">Sign in to view orders</h2>
            <p className="text-[var(--text-secondary)]">
              Your order history is tied to your account.
            </p>
          </div>
        ) : undefined
      }
    />
  )
}

/** Server-render-friendly skeleton. */
export function OrderHistoryViewSkeleton() {
  return (
    <div className="mx-auto max-w-[1280px] px-4 py-8">
      <div className="mb-6 h-8 w-48 animate-pulse rounded bg-[var(--surface-muted)]" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
        <div className="hidden h-96 animate-pulse rounded-[var(--radius-lg)] bg-[var(--surface-muted)] lg:block" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded-[var(--radius-lg)] bg-[var(--surface-muted)]"
            />
          ))}
        </div>
      </div>
    </div>
  )
}
