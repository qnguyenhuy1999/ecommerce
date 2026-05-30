import type { DashboardProps } from '@ecom/ui-admin/pages/Dashboard'

export type DashboardAdapterState = DashboardProps & {
  loading: boolean
  error: Error | null
}
