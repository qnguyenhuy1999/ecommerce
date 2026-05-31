'use client'

import { Notifications } from '@ecom/ui-storefront/pages/Notifications'
import { useNotificationsAdapter } from '../../../features/notifications/hooks/use-notifications-adapter'

type NotificationsPageClientProps = {
  initialData?: Parameters<typeof useNotificationsAdapter>[0]
}

export function NotificationsPageClient({ initialData }: NotificationsPageClientProps) {
  const { loading, notifications, onMarkAllRead, onMarkRead } = useNotificationsAdapter(initialData)

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
