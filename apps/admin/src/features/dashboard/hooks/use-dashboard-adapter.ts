'use client'

import type { DashboardProps } from '@ecom/ui-admin'
import { useDashboardMetrics, useDashboardAnalytics } from '../hooks/use-dashboard'
import { mapDashboardMetricsToProps } from '../mappers/dashboard.mapper'

export function useDashboardAdapter(): DashboardProps & { loading: boolean; error: Error | null } {
  const metricsQuery = useDashboardMetrics()
  const analyticsQuery = useDashboardAnalytics()

  const mapped = metricsQuery.data
    ? mapDashboardMetricsToProps(metricsQuery.data, analyticsQuery.data)
    : {}

  return {
    loading: metricsQuery.isPending,
    error: metricsQuery.error,
    ...mapped,
  }
}
