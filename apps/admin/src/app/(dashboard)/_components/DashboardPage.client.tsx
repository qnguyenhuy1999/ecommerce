'use client'

import { Dashboard } from '@ecom/ui-admin/pages/Dashboard'
import { useDashboardAdapter } from '@/features/dashboard/hooks/use-dashboard-adapter'
import { stripAdapterMeta } from '@ecom/shared/utils/adapter-utils'

export function DashboardPageClient() {
  return <Dashboard {...stripAdapterMeta(useDashboardAdapter())} />
}
