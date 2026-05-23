'use client'

import { Dashboard } from '@ecom/ui-admin'
import { useDashboardAdapter } from '@/features/dashboard/hooks/use-dashboard-adapter'
import { stripAdapterMeta } from '@/lib/adapter-utils'

export function DashboardPageClient() {
  return <Dashboard {...stripAdapterMeta(useDashboardAdapter())} />
}
