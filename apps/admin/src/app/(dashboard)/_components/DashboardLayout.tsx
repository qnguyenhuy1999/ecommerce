'use client'

import { ConsoleLayout } from '@ecom/ui-admin/layouts/ConsoleLayout'
import { sidebarGroups } from '@/components/layout/sidebar-config'

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <ConsoleLayout sidebarGroups={sidebarGroups}>{children}</ConsoleLayout>
}
