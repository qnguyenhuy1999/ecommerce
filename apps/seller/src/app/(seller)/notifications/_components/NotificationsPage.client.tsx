'use client'

import { Notifications } from '@ecom/ui-seller/pages/Notifications'
import { useNotificationsAdapter } from '@/features/notifications/hooks/use-notifications-adapter'

type NotificationsPageClientProps = { initialData?: Parameters<typeof useNotificationsAdapter>[0] }

export function NotificationsPageClient({ initialData }: NotificationsPageClientProps) {
  const { loading, rows, onMarkRead, onMarkAllRead } = useNotificationsAdapter(initialData)

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
