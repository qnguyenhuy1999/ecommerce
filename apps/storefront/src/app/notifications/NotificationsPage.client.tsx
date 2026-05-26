'use client'

import { useEffect, useState } from 'react'
import { Notifications } from '@ecom/ui-storefront'
import type { NotificationRecord } from '@ecom/ui-storefront'
import { api } from '../../lib/api'
import { useStorefrontRealtime } from '../../providers/realtime-provider'

interface NotificationItem {
  id: string
  type: string
  title: string
  message: string
  isRead: boolean
  createdAt: string
}

interface NotificationsResponse {
  data: NotificationItem[]
}

function prependNotification(
  notifications: NotificationItem[],
  notification: NotificationItem,
): NotificationItem[] {
  if (notifications.some((item) => item.id === notification.id)) return notifications
  return [notification, ...notifications]
}

function mapNotification(item: NotificationItem): NotificationRecord {
  return {
    id: item.id,
    title: item.title,
    message: item.message,
    isRead: item.isRead,
    createdAtLabel: new Date(item.createdAt).toLocaleString(),
  }
}

export function NotificationsPageClient() {
  const { lastNotification, markAllNotificationsRead, markNotificationRead } =
    useStorefrontRealtime()
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api<NotificationsResponse>('/notifications', {
          params: { page: 1, limit: 50 },
        })
        setNotifications(response.data)
      } catch {
        setNotifications([])
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [])

  useEffect(() => {
    if (!lastNotification) return
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
      loading={loading}
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
