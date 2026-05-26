/**
 * Job names and payload types for the notification queue (QUEUES.NOTIFICATION).
 * Producers enqueue jobs; the worker's NotificationProcessor consumes them.
 * Note: type/channel fields use string — @ecom/shared is a leaf package and
 * cannot import @ecom/contracts enums. Callers should pass valid enum string values.
 */
export const NOTIFICATION_JOBS = {
  SELLER_NOTIFICATION: 'seller.notification',
  USER_NOTIFICATION: 'user.notification',
  ADMIN_BROADCAST: 'admin.broadcast',
} as const

export type NotificationJobName = (typeof NOTIFICATION_JOBS)[keyof typeof NOTIFICATION_JOBS]

export type SellerNotificationJobPayload = {
  kind: 'seller'
  shopId: string
  type: string
  title: string
  message: string
  metadata?: Record<string, unknown>
  idempotencyKey: string
}

export type UserNotificationJobPayload = {
  kind: 'user'
  userId: string
  type: string
  title: string
  message: string
  metadata?: Record<string, unknown>
  idempotencyKey: string
}

export type AdminBroadcastJobPayload = {
  kind: 'admin'
  notificationId: string
  title: string
  message: string
  channel: string
  idempotencyKey: string
}

export type NotificationJobPayload =
  | SellerNotificationJobPayload
  | UserNotificationJobPayload
  | AdminBroadcastJobPayload

export const OUTBOX_EVENTS = {
  MESSAGE_CREATED: 'message.created',
} as const

export type ChatMessageOutboxPayload =
  | {
      recipientKind: 'user'
      recipientUserId: string
      conversationId: string
      messageId: string
      senderId: string
      content: string
    }
  | {
      recipientKind: 'shop'
      recipientShopId: string
      conversationId: string
      messageId: string
      senderId: string
      content: string
    }

/**
 * Default BullMQ job options for notification jobs. Producers spread this on
 * `queue.add(name, payload, defaultJobOptions())` to get retry + DLQ behavior.
 */
export type NotificationJobOptions = {
  attempts: number
  backoff: { type: 'exponential'; delay: number }
  removeOnComplete: { count: number }
  removeOnFail: boolean
}

export function defaultJobOptions(): NotificationJobOptions {
  return {
    attempts: 5,
    backoff: { type: 'exponential', delay: 1000 },
    removeOnComplete: { count: 1000 },
    removeOnFail: false,
  }
}
