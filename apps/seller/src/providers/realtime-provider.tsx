'use client'

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { api } from '../lib/api'
import {
  createSellerRealtimeSocket,
  startHeartbeat,
  type RealtimeNotificationPayload,
  type SellerRealtimeSocket,
} from '../lib/realtime'
import { useAuth } from './auth-provider'

interface UnreadCountResponse {
  count?: number
  unreadCount?: number
}

interface SellerRealtimeContextValue {
  socket: SellerRealtimeSocket | null
  notificationCount: number
  chatUnreadCount: number
  lastNotification: RealtimeNotificationPayload | null
  refreshCounts: () => Promise<void>
  markNotificationRead: () => void
  markAllNotificationsRead: () => void
  setChatUnreadCount: (value: number) => void
}

const SellerRealtimeContext = createContext<SellerRealtimeContextValue | null>(null)

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

export function SellerRealtimeProvider({ children }: Readonly<{ children: ReactNode }>) {
  const { user, loading } = useAuth()
  const [socket, setSocket] = useState<SellerRealtimeSocket | null>(null)
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
    const pollHandle = window.setInterval(() => {
      void refresh()
    }, 60_000)

    const nextSocket = createSellerRealtimeSocket(
      process.env.NEXT_PUBLIC_SELLER_API_URL ?? 'http://localhost:4003',
    )

    const stopHeartbeat = startHeartbeat(nextSocket)

    nextSocket.on('notification', (payload: RealtimeNotificationPayload) => {
      setLastNotification(payload)
      setNotificationCount((current) => current + 1)
    })

    setSocket(nextSocket)

    return () => {
      cancelled = true
      window.clearInterval(pollHandle)
      stopHeartbeat()
      nextSocket.disconnect()
      setSocket(null)
    }
  }, [loading, user])

  const value = useMemo<SellerRealtimeContextValue>(
    () => ({
      socket,
      notificationCount,
      chatUnreadCount,
      lastNotification,
      refreshCounts: async () => {
        const counts = await fetchUnreadCounts()
        setNotificationCount(counts.notificationCount)
        setChatUnreadCount(counts.chatUnreadCount)
      },
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

  return <SellerRealtimeContext.Provider value={value}>{children}</SellerRealtimeContext.Provider>
}

export function useSellerRealtime(): SellerRealtimeContextValue {
  const context = useContext(SellerRealtimeContext)
  if (!context) {
    throw new Error('useSellerRealtime must be used within SellerRealtimeProvider')
  }

  return context
}
