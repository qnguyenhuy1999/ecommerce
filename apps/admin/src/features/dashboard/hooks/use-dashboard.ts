'use client'

import { useQuery } from '@tanstack/react-query'
import { getDashboardMetrics, getDashboardAnalytics } from '../api/dashboard.api'
import type { DashboardAnalytics } from '../api/dashboard.api'

function normalizeDashboardAnalytics(analytics: DashboardAnalytics): DashboardAnalytics {
  return {
    ...analytics,
    revenueTrendPercent:
      typeof analytics.revenueTrendPercent === 'number' ? analytics.revenueTrendPercent : null,
  }
}

export function useDashboardMetrics() {
  return useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: async () => {
      const res = await getDashboardMetrics()

      if (!res.data) {
        throw new Error('Dashboard metrics response is missing data')
      }

      return res.data
    },
  })
}

export function useDashboardAnalytics(period?: string) {
  return useQuery({
    queryKey: ['dashboard-analytics', period],
    queryFn: async () => {
      const res = await getDashboardAnalytics(period)

      if (!res.data) {
        throw new Error('Dashboard analytics response is missing data')
      }

      return normalizeDashboardAnalytics(res.data)
    },
  })
}
