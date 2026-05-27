import { NotificationsClient } from './Notifications.client'
import { notificationsDefaultProps } from './Notifications.fixtures'
import type { NotificationsProps } from './Notifications.types'

export function Notifications({
  title = notificationsDefaultProps.title,
  description = notificationsDefaultProps.description,
  rows = notificationsDefaultProps.rows,
  loading = notificationsDefaultProps.loading,
  unreadOnly,
  onUnreadOnlyChange,
  onMarkRead,
  onMarkAllRead,
  emptyMessage = notificationsDefaultProps.emptyMessage,
}: NotificationsProps) {
  const optionalProps = {
    ...(unreadOnly !== undefined ? { unreadOnly } : {}),
    ...(onUnreadOnlyChange ? { onUnreadOnlyChange } : {}),
    ...(onMarkRead ? { onMarkRead } : {}),
    ...(onMarkAllRead ? { onMarkAllRead } : {}),
  }

  return (
    <NotificationsClient
      title={title}
      description={description}
      rows={rows}
      loading={loading}
      {...optionalProps}
      emptyMessage={emptyMessage}
    />
  )
}
