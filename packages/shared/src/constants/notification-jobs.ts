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
}

export type UserNotificationJobPayload = {
  kind: 'user'
  userId: string
  type: string
  title: string
  message: string
  metadata?: Record<string, unknown>
}

export type AdminBroadcastJobPayload = {
  kind: 'admin'
  notificationId: string
  title: string
  message: string
  channel: string
}

export type NotificationJobPayload =
  | SellerNotificationJobPayload
  | UserNotificationJobPayload
  | AdminBroadcastJobPayload
