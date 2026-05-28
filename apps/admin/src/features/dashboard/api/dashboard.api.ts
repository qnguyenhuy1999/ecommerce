import { apiFetch } from '@/lib/api'
import type { AdminOperations, AdminComponents } from '@ecom/contracts/generated'

type DashboardMetricsResponse =
  AdminOperations['DashboardController_getMetrics']['responses']['200']['content']['application/json']

type DashboardAnalyticsResponse =
  AdminOperations['DashboardController_getAnalytics']['responses']['200']['content']['application/json']

export type DashboardMetrics = AdminComponents['schemas']['DashboardMetricsDto']

export type DashboardAnalytics = AdminComponents['schemas']['DashboardAnalyticsDto']

export async function getDashboardMetrics() {
  return apiFetch<DashboardMetricsResponse>('/admin/dashboard/metrics')
}

export async function getDashboardAnalytics(period?: string) {
  const query = period ? `?period=${period}` : ''
  return apiFetch<DashboardAnalyticsResponse>(`/admin/dashboard/analytics${query}`)
}
