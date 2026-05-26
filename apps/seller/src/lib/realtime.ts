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

export interface RealtimeChatReadPayload {
  conversationId: string
}

export interface RealtimeChatErrorPayload {
  code: 'FORBIDDEN' | 'NOT_FOUND' | 'INTERNAL'
  message: string
}

export type SellerRealtimeSocket = Socket

export function createSellerRealtimeSocket(baseUrl: string): SellerRealtimeSocket {
  return io(`${baseUrl}/chat`, {
    withCredentials: true,
    transports: ['websocket'],
  })
}

export function startHeartbeat(socket: SellerRealtimeSocket): () => void {
  const handle = window.setInterval(() => {
    socket.emit('heartbeat')
  }, HEARTBEAT_INTERVAL_MS)

  socket.emit('heartbeat')

  return () => {
    window.clearInterval(handle)
  }
}
