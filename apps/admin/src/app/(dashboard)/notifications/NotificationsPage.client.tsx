'use client'

import { Notifications } from '@ecom/ui-admin'
import { useNotificationsAdapter } from '@/features/notifications/hooks/use-notifications-adapter'
import { stripAdapterMeta } from '@ecom/shared'

export function NotificationsPageClient() {
  return <Notifications {...stripAdapterMeta(useNotificationsAdapter())} />
}
