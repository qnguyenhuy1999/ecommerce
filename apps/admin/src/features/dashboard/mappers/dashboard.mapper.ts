import type { DashboardProps } from '@ecom/ui-admin'
import type { DashboardMetrics, DashboardAnalytics } from '../api/dashboard.api'

export function mapDashboardMetricsToProps(
  metrics: DashboardMetrics,
  analytics: DashboardAnalytics | undefined,
): Pick<DashboardProps, 'metrics' | 'pendingApprovals' | 'moderationQueue' | 'revenueSeries'> {
  return {
    metrics: [
      { label: 'Total Sellers', value: String(metrics.totalSellers) },
      { label: 'Active Sellers', value: String(metrics.activeSellers) },
      { label: 'Total Users', value: String(metrics.totalUsers) },
      { label: 'Total Orders', value: String(metrics.totalOrders) },
      { label: 'Total Products', value: String(metrics.totalProducts) },
      { label: 'Pending Refunds', value: String(metrics.pendingRefunds) },
    ],
    pendingApprovals: [
      { id: 'sellers', label: 'Seller KYC', countLabel: String(metrics.pendingSellers) },
      { id: 'refunds', label: 'Refunds', countLabel: String(metrics.pendingRefunds) },
    ],
    moderationQueue: metrics.recentSellers.map((s) => ({
      id: s.id,
      sellerName: s.shopName,
      stateLabel: s.status,
      tagLabel: 'KYC',
      dateLabel: new Date(s.createdAt).toLocaleDateString(),
    })),
    revenueSeries:
      analytics?.ordersByDay.map((d) => ({
        label: d.status,
        revenue: Number(d._sum.totalAmount ?? 0),
      })) ?? [],
  }
}
