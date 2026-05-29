import { Dashboard } from '@ecom/ui-seller/pages/Dashboard'
import { getDashboardBundle } from '@/features/dashboard/api'
import { buildDashboardProps } from '@/features/dashboard/mappers'

export default async function DashboardPage() {
  const bundle = await getDashboardBundle()
  const props = buildDashboardProps({
    summary: bundle.summary,
    revenue: bundle.revenue,
    orders: bundle.orders,
    topProducts: bundle.products,
    lowStockItems: bundle.lowStock,
    unreadCount: bundle.unreadCount,
    notifications: bundle.notifications,
    pendingOrders: bundle.pendingOrders,
    returnStats: bundle.returnStats,
  })

  return <Dashboard {...props} />
}
