'use client'

import type { NotificationsProps, NotificationRecord } from '@ecom/ui-admin'
import { PAGINATION_DEFAULTS } from '@ecom/shared/pagination/core'
import { useNotifications, useSendNotification } from '../hooks/use-notifications'
import { mapNotificationToRecord } from '../mappers/notification.mapper'

export function useNotificationsAdapter(): NotificationsProps & {
  loading: boolean
  error: Error | null
} {
  const query = useNotifications({ page: 1, limit: PAGINATION_DEFAULTS.PAGE_SIZE })
  const send = useSendNotification()

  return {
    loading: query.isPending,
    error: query.error,
    items: (query.data?.items ?? []).map(mapNotificationToRecord),
    onSend: (item: NotificationRecord) => send.mutate(item.id),
  }
}
