import type { NotificationState } from './types'

export function prependNotification(
  notifications: NotificationState[],
  notification: NotificationState,
): NotificationState[] {
  if (notifications.some((item) => item.id === notification.id)) {
    return notifications
  }

  return [notification, ...notifications]
}
