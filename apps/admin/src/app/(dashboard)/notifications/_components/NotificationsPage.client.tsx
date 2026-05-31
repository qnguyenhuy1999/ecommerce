'use client'

import { Notifications } from '@ecom/ui-admin/pages/Notifications'
import { useNotificationsAdapter } from '@/features/notifications/hooks/use-notifications-adapter'
import { stripAdapterMeta } from '@ecom/shared/utils/adapter-utils'

type NotificationsPageClientProps = {
  initialData?: Parameters<typeof useNotificationsAdapter>[0]
}

export function NotificationsPageClient({ initialData }: NotificationsPageClientProps) {
  return <Notifications {...stripAdapterMeta(useNotificationsAdapter(initialData))} />
}
