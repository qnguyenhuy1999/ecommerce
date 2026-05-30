import {
  getNotifications as getNotificationsBase,
  markAllNotificationsRead,
  markNotificationRead,
} from '../integration/seller-page-api'

export async function getNotifications(
  params?: { page?: number; limit?: number },
  init?: RequestInit,
) {
  const notifications = await getNotificationsBase(params, init)
  return notifications.items
}

export { markAllNotificationsRead, markNotificationRead }
