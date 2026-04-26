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

export default function OrderHistoryPage() {
  const router = useRouter()
  const { promoBar, headerProps, footerProps } = useStorefrontChrome()

  const [tab, setTab] = React.useState<OrderHistoryTab>('all')
  const [searchQuery, setSearchQuery] = React.useState('')

  const { data, isLoading, isError } = useQuery({
    queryKey: ['orders', 'list'],
    queryFn: () => orderClient.list({ page: 1, limit: 50 }),
  })

  const orders = (data?.data ?? []).map(toOrderCard)

  return (
    <OrderHistoryPageLayout
      promoBar={promoBar}
      header={<StorefrontHeader {...headerProps} />}
      footer={<StorefrontFooter {...footerProps} />}
      sidebarProps={{
        user: { name: 'Welcome', email: 'guest@marketplace' },
        activeItem: 'orders',
        items: DEFAULT_ACCOUNT_NAV_ITEMS,
      }}
      orders={orders}
      activeTab={tab}
      onTabChange={setTab}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      onStartShopping={() => router.push('/products')}
      emptyState={
        isLoading ? (
          <div className="flex flex-col items-center gap-3 py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-[var(--border-default)] border-t-[var(--action-primary)]" />
            <p className="text-[var(--text-secondary)]">Loading your orders...</p>
          </div>
        ) : isError ? (
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
