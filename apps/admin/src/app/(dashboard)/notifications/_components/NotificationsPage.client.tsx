'use client'

import { Notifications } from '@ecom/ui-admin/pages/Notifications'
import { useNotificationsAdapter } from '@/features/notifications/hooks/use-notifications-adapter'
import { stripAdapterMeta } from '@ecom/shared/utils/adapter-utils'

export function NotificationsPageClient() {
  return <Notifications {...stripAdapterMeta(useNotificationsAdapter())} />
}
