'use client'

import Link from 'next/link'
import { useAuth } from '../../core/auth/auth-provider'
import { useStorefrontRealtime } from '../../core/providers/realtime-provider'

export function StorefrontShell({ children }: Readonly<{ children: React.ReactNode }>) {
  const { user, logout } = useAuth()
  const { chatUnreadCount, notificationCount } = useStorefrontRealtime()

  return (
    <>
      <header style={{ borderBottom: '1px solid #e5e7eb', padding: '12px 16px' }}>
        <nav style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <Link href="/">Storefront</Link>
          <Link href="/messages">Messages{chatUnreadCount > 0 ? ` (${chatUnreadCount})` : ''}</Link>
          <Link href="/notifications">
            Notifications{notificationCount > 0 ? ` (${notificationCount})` : ''}
          </Link>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 12, alignItems: 'center' }}>
            {user ? (
              <>
                <span>{String(user.userId).slice(0, 8)}</span>
                <button
                  onClick={() => {
                    void logout()
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link href="/login">Login</Link>
            )}
          </div>
        </nav>
      </header>
      <main style={{ padding: 16 }}>{children}</main>
    </>
  )
}
