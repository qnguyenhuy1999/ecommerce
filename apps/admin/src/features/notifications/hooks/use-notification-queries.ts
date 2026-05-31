'use client'

import { useQuery } from '@tanstack/react-query'
import { getNotifications, getTemplates } from '../api/notifications.api'
import type { NotificationListItem } from '../api/notifications.api'
import type { PaginatedResponse } from '@ecom/shared/pagination/core/types'

export function useNotifications(
  params: { page?: number; limit?: number; status?: string },
  initialData?: PaginatedResponse<NotificationListItem>,
) {
  return useQuery({
    queryKey: ['notifications', params],
    queryFn: async () => {
      const res = await getNotifications(params)
      return res.data
    },
    ...(initialData !== undefined ? { initialData } : {}),
  })
}

export function useTemplates() {
  return useQuery({
    queryKey: ['notification-templates'],
    queryFn: async () => {
      const res = await getTemplates()
      return res.data
    },
  })
}
