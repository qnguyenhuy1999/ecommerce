'use client'

import { useCallback, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getNotifications,
  markAllNotificationsRead as markAllNotificationsReadApi,
  markNotificationRead as markNotificationReadApi,
} from '../api'
import { mapNotificationsToRows } from '../mappers'
import { notificationKeys } from '../query-keys'
import { useSellerRealtime } from '../../../core/providers/realtime-provider'

export function useNotificationsAdapter(initialData?: ReturnType<typeof mapNotificationsToRows>) {
  const queryClient = useQueryClient()
  const {
    lastNotification,
    markAllNotificationsRead: markAllNotificationsReadRealtime,
    markNotificationRead: markNotificationReadRealtime,
  } = useSellerRealtime()

  const query = useQuery({
    queryKey: notificationKeys.list(),
    queryFn: async () => {
      const items = await getNotifications()
      return mapNotificationsToRows(items)
    },
    initialData,
  })

  const markReadMutation = useMutation({
    mutationFn: (id: string) => markNotificationReadApi(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: notificationKeys.all }),
  })

  const markAllReadMutation = useMutation({
    mutationFn: () => markAllNotificationsReadApi(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: notificationKeys.all }),
  })

  useEffect(() => {
    if (!lastNotification || !query.data) return

    const exists = query.data.some((row) => row.id === lastNotification.id)
    if (exists) return

    queryClient.setQueryData(
      notificationKeys.list(),
      (old: ReturnType<typeof mapNotificationsToRows>) => [
        ...mapNotificationsToRows([
          {
            id: lastNotification.id,
            type: lastNotification.type,
            title: lastNotification.title,
            message: lastNotification.message,
            isRead: false,
            createdAt: lastNotification.createdAt,
          },
        ]),
        ...(old ?? []),
      ],
    )
  }, [lastNotification, query.data, queryClient])

  const handleMarkRead = useCallback(
    async (id: string) => {
      await markReadMutation.mutateAsync(id)
      markNotificationReadRealtime()
    },
    [markReadMutation, markNotificationReadRealtime],
  )

  const handleMarkAllRead = useCallback(async () => {
    await markAllReadMutation.mutateAsync()
    markAllNotificationsReadRealtime()
  }, [markAllReadMutation, markAllNotificationsReadRealtime])

  return {
    loading: query.isPending,
    error: query.error,
    rows: query.data ?? [],
    onMarkRead: handleMarkRead,
    onMarkAllRead: handleMarkAllRead,
  }
}
