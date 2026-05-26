'use client'

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { api } from '../lib/api'
import {
  createStorefrontRealtimeSocket,
  startHeartbeat,
  type RealtimeNotificationPayload,
  type StorefrontRealtimeSocket,
} from '../lib/realtime'
import { useAuth } from './auth-provider'

interface UnreadCountResponse {
  count?: number
  unreadCount?: number
}

interface StorefrontRealtimeContextValue {
  socket: StorefrontRealtimeSocket | null
  notificationCount: number
  chatUnreadCount: number
  lastNotification: RealtimeNotificationPayload | null
  markNotificationRead: () => void
  markAllNotificationsRead: () => void
  setChatUnreadCount: (value: number) => void
}

const StorefrontRealtimeContext = createContext<StorefrontRealtimeContextValue | null>(null)

async function fetchUnreadCounts(): Promise<{
  notificationCount: number
  chatUnreadCount: number
}> {
  const [notification, chat] = await Promise.all([
    api<UnreadCountResponse>('/notifications/unread-count'),
    api<UnreadCountResponse>('/chat/unread'),
  ])

  return {
    notificationCount: notification.count ?? 0,
    chatUnreadCount: chat.unreadCount ?? 0,
  }
}

export function StorefrontRealtimeProvider({ children }: Readonly<{ children: ReactNode }>) {
  const { user, loading } = useAuth()
  const [socket, setSocket] = useState<StorefrontRealtimeSocket | null>(null)
  const [notificationCount, setNotificationCount] = useState(0)
  const [chatUnreadCount, setChatUnreadCount] = useState(0)
  const [lastNotification, setLastNotification] = useState<RealtimeNotificationPayload | null>(null)

  useEffect(() => {
    if (loading || !user) {
      setSocket((current) => {
        current?.disconnect()
        return null
      })
      setNotificationCount(0)
      setChatUnreadCount(0)
      setLastNotification(null)
      return
    }

    let cancelled = false
    const refresh = async () => {
      try {
        const counts = await fetchUnreadCounts()
        if (!cancelled) {
          setNotificationCount(counts.notificationCount)
          setChatUnreadCount(counts.chatUnreadCount)
        }
      } catch {
        if (!cancelled) {
          setNotificationCount(0)
          setChatUnreadCount(0)
        }
      }
    }

    void refresh()

    const nextSocket = createStorefrontRealtimeSocket(
      process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000',
    )
    const stopHeartbeat = startHeartbeat(nextSocket)

    nextSocket.on('notification', (payload: RealtimeNotificationPayload) => {
      setLastNotification(payload)
      setNotificationCount((current) => current + 1)
    })

    setSocket(nextSocket)

    return () => {
      cancelled = true
      stopHeartbeat()
      nextSocket.disconnect()
      setSocket(null)
    }
  }, [loading, user])

  const value = useMemo<StorefrontRealtimeContextValue>(
    () => ({
      socket,
      notificationCount,
      chatUnreadCount,
      lastNotification,
      markNotificationRead: () => {
        setNotificationCount((current) => Math.max(0, current - 1))
      },
      markAllNotificationsRead: () => {
        setNotificationCount(0)
      },
      setChatUnreadCount,
    }),
    [chatUnreadCount, lastNotification, notificationCount, socket],
  )

  return (
    <StorefrontRealtimeContext.Provider value={value}>
      {children}
    </StorefrontRealtimeContext.Provider>
  )
}

export function useStorefrontRealtime(): StorefrontRealtimeContextValue {
  const context = useContext(StorefrontRealtimeContext)
  if (!context) {
    throw new Error('useStorefrontRealtime must be used within StorefrontRealtimeProvider')
  }

  return context
}
