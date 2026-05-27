'use client'

import { useEffect, useState } from 'react'
import { Notifications } from '@ecom/ui-storefront'
import type { NotificationRecord } from '@ecom/ui-storefront'
import { api } from '../../lib/api'
import { type NotificationsResponse } from '../../lib/storefront-contracts'
import { useProtectedRoute } from '../../hooks/use-protected-route'
import { useStorefrontRealtime } from '../../providers/realtime-provider'

type NotificationState = {
  id: string
  type: string
  title: string
  message: string
  isRead: boolean
  createdAt: string
}

function prependNotification(
  notifications: NotificationState[],
  notification: NotificationState,
): NotificationState[] {
  if (notifications.some((item) => item.id === notification.id)) {
    return notifications
  }

  return [notification, ...notifications]
}

function mapNotification(item: NotificationState): NotificationRecord {
  return {
    id: item.id,
    title: item.title,
    message: item.message,
    isRead: item.isRead,
    createdAtLabel: new Date(item.createdAt).toLocaleString(),
  }
}

function toNotificationState(
  item: NotificationsResponse['data']['items'][number],
): NotificationState {
  return {
    id: item.id ?? '',
    type: item.type ?? '',
    title: item.title ?? '',
    message: item.message ?? '',
    isRead: item.isRead ?? false,
    createdAt: item.createdAt ?? '',
  }
}

export function NotificationsPageClient() {
  const { loading: routeLoading } = useProtectedRoute()
  const { lastNotification, markAllNotificationsRead, markNotificationRead } =
    useStorefrontRealtime()
  const [notifications, setNotifications] = useState<NotificationState[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api<NotificationsResponse>('/notifications', {
          params: { page: 1, limit: 50 },
        })
        setNotifications(response.data.items.map(toNotificationState))
      } catch {
        setNotifications([])
      } finally {
        setLoading(false)
      }
    }

    void load()
  }, [])

  useEffect(() => {
    if (!lastNotification) {
      return
    }

    setNotifications((current) =>
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

  const handleMarkAllRead = async () => {
    await api('/notifications/read-all', { method: 'POST' })
    setNotifications((current) => current.map((item) => ({ ...item, isRead: true })))
    markAllNotificationsRead()
  }

  const handleMarkRead = async (notificationId: string) => {
    await api(`/notifications/${notificationId}/read`, { method: 'POST' })
    setNotifications((current) =>
      current.map((item) => (item.id === notificationId ? { ...item, isRead: true } : item)),
    )
    markNotificationRead()
  }

  return (
    <Notifications
      loading={loading || routeLoading}
      notifications={notifications.map(mapNotification)}
      onMarkAllRead={() => {
        void handleMarkAllRead()
      }}
      onMarkRead={(id: string) => {
        void handleMarkRead(id)
      }}
    />
  )
}
