import { formatCurrency, formatDateIntl } from '@ecom/shared'
import { dashboardDefaultProps, type DashboardProps } from '@ecom/ui-admin'
import type { DashboardAnalytics, DashboardMetrics } from '../api/dashboard.api'

export function mapDashboardMetricsToProps(
  metrics: DashboardMetrics,
  analytics: DashboardAnalytics | undefined,
): DashboardProps {
  const totalRevenue = analytics?.totalRevenue ?? 0
  const revenueTrendLabel =
    analytics?.revenueTrendPercent !== null && analytics?.revenueTrendPercent !== undefined
      ? `${analytics.revenueTrendPercent >= 0 ? '+' : ''}${analytics.revenueTrendPercent.toFixed(1)}% vs prev`
      : 'No prior period'

  const revenueValueLabel = formatCurrency(totalRevenue, {
    currency: 'USD',
    fractionDigits: 0,
  })

  return {
    ...dashboardDefaultProps,
    metrics: [
      {
        label: 'Total Sellers',
        value: String(metrics.totalSellers),
        trend: 0,
        spark: [],
        accent: 'primary',
      },
      {
        label: 'Active Sellers',
        value: String(metrics.activeSellers),
        trend: 0,
        spark: [],
        accent: 'success',
      },
      {
        label: 'Total Users',
        value: String(metrics.totalUsers),
        trend: 0,
        spark: [],
        accent: 'info',
      },
      {
        label: 'Total Orders',
        value: String(metrics.totalOrders),
        trend: 0,
        spark: [],
        accent: 'warning',
      },
      {
        label: 'Total Products',
        value: String(metrics.totalProducts),
        trend: 0,
        spark: [],
        accent: 'primary',
      },
      {
        label: 'Total Reviews',
        value: String(metrics.totalReviews),
        trend: 0,
        spark: [],
        accent: 'info',
      },
      {
        label: 'Pending Refunds',
        value: String(metrics.pendingRefunds),
        trend: 0,
        spark: [],
        accent: 'destructive',
      },
    ],
    revenueValueLabel,
    revenueTrendLabel,
    pendingApprovals: [
      { id: 'sellers', label: 'Seller KYC', countLabel: String(metrics.pendingSellers) },
      { id: 'refunds', label: 'Refunds', countLabel: String(metrics.pendingRefunds) },
    ],
    moderationQueue: metrics.recentSellers.map((s) => ({
      id: s.id,
      sellerName: s.shopName,
      stateLabel: s.status,
      tagLabel: 'KYC',
      dateLabel: formatDateIntl(s.createdAt),
    })),
    revenueSeries:
      analytics?.ordersByDay.map((d) => ({
        label: formatDateIntl(d.date, { month: 'short', day: 'numeric' }, 'en-US'),
        revenue: d.revenue,
      })) ?? [],
  }
}
