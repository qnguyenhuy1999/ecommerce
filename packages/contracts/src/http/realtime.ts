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
