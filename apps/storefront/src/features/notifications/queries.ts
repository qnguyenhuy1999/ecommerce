import { api } from '../../lib/api'
import type { NotificationsResponse } from '../../lib/storefront-contracts'

export async function getNotifications(init?: RequestInit) {
  const response = await api<NotificationsResponse>('/notifications', {
    params: { page: 1, limit: 50 },
    ...init,
  })

  return response.data.items
}
