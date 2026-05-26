import type { NotificationChannel } from '@ecom/database'

export type NotificationTarget =
  | {
      kind: 'user'
      userId: string
    }
  | {
      kind: 'shop'
      shopId: string
    }

export interface NotificationDeliveryPayload {
  notificationId: string
  notificationKind: 'seller' | 'user' | 'admin'
  type: string
  title: string
  message: string
  metadata?: Record<string, unknown>
  target: NotificationTarget
  requestedChannels?: NotificationChannel[]
}

export interface ChannelDeliveryResult {
  channel: NotificationChannel
  status: 'DELIVERED' | 'FAILED' | 'SKIPPED'
  error?: string
}
