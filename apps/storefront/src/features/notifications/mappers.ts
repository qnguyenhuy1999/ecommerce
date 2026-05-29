import { formatDateTime } from '@ecom/shared'
import type { NotificationRecord } from '@ecom/ui-storefront'
import type { NotificationsResponse } from '../../lib/storefront-contracts'
import type { NotificationState } from './types'

export function mapNotification(item: NotificationState): NotificationRecord {
  return {
    id: item.id,
    title: item.title,
    message: item.message,
    isRead: item.isRead,
    createdAtLabel: formatDateTime(item.createdAt),
  }
}

export function toNotificationState(
  item: NotificationsResponse['data']['items'][number],
): NotificationState {
  return {
    id: item.id ?? '',
    type: item.type ?? '',
    title: item.title ?? '',
    message: item.message ?? '',
    isRead: item.isRead ?? false,
    createdAt: item.createdAt ?? '',
  }
}
