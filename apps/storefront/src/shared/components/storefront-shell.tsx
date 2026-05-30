'use client'

import type { AuthUser } from '@/providers/auth-provider'
import { useAuth } from '@/providers/auth-provider'
import { useStorefrontRealtime } from '@/providers/realtime-provider'
import { StorefrontLayout } from '@ecom/ui-storefront/layouts/StorefrontLayout'

function getUserString(user: AuthUser | null, keys: string[]): string | undefined {
  if (!user) {
    return undefined
  }

  for (const key of keys) {
    const value = user[key]
    if (typeof value === 'string' && value.trim().length > 0) {
      return value.trim()
    }
  }

  return undefined
}

function getUserInitials(displayName: string, fallback = 'A'): string {
  const parts = displayName
    .split(/\s+/)
    .map((part) => part.trim())
    .filter(Boolean)

  if (parts.length === 0) {
    return fallback
  }

  const initials = parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? '')
  return initials.join('').slice(0, 2) || fallback
}

export function StorefrontShell({ children }: Readonly<{ children: React.ReactNode }>) {
  const { user, logout } = useAuth()
  const { chatUnreadCount, notificationCount } = useStorefrontRealtime()
  const userDisplayName =
    getUserString(user, ['displayName', 'name', 'fullName']) ?? user?.userId ?? 'Account'
  const userEmail = getUserString(user, ['email'])
  const userAvatarUrl = getUserString(user, ['avatarUrl', 'imageUrl', 'photoUrl'])

  return (
    <StorefrontLayout
      header={{
        cartCount: 0,
        notificationCount,
        sellerLabel: 'Seller',
        chatHref: '/messages',
        chatUnreadCount,
        userDisplayName,
        userInitials: getUserInitials(userDisplayName),
        ...(userEmail ? { userEmail } : {}),
        ...(userAvatarUrl ? { userAvatarUrl } : {}),
        onLogout: logout,
      }}
    >
      <StorefrontLayout.Content>{children}</StorefrontLayout.Content>
    </StorefrontLayout>
  )
}
