'use client'

import { useCallback, useEffect, useState } from 'react'
import { Notifications, type NotificationRow } from '@ecom/ui-seller'
import { DashboardLayout } from '../../components/dashboard-layout'
import { api } from '../../lib/api'

interface ApiNotification {
  id: string
  type: string
  title: string
  message: string
  isRead: boolean
  createdAt: string
}

interface NotificationsResponse {
  data: ApiNotification[]
}

function toRow(n: ApiNotification): NotificationRow {
  return {
    id: n.id,
    type: n.type,
    title: n.title,
    message: n.message,
    isRead: n.isRead,
    createdAtLabel: new Date(n.createdAt).toLocaleString(),
  }
}

export default function NotificationsPage() {
  const [rows, setRows] = useState<NotificationRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      try {
        const res = await api<NotificationsResponse>('/notifications', {
          params: { page: 1, limit: 50 },
        })
        setRows(res.data.map(toRow))
      } catch {
        /* empty */
      } finally {
        setLoading(false)
      }
    }
    void fetch()
  }, [])

  const handleMarkRead = useCallback(async (id: string) => {
    await api(`/notifications/${id}/read`, { method: 'POST' })
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, isRead: true } : r)))
  }, [])

  const handleMarkAllRead = useCallback(async () => {
    await api('/notifications/read-all', { method: 'POST' })
    setRows((prev) => prev.map((r) => ({ ...r, isRead: true })))
  }, [])

  return (
    <DashboardLayout>
      <Notifications
        rows={rows}
        loading={loading}
        onMarkRead={handleMarkRead}
        onMarkAllRead={handleMarkAllRead}
      />
    </DashboardLayout>
  )
}
