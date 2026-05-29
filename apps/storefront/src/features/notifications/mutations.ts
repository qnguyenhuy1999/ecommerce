import { api } from '../../lib/api'

export async function markAllNotificationsRead() {
  await api('/notifications/read-all', { method: 'POST' })
}

export async function markNotificationRead(notificationId: string) {
  await api(`/notifications/${notificationId}/read`, { method: 'POST' })
}
