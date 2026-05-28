import type { DashboardProps } from '@ecom/ui-admin'

export type DashboardAdapterState = DashboardProps & {
  loading: boolean
  error: Error | null
}
