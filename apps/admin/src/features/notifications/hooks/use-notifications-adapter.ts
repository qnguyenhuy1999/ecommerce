'use client'

import type { NotificationsProps, NotificationRecord } from '@ecom/ui-admin/pages/Notifications'
import { PAGINATION_DEFAULTS } from '@ecom/shared/pagination/core/constants'
import { useSendNotification } from '../hooks/use-notification-mutations'
import { useNotifications } from '../hooks/use-notification-queries'
import { mapNotificationToRecord } from '../mappers/notification.mapper'
import type { NotificationListItem } from '../api/notifications.api'
import type { PaginatedResponse } from '@ecom/shared/pagination/core/types'

export function useNotificationsAdapter(
  initialData?: PaginatedResponse<NotificationListItem>,
): NotificationsProps & {
  loading: boolean
  error: Error | null
} {
  const query = useNotifications({ page: 1, limit: PAGINATION_DEFAULTS.PAGE_SIZE }, initialData)
  const send = useSendNotification()

  return {
    loading: query.isPending,
    error: query.error,
    items: (query.data?.items ?? []).map(mapNotificationToRecord),
    onSend: (item: NotificationRecord) => send.mutate(item.id),
  }
}
