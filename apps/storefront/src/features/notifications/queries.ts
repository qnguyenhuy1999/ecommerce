import { api } from '../../lib/api'
import type { NotificationsResponse } from '../../lib/storefront-contracts'

export async function getNotifications() {
  const response = await api<NotificationsResponse>('/notifications', {
    params: { page: 1, limit: 50 },
  })

  return response.data.items
}
