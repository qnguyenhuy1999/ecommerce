'use client'

import { useCallback, useEffect, useState } from 'react'
import { Notifications, type NotificationRow } from '@ecom/ui-seller'
import {
  getNotifications,
  markAllNotificationsRead as markAllNotificationsReadApi,
  markNotificationRead as markNotificationReadApi,
} from '@/features/notifications/api'
import { mapNotificationsToRows } from '@/features/notifications/mappers'
import { DashboardLayout } from '../../shared/components/dashboard-layout'
import { useSellerRealtime } from '../../core/providers/realtime-provider'

export default function NotificationsPage() {
  const [rows, setRows] = useState<NotificationRow[]>([])
  const [loading, setLoading] = useState(true)
  const {
    lastNotification,
    markAllNotificationsRead: markAllNotificationsReadRealtime,
    markNotificationRead: markNotificationReadRealtime,
  } = useSellerRealtime()

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      try {
        setRows(mapNotificationsToRows(await getNotifications()))
      } catch {
        setRows([])
      } finally {
        setLoading(false)
      }
    }
    void fetch()
  }, [])

  useEffect(() => {
    if (!lastNotification) {
      return
    }

    setRows((current) => {
      if (current.some((row) => row.id === lastNotification.id)) {
        return current
      }

      return [
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
        ...current,
      ]
    })
  }, [lastNotification])

  const handleMarkRead = useCallback(
    async (id: string) => {
      await markNotificationReadApi(id)
      setRows((prev) => prev.map((r) => (r.id === id ? { ...r, isRead: true } : r)))
      markNotificationReadRealtime()
    },
    [markNotificationReadRealtime],
  )

  const handleMarkAllRead = useCallback(async () => {
    await markAllNotificationsReadApi()
    setRows((prev) => prev.map((r) => ({ ...r, isRead: true })))
    markAllNotificationsReadRealtime()
  }, [markAllNotificationsReadRealtime])
  return (
    <DashboardLayout>
      <Notifications
        rows={rows}
        loading={loading}
        onMarkRead={(id) => {
          void handleMarkRead(id)
        }}
        onMarkAllRead={() => {
          void handleMarkAllRead()
        }}
      />
    </DashboardLayout>
  )
}
