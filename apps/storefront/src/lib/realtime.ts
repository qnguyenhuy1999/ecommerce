import { io, type Socket } from 'socket.io-client'

const HEARTBEAT_INTERVAL_MS = 30_000

export interface RealtimeNotificationPayload {
  id: string
  type: string
  title: string
  message: string
  createdAt: string
  metadata?: Record<string, unknown>
}

export interface RealtimeChatMessagePayload {
  id: string
  conversationId: string
  senderId: string
  content: string
  createdAt: string
}

export type StorefrontRealtimeSocket = Socket

export function createStorefrontRealtimeSocket(baseUrl: string): StorefrontRealtimeSocket {
  return io(`${baseUrl}/chat`, {
    withCredentials: true,
    transports: ['websocket'],
  })
}

export function startHeartbeat(socket: StorefrontRealtimeSocket): () => void {
  const handle = window.setInterval(() => {
    socket.emit('heartbeat')
  }, HEARTBEAT_INTERVAL_MS)

  socket.emit('heartbeat')

  return () => {
    window.clearInterval(handle)
  }
}
