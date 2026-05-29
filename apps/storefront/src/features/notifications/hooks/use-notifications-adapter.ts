'use client'

import { useCallback, useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useProtectedRoute } from '../../../core/auth/use-protected-route'
import { useStorefrontRealtime } from '../../../core/providers/realtime-provider'
import { mapNotification, toNotificationState } from '../mappers'
import { markAllNotificationsRead, markNotificationRead } from '../mutations'
import { getNotifications } from '../queries'
import { prependNotification } from '../realtime'
import { notificationKeys } from '../query-keys'
import type { NotificationState } from '../types'

export function useNotificationsAdapter() {
  const { loading: routeLoading } = useProtectedRoute()
  const {
    lastNotification,
    markAllNotificationsRead: clearAllRealtime,
    markNotificationRead: clearOneRealtime,
  } = useStorefrontRealtime()
  const queryClient = useQueryClient()
  const [localNotifications, setLocalNotifications] = useState<NotificationState[]>([])

  const query = useQuery({
    queryKey: notificationKeys.list(),
    queryFn: async () => {
      const items = await getNotifications()
      return items.map(toNotificationState)
    },
  })

  const notifications = query.data ?? localNotifications

  useEffect(() => {
    if (query.data) {
      setLocalNotifications(query.data)
    }
  }, [query.data])

  useEffect(() => {
    if (!lastNotification) return

    setLocalNotifications((current) =>
      prependNotification(current, {
        id: lastNotification.id,
        type: lastNotification.type,
        title: lastNotification.title,
        message: lastNotification.message,
        isRead: false,
        createdAt: lastNotification.createdAt,
      }),
    )
  }, [lastNotification])

  const markAllMutation = useMutation({
    mutationFn: () => markAllNotificationsRead(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: notificationKeys.all }),
  })

  const markReadMutation = useMutation({
    mutationFn: (id: string) => markNotificationRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: notificationKeys.all }),
  })

  const handleMarkAllRead = useCallback(async () => {
    await markAllMutation.mutateAsync()
    clearAllRealtime()
  }, [markAllMutation, clearAllRealtime])

  const handleMarkRead = useCallback(
    async (notificationId: string) => {
      await markReadMutation.mutateAsync(notificationId)
      clearOneRealtime()
    },
    [markReadMutation, clearOneRealtime],
  )

  return {
    loading: routeLoading || query.isPending,
    notifications: notifications.map(mapNotification),
    onMarkAllRead: handleMarkAllRead,
    onMarkRead: handleMarkRead,
  }
}
