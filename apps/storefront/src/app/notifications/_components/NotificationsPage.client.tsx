'use client'

import { Notifications } from '@ecom/ui-storefront/pages/Notifications'
import { useNotificationsAdapter } from '../../../features/notifications/hooks/use-notifications-adapter'

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
