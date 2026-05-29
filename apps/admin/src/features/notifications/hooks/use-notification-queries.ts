'use client'

import { useQuery } from '@tanstack/react-query'
import { getNotifications, getTemplates } from '../api/notifications.api'

export function useNotifications(params: { page?: number; limit?: number; status?: string }) {
  return useQuery({
    queryKey: ['notifications', params],
    queryFn: async () => {
      const res = await getNotifications(params)
      return res.data
    },
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
