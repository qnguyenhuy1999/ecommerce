import type { NotificationRecord, NotificationStatus } from '@ecom/ui-admin'
import type { NotificationListItem } from '../api/notifications.api'

function toNotificationStatus(status: string): NotificationStatus {
  const map: Record<string, NotificationStatus> = {
    DRAFT: 'DRAFT',
    QUEUED: 'QUEUED',
    SENT: 'SENT',
    FAILED: 'FAILED',
  }
  return map[status] ?? 'DRAFT'
}

function toDateLabel(value: string | null): string {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function mapNotificationToRecord(item: NotificationListItem): NotificationRecord {
  return {
    id: item.id,
    title: item.title,
    message: item.message,
    channel: item.channel,
    status: toNotificationStatus(item.status),
    targetAll: item.targetAll,
    sentAtLabel: toDateLabel(item.sentAt),
    createdAtLabel: toDateLabel(item.createdAt),
  }
}
