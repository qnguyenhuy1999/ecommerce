'use client'

import { Notifications } from '@ecom/ui-storefront'
import { useNotificationsAdapter } from '../hooks/use-notifications-adapter'

export function NotificationsPageClient() {
  const { loading, notifications, onMarkAllRead, onMarkRead } = useNotificationsAdapter()

  return (
    <Notifications
      loading={loading}
      notifications={notifications}
      onMarkAllRead={() => {
        void onMarkAllRead()
      }}
      onMarkRead={(id: string) => {
        void onMarkRead(id)
      }}
    />
  )
}
