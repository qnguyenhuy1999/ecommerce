'use client'

import { useEffect, useState } from 'react'
import { api } from '../../lib/api'
import { useStorefrontRealtime } from '../../providers/realtime-provider'
import { useProtectedRoute } from '../../hooks/use-protected-route'

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
  if (notifications.some((item) => item.id === notification.id)) {
    return notifications
  }

  return [notification, ...notifications]
}

export default function StorefrontNotificationsPage() {
  const { loading } = useProtectedRoute()
  const { lastNotification, markAllNotificationsRead, markNotificationRead } =
    useStorefrontRealtime()
  const [notifications, setNotifications] = useState<NotificationItem[]>([])

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api<NotificationsResponse>('/notifications', {
          params: { page: 1, limit: 50 },
        })
        setNotifications(response.data)
      } catch {
        setNotifications([])
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

  if (loading) {
    return <div>Loading…</div>
  }

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Notifications</h1>
        <button onClick={() => void handleMarkAllRead()}>Mark all read</button>
      </div>
      {notifications.map((notification) => (
        <div key={notification.id} style={{ border: '1px solid #e5e7eb', padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
            <strong>{notification.title}</strong>
            {!notification.isRead ? (
              <button onClick={() => void handleMarkRead(notification.id)}>Mark read</button>
            ) : null}
          </div>
          <p>{notification.message}</p>
          <small>{new Date(notification.createdAt).toLocaleString()}</small>
        </div>
      ))}
    </div>
  )
}
