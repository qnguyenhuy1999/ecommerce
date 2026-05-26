import { ConsoleLayout } from '@ecom/ui-admin'
import { sidebarGroups } from '@/components/layout/sidebar-config'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <ConsoleLayout sidebarGroups={sidebarGroups}>{children}</ConsoleLayout>
}
