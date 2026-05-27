'use client'

import { useEffect, useState } from 'react'
import { Dashboard, type DashboardProps } from '@ecom/ui-seller'
import { DashboardLayout } from '../components/dashboard-layout'
import { getDashboardBundle } from '@/features/integration/seller-page-api'
import { buildDashboardProps } from '@/features/integration/seller-page-adapters'

export default function DashboardPage() {
  const [props, setProps] = useState<DashboardProps>()

  useEffect(() => {
    const fetchData = async () => {
      const bundle = await getDashboardBundle()
      setProps(
        buildDashboardProps({
          summary: bundle.summary,
          revenue: bundle.revenue,
          orders: bundle.orders,
          topProducts: bundle.products,
          lowStockItems: bundle.lowStock,
          unreadCount: bundle.unreadCount,
          notifications: bundle.notifications,
          pendingOrders: bundle.pendingOrders,
          returnStats: bundle.returnStats,
        }),
      )
    }

    void fetchData()
  }, [])

  return (
    <DashboardLayout>
      {props ? (
        <Dashboard {...props} />
      ) : (
        <p className="p-6 text-sm text-gray-500">Loading dashboard...</p>
      )}
    </DashboardLayout>
  )
}
