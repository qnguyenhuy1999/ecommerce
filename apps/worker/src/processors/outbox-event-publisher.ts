import { InjectQueue } from '@nestjs/bullmq'
import { Injectable, Logger } from '@nestjs/common'
import type { Queue } from 'bullmq'

import type { OutboxEnvelope } from '@ecom/shared'

interface EventPayload {
  [key: string]: unknown
}

@Injectable()
export class OutboxEventPublisher {
  private readonly logger = new Logger(OutboxEventPublisher.name)

  constructor(
    @InjectQueue('email') private readonly emailQueue: Queue,
    @InjectQueue('commission') private readonly commissionQueue: Queue,
  ) {}

  async publish(envelope: OutboxEnvelope): Promise<void> {
    const payload = asPayload(envelope.payload)

    if (envelope.eventType === 'ORDER_PAID' || envelope.eventType === 'PAYMENT_SUCCESS') {
      const orderId = stringField(payload.orderId) ?? envelope.aggregateId
      await this.commissionQueue.add(
        'calculate',
        { orderId },
        { jobId: `commission:${orderId}`, removeOnComplete: 100, removeOnFail: 100 },
      )
    }

    const emailJob = this.toEmailJob(envelope, payload)
    if (emailJob) {
      await this.emailQueue.add(emailJob.name, emailJob.payload, {
        jobId: `outbox-email:${envelope.outboxId}:${emailJob.name}`,
        removeOnComplete: 100,
        removeOnFail: 100,
      })
    }

    this.logger.debug(`Published outbox event ${envelope.eventType} ${envelope.outboxId}`)
  }

  private toEmailJob(
    envelope: OutboxEnvelope,
    payload: EventPayload,
  ): { name: string; payload: EventPayload } | null {
    const to = stringField(payload.buyerEmail) ?? stringField(payload.ownerEmail) ?? stringField(payload.to)
    const orderNumber = stringField(payload.orderNumber)
    const storeName = stringField(payload.storeName)

    switch (envelope.eventType) {
      case 'ORDER_PAID':
      case 'PAYMENT_SUCCESS':
        if (!to) return null
        return {
          name: 'order-confirmation',
          payload: {
            to,
            orderId: stringField(payload.orderId) ?? envelope.aggregateId,
            orderNumber,
            paymentId: stringField(payload.paymentId),
          },
        }
      case 'PAYMENT_FAILED':
        if (!to) return null
        return {
          name: 'payment-failed',
          payload: {
            to,
            orderId: stringField(payload.orderId) ?? envelope.aggregateId,
            orderNumber,
            paymentId: stringField(payload.paymentId),
          },
        }
      case 'SELLER_KYC_APPROVED':
      case 'seller.approved':
        if (!to) return null
        return {
          name: 'seller-approved',
          payload: {
            to,
            sellerId: stringField(payload.sellerId) ?? envelope.aggregateId,
            storeName,
          },
        }
      case 'SELLER_KYC_REJECTED':
      case 'seller.rejected':
        if (!to) return null
        return {
          name: 'seller-rejected',
          payload: {
            to,
            sellerId: stringField(payload.sellerId) ?? envelope.aggregateId,
            storeName,
            reason: stringField(payload.reason),
          },
        }
      case 'ORDER_SHIPPED':
        if (!to) return null
        return {
          name: 'order-shipped',
          payload: {
            to,
            orderId: stringField(payload.orderId) ?? envelope.aggregateId,
            orderNumber,
            trackingNumber: stringField(payload.trackingNumber),
          },
        }
      case 'ORDER_CANCELLED':
        if (!to) return null
        return {
          name: 'order-cancelled',
          payload: {
            to,
            orderId: stringField(payload.orderId) ?? envelope.aggregateId,
            orderNumber,
          },
        }
      case 'ORDER_REFUNDED':
      case 'ORDER_REFUND_PENDING':
      case 'ORDER_PENDING_REFUND':
        if (!to) return null
        return {
          name: envelope.eventType === 'ORDER_REFUNDED' ? 'refund-approved' : 'refund-requested',
          payload: {
            to,
            orderId: stringField(payload.orderId) ?? envelope.aggregateId,
            orderNumber,
            refundId: stringField(payload.refundId),
          },
        }
      default:
        return null
    }
  }
}

function asPayload(value: unknown): EventPayload {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? (value as EventPayload)
    : {}
}

function stringField(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined
}
