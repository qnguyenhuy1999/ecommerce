import type { Prisma } from '@prisma/client'

/**
 * Domain events that fan out into in-app notifications and (optionally) email
 * jobs. These shapes are owned by the notification module so callers across
 * the codebase have a single typed surface to dispatch from.
 *
 * The recipient's email address (when an email job is needed) is resolved
 * internally by NotificationService from `userId` so callers don't need to
 * pre-fetch it.
 */
export type NotificationEvent =
  | OrderPaidEvent
  | OrderShippedEvent
  | PaymentSuccessEvent
  | PaymentFailedEvent
  | SellerApprovedEvent
  | SellerRejectedEvent

interface BaseEvent {
  userId: string
  /** Optional Prisma transaction client so the notification row commits in
   *  the same transaction as the upstream state change. */
  tx?: Prisma.TransactionClient
}

export interface OrderPaidEvent extends BaseEvent {
  type: 'ORDER_PAID'
  orderId: string
  orderNumber: string
}

export interface OrderShippedEvent extends BaseEvent {
  type: 'ORDER_SHIPPED'
  orderId: string
  orderNumber: string
  trackingNumber?: string | null
}

export interface PaymentSuccessEvent extends BaseEvent {
  type: 'PAYMENT_SUCCESS'
  orderId: string
  orderNumber: string
  paymentId: string
}

export interface PaymentFailedEvent extends BaseEvent {
  type: 'PAYMENT_FAILED'
  orderId: string
  orderNumber: string
  paymentId: string
}

export interface SellerApprovedEvent extends BaseEvent {
  type: 'SELLER_APPROVED'
  sellerId: string
  storeName: string
}

export interface SellerRejectedEvent extends BaseEvent {
  type: 'SELLER_REJECTED'
  sellerId: string
  storeName: string
  reason: string | null
}
