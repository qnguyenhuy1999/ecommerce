'use client'

import { usePathname } from 'next/navigation'
import { ConsoleLayout } from '@ecom/ui-seller'
import { useProtectedRoute } from '../../../core/auth/use-protected-route'
import { useAuth } from '../../../core/auth/auth-provider'
import { useSellerRealtime } from '../../../core/providers/realtime-provider'

export function SellerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { loading } = useProtectedRoute()
  const { logout } = useAuth()
  const { chatUnreadCount, notificationCount } = useSellerRealtime()

  return (
    <ConsoleLayout
      pathname={pathname}
      loading={loading}
      chatUnreadCount={chatUnreadCount}
      notificationCount={notificationCount}
      onLogout={() => logout()}
    >
      {children}
    </ConsoleLayout>
  )
}
