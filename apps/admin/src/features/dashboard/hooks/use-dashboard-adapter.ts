'use client'

import { useDashboardMetrics, useDashboardAnalytics } from '../hooks/use-dashboard'
import { mapDashboardMetricsToProps } from '../mappers/dashboard.mapper'
import type { DashboardAdapterState } from '../types/dashboard.types'

export function useDashboardAdapter(): DashboardAdapterState {
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
