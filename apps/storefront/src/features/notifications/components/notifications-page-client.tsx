'use client'

import { useEffect, useState } from 'react'
import { Notifications } from '@ecom/ui-storefront'
import { useProtectedRoute } from '../../../core/auth/use-protected-route'
import { useStorefrontRealtime } from '../../../core/providers/realtime-provider'
import { mapNotification, toNotificationState } from '../mappers'
import { markAllNotificationsRead, markNotificationRead } from '../mutations'
import { getNotifications } from '../queries'
import { prependNotification } from '../realtime'
import type { NotificationState } from '../types'

export function NotificationsPageClient() {
  const { loading: routeLoading } = useProtectedRoute()
  const {
    lastNotification,
    markAllNotificationsRead: clearAllRealtime,
    markNotificationRead: clearOneRealtime,
  } = useStorefrontRealtime()
  const [notifications, setNotifications] = useState<NotificationState[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const next = await getNotifications()
        setNotifications(next.map(toNotificationState))
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
    await markAllNotificationsRead()
    setNotifications((current) => current.map((item) => ({ ...item, isRead: true })))
    clearAllRealtime()
  }

  const handleMarkRead = async (notificationId: string) => {
    await markNotificationRead(notificationId)
    setNotifications((current) =>
      current.map((item) => (item.id === notificationId ? { ...item, isRead: true } : item)),
    )
    clearOneRealtime()
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
