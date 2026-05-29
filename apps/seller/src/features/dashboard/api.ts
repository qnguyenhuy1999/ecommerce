import { getDashboardBundle as getDashboardBundleBase } from '../integration/seller-page-api'

export async function getDashboardBundle() {
  const bundle = await getDashboardBundleBase()

  return {
    summary: bundle.summary.items,
    revenue: bundle.revenue.items,
    orders: bundle.orders.items,
    products: bundle.products.items,
    lowStock: bundle.lowStock.items,
    unreadCount: bundle.unreadCount.items,
    notifications: bundle.notifications,
    pendingOrders: bundle.pendingOrders,
    returnStats: bundle.returnStats.items,
  }
}
