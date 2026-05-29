'use client'

import { Notifications } from '@ecom/ui-seller/pages/Notifications'
import { useNotificationsAdapter } from '@/features/notifications/hooks/use-notifications-adapter'

export default function NotificationsPage() {
  const { loading, rows, onMarkRead, onMarkAllRead } = useNotificationsAdapter()

  return (
    <Notifications
      rows={rows}
      loading={loading}
      onMarkRead={(id) => {
        void onMarkRead(id)
      }}
      onMarkAllRead={() => {
        void onMarkAllRead()
      }}
    />
  )
}
