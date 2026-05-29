import {
  getNotifications as getNotificationsBase,
  markAllNotificationsRead,
  markNotificationRead,
} from '../integration/seller-page-api'

export async function getNotifications(params?: { page?: number; limit?: number }) {
  const notifications = await getNotificationsBase(params)
  return notifications.items
}

export { markAllNotificationsRead, markNotificationRead }
