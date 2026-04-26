import { InjectQueue } from '@nestjs/bullmq'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { type NotificationType, PrismaClient } from '@prisma/client'
import { Queue } from 'bullmq'

import type { NotificationView } from './application/views/notification.view'
import type { NotificationEvent } from './domain/events/notification.events'
import {
  INotificationRepository,
  NOTIFICATION_REPOSITORY,
} from './domain/ports/notification.repository.port'

interface BuiltNotification {
  type: NotificationType
  title: string
  body: string
  data: Record<string, unknown>
}

interface EmailJob {
  /** Job name as registered in the worker email processor. */
  name: string
  /** When true the recipient's email address is resolved from the user record
   *  before the job is enqueued. */
  needsEmail: boolean
  payload: Record<string, unknown>
}

/**
 * Pure mapping from a domain event to the notification row + (optional) email
 * job. Exported for unit testing without DI.
 */
export function buildNotificationFromEvent(event: NotificationEvent): {
  notification: BuiltNotification
  email: EmailJob | null
} {
  switch (event.type) {
    case 'ORDER_PAID':
      return {
        notification: {
          type: 'ORDER_PAID',
          title: 'Order Paid',
          body: `Your order ${event.orderNumber} has been paid successfully.`,
          data: { orderId: event.orderId, orderNumber: event.orderNumber },
        },
        email: {
          name: 'order-confirmation',
          needsEmail: true,
          payload: { orderId: event.orderId, orderNumber: event.orderNumber },
        },
      }
    case 'ORDER_SHIPPED':
      return {
        notification: {
          type: 'ORDER_SHIPPED',
          title: 'Order Shipped',
          body: `Your order ${event.orderNumber} is on its way.`,
          data: {
            orderId: event.orderId,
            orderNumber: event.orderNumber,
            trackingNumber: event.trackingNumber ?? null,
          },
        },
        email: null,
      }
    case 'PAYMENT_SUCCESS':
      return {
        notification: {
          type: 'PAYMENT_SUCCESS',
          title: 'Payment Confirmed',
          body: `We received your payment for order ${event.orderNumber}.`,
          data: {
            orderId: event.orderId,
            orderNumber: event.orderNumber,
            paymentId: event.paymentId,
          },
        },
        email: null,
      }
    case 'PAYMENT_FAILED':
      return {
        notification: {
          type: 'PAYMENT_FAILED',
          title: 'Payment Failed',
          body: `Your payment for order ${event.orderNumber} could not be processed.`,
          data: {
            orderId: event.orderId,
            orderNumber: event.orderNumber,
            paymentId: event.paymentId,
          },
        },
        email: {
          name: 'payment-failed',
          needsEmail: true,
          payload: {
            orderId: event.orderId,
            orderNumber: event.orderNumber,
            paymentId: event.paymentId,
          },
        },
      }
    case 'SELLER_APPROVED':
      return {
        notification: {
          type: 'SELLER_APPROVED',
          title: 'Seller Application Approved',
          body: `Your store "${event.storeName}" is now approved. You can start listing products.`,
          data: { sellerId: event.sellerId, storeName: event.storeName },
        },
        email: {
          name: 'seller-approved',
          needsEmail: true,
          payload: { sellerId: event.sellerId, storeName: event.storeName },
        },
      }
    case 'SELLER_REJECTED':
      return {
        notification: {
          type: 'SELLER_REJECTED',
          title: 'Seller Application Rejected',
          body: event.reason
            ? `Your seller application was rejected: ${event.reason}`
            : 'Your seller application was rejected.',
          data: {
            sellerId: event.sellerId,
            storeName: event.storeName,
            reason: event.reason,
          },
        },
        email: null,
      }
  }
}

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name)

  constructor(
    @Inject(NOTIFICATION_REPOSITORY) private readonly notifications: INotificationRepository,
    @Inject(PrismaClient) private readonly prisma: PrismaClient,
    @InjectQueue('email') private readonly emailQueue: Queue,
  ) {}

  /**
   * Persist the in-app notification for a domain event, optionally inside the
   * caller's Prisma transaction. Does NOT enqueue any email job — callers
   * should invoke {@link dispatchEmailForEvent} after their transaction
   * commits to avoid emitting emails for state that later rolled back.
   */
  async recordNotificationFromEvent(event: NotificationEvent): Promise<NotificationView> {
    const { notification } = buildNotificationFromEvent(event)
    return this.notifications.create({
      userId: event.userId,
      type: notification.type,
      title: notification.title,
      body: notification.body,
      data: notification.data,
      tx: event.tx,
    })
  }

  /**
   * Enqueue the email job (if any) associated with the given event. Safe to
   * call after the upstream transaction commits.
   *
   * Best-effort: failures to resolve the recipient or enqueue the job are
   * logged but do not throw, since the in-app notification is the primary
   * delivery channel.
   */
  async dispatchEmailForEvent(event: NotificationEvent): Promise<void> {
    const { email } = buildNotificationFromEvent(event)
    if (!email) return
    await this.enqueueEmail(event.userId, email)
  }

  /**
   * Convenience method for callers that don't need transactional control:
   * persists the notification AND enqueues the email job (if any) in one go.
   */
  async createFromEvent(event: NotificationEvent): Promise<NotificationView> {
    const created = await this.recordNotificationFromEvent(event)
    await this.dispatchEmailForEvent(event)
    return created
  }

  private async enqueueEmail(userId: string, job: EmailJob): Promise<void> {
    try {
      let payload = job.payload
      if (job.needsEmail) {
        const user = await this.prisma.user.findUnique({
          where: { id: userId },
          select: { email: true },
        })
        if (!user?.email) {
          this.logger.warn(
            `Skipping email job ${job.name}: user ${userId} has no email on file`,
          )
          return
        }
        payload = { ...payload, to: user.email, userId }
      }
      await this.emailQueue.add(job.name, payload)
    } catch (err) {
      this.logger.warn(
        `Failed to enqueue email job ${job.name}: ${(err as Error).message}`,
      )
    }
  }
}
