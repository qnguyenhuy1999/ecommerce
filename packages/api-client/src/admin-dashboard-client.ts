import { getApiClient } from './client'

export interface AdminDashboardMetric {
  label: string
  value: number
  previousValue: number
  format: 'number' | 'currency' | 'percent'
}

export interface AdminDashboardActivity {
  id: string
  user: { name: string }
  action: string
  target?: string
  timestamp: string
  isLatest?: boolean
}

export interface AdminDashboardNotification {
  id: string
  title: string
  message: string
  timestamp: string
  read: boolean
  type: 'info' | 'success' | 'warning' | 'error'
}

export interface AdminDashboardResponse {
  metrics: AdminDashboardMetric[]
  activities: AdminDashboardActivity[]
  notifications: AdminDashboardNotification[]
}

export const adminDashboardClient = {
  get: async (): Promise<AdminDashboardResponse> => {
    const { data } = await getApiClient().get<{ success: true; data: AdminDashboardResponse }>(
      '/admin/dashboard',
    )
    return data.data
  },
}
