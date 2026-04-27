import { InjectQueue } from '@nestjs/bullmq'
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common'
import { OrderStatus, PaymentStatus, Prisma, PrismaClient } from '@prisma/client'
import { Queue } from 'bullmq'

import { CreatePaymentIntentDto } from './application/dtos/create-payment-intent.dto'
import { PAYMENT_GATEWAY, PaymentGateway, WebhookEvent } from './payment-gateway/payment-gateway.interface'
import type { NotificationEvent } from '../notification/domain/events/notification.events'
import { NotificationService } from '../notification/notification.service'

export interface PaymentIntentView {
  paymentId: string
  clientSecret: string
  paymentIntentId: string
  providerReference: string
  amount: number
  currency: string
  status: PaymentStatus
}

export interface WebhookAck {
  received: true
}

export interface RefundView {
  orderId: string
  paymentId: string
  refundId: string
  status: 'succeeded' | 'pending' | 'failed'
  amount: number
}

const PAYMENT_PROVIDER = 'stripe'

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name)

  constructor(
    @Inject(PrismaClient) private readonly prisma: PrismaClient,
    @Inject(PAYMENT_GATEWAY) private readonly gateway: PaymentGateway,
    private readonly notifications: NotificationService,
    @InjectQueue('commission') private readonly commissionQueue?: Queue,
  ) {}

  async createIntent(userId: string, dto: CreatePaymentIntentDto): Promise<PaymentIntentView> {
    const order = await this.prisma.order.findUnique({
      where: { id: dto.orderId },
      include: { payment: true },
    })

    if (!order || order.deletedAt !== null) {
      throw new NotFoundException('ORDER_NOT_FOUND')
    }
    if (order.buyerId !== userId) {
      throw new ForbiddenException('ORDER_NOT_OWNED_BY_USER')
    }
    if (order.status !== OrderStatus.PENDING_PAYMENT) {
      throw new ConflictException('ORDER_NOT_PENDING_PAYMENT')
    }
    if (order.payment && order.payment.status !== PaymentStatus.PENDING) {
      throw new ConflictException('PAYMENT_NOT_PENDING')
    }

    const payment =
      order.payment ??
      (await this.prisma.payment.create({
        data: {
          orderId: order.id,
          provider: PAYMENT_PROVIDER,
          amount: order.totalAmount,
          currency: 'SGD',
          status: PaymentStatus.PENDING,
          idempotencyKey: dto.idempotencyKey,
        },
      }))

    const intent = await this.gateway.createIntent(
      order.id,
      payment.amount,
      payment.currency,
      payment.idempotencyKey,
    )

    const updated = await this.prisma.payment.update({
      where: { id: payment.id },
      data: { providerReference: intent.id },
    })

    return {
      paymentId: updated.id,
      clientSecret: intent.clientSecret,
      paymentIntentId: intent.id,
      providerReference: intent.id,
      amount: updated.amount,
      currency: updated.currency,
      status: updated.status,
    }
  }

  async requestRefund(
    userId: string,
    orderId: string,
    input: { amount?: number; reason?: string },
  ): Promise<RefundView> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { payment: true },
    })
    if (!order || order.deletedAt !== null) throw new NotFoundException('ORDER_NOT_FOUND')
    if (order.buyerId !== userId) throw new ForbiddenException('ORDER_NOT_OWNED_BY_USER')
    if (!order.payment || order.payment.status !== PaymentStatus.SUCCESS || !order.payment.providerReference) {
      throw new ConflictException('PAYMENT_NOT_REFUNDABLE')
    }
    const refundableStatuses: OrderStatus[] = [
      OrderStatus.PAID,
      OrderStatus.PROCESSING,
      OrderStatus.SHIPPED,
      OrderStatus.COMPLETED,
    ]
    if (!refundableStatuses.includes(order.status)) {
      throw new ConflictException('ORDER_NOT_REFUNDABLE')
    }
    const amount = input.amount ?? order.payment.amount
    if (amount > order.payment.amount) throw new BadRequestException('REFUND_AMOUNT_EXCEEDS_PAYMENT')

    await this.prisma.order.update({
      where: { id: order.id },
      data: { status: OrderStatus.PENDING_REFUND },
    })

    const refund = await this.gateway.refund(order.payment.providerReference, amount)
    const finalStatus = refund.status === 'succeeded' ? OrderStatus.REFUNDED : OrderStatus.PENDING_REFUND
    await this.prisma.$transaction([
      this.prisma.order.update({
        where: { id: order.id },
        data: { status: finalStatus },
      }),
      this.prisma.subOrder.updateMany({
        where: { orderId: order.id },
        data: { status: finalStatus },
      }),
      this.prisma.payment.update({
        where: { id: order.payment.id },
        data: { status: refund.status === 'succeeded' ? PaymentStatus.REFUNDED : PaymentStatus.PENDING },
      }),
      this.prisma.outboxEvent.create({
        data: {
          aggregateType: 'Order',
          aggregateId: order.id,
          eventType: refund.status === 'succeeded' ? 'ORDER_REFUNDED' : 'ORDER_REFUND_PENDING',
          payload: toJson({
            orderId: order.id,
            paymentId: order.payment.id,
            refundId: refund.id,
            amount: refund.amount,
            reason: input.reason ?? null,
          }),
        },
      }),
      this.prisma.auditEvent.create({
        data: {
          actorId: userId,
          action: 'ORDER_REFUND_REQUESTED',
          targetType: 'Order',
          targetId: order.id,
          metadata: toJson({
            paymentId: order.payment.id,
            refundId: refund.id,
            amount: refund.amount,
            reason: input.reason ?? null,
            status: refund.status,
          }),
        },
      }),
    ])

    return {
      orderId: order.id,
      paymentId: order.payment.id,
      refundId: refund.id,
      status: refund.status,
      amount: refund.amount,
    }
  }

  async handleWebhook(payload: string | Buffer, signature: string | undefined): Promise<WebhookAck> {
    if (!signature) {
      throw new BadRequestException('INVALID_SIGNATURE')
    }

    let event: WebhookEvent
    try {
      event = this.gateway.verifyWebhook(payload, signature)
    } catch {
      throw new BadRequestException('INVALID_SIGNATURE')
    }

    if (!event.paymentIntentId) {
      return { received: true }
    }

    if (isPaymentSucceeded(event)) {
      await this.markPaymentSucceeded(event)
      return { received: true }
    }

    if (isPaymentFailed(event)) {
      await this.markPaymentFailed(event)
      return { received: true }
    }

    return { received: true }
  }

  private async markPaymentSucceeded(event: WebhookEvent): Promise<void> {
    const dispatchAfterCommit: NotificationEvent[] = []
    const ctx: { paidOrderId: string | null } = { paidOrderId: null }

    await this.prisma.$transaction(async (tx) => {
      const payment = await tx.payment.findFirst({
        where: { provider: PAYMENT_PROVIDER, providerReference: event.paymentIntentId },
        include: { order: { include: { subOrders: true } } },
      })
      if (!payment) return

      const claimed = await tx.payment.updateMany({
        where: { id: payment.id, status: PaymentStatus.PENDING },
        data: { status: PaymentStatus.SUCCESS, webhookReceivedAt: new Date() },
      })
      if (claimed.count !== 1) return

      ctx.paidOrderId = payment.orderId

      await this.confirmReservations(tx, payment.orderId)

      await tx.order.updateMany({
        where: { id: payment.orderId, status: OrderStatus.PENDING_PAYMENT },
        data: { status: OrderStatus.PAID },
      })
      await tx.subOrder.updateMany({
        where: { orderId: payment.orderId, status: OrderStatus.PENDING_PAYMENT },
        data: { status: OrderStatus.PAID },
      })

      const paymentSuccessEvent: NotificationEvent = {
        type: 'PAYMENT_SUCCESS',
        userId: payment.order.buyerId,
        orderId: payment.orderId,
        orderNumber: payment.order.orderNumber,
        paymentId: payment.id,
        tx,
      }
      const orderPaidEvent: NotificationEvent = {
        type: 'ORDER_PAID',
        userId: payment.order.buyerId,
        orderId: payment.orderId,
        orderNumber: payment.order.orderNumber,
        tx,
      }
      await this.notifications.recordNotificationFromEvent(paymentSuccessEvent)
      await this.notifications.recordNotificationFromEvent(orderPaidEvent)
      dispatchAfterCommit.push(paymentSuccessEvent, orderPaidEvent)

      await tx.outboxEvent.create({
        data: {
          aggregateType: 'Payment',
          aggregateId: payment.id,
          eventType: 'PAYMENT_SUCCESS',
          payload: toJson({
            orderId: payment.orderId,
            paymentId: payment.id,
            providerReference: event.paymentIntentId,
            webhookEventId: event.id,
          }),
        },
      })
    })

    for (const dispatched of dispatchAfterCommit) {
      await this.notifications.dispatchEmailForEvent(dispatched)
    }

    if (ctx.paidOrderId) {
      try {
        await this.commissionQueue?.add('calculate', { orderId: ctx.paidOrderId })
      } catch (err) {
        this.logger.warn(`Failed to enqueue commission job for order=${ctx.paidOrderId}: ${String(err)}`)
      }
    }
  }

  private async markPaymentFailed(event: WebhookEvent): Promise<void> {
    const dispatchAfterCommit: NotificationEvent[] = []

    await this.prisma.$transaction(async (tx) => {
      const payment = await tx.payment.findFirst({
        where: { provider: PAYMENT_PROVIDER, providerReference: event.paymentIntentId },
        include: { order: true },
      })
      if (!payment) return

      const claimed = await tx.payment.updateMany({
        where: { id: payment.id, status: PaymentStatus.PENDING },
        data: { status: PaymentStatus.FAILED, webhookReceivedAt: new Date() },
      })
      if (claimed.count !== 1) return

      await this.releaseReservations(tx, payment.orderId)

      await tx.order.updateMany({
        where: { id: payment.orderId, status: OrderStatus.PENDING_PAYMENT },
        data: { status: OrderStatus.CANCELLED },
      })
      await tx.subOrder.updateMany({
        where: { orderId: payment.orderId, status: OrderStatus.PENDING_PAYMENT },
        data: { status: OrderStatus.CANCELLED },
      })

      const failedEvent: NotificationEvent = {
        type: 'PAYMENT_FAILED',
        userId: payment.order.buyerId,
        orderId: payment.orderId,
        orderNumber: payment.order.orderNumber,
        paymentId: payment.id,
        tx,
      }
      await this.notifications.recordNotificationFromEvent(failedEvent)
      dispatchAfterCommit.push(failedEvent)

      await tx.outboxEvent.create({
        data: {
          aggregateType: 'Payment',
          aggregateId: payment.id,
          eventType: 'PAYMENT_FAILED',
          payload: toJson({
            orderId: payment.orderId,
            paymentId: payment.id,
            providerReference: event.paymentIntentId,
            webhookEventId: event.id,
          }),
        },
      })
    })

    for (const dispatched of dispatchAfterCommit) {
      await this.notifications.dispatchEmailForEvent(dispatched)
    }
  }

  private async confirmReservations(tx: Prisma.TransactionClient, orderId: string): Promise<void> {
    const reservations = await tx.inventoryReservation.findMany({
      where: { orderId, status: 'ACTIVE' },
      select: { id: true, variantId: true, quantity: true },
    })

    for (const reservation of reservations) {
      const affectedRows = await tx.$executeRaw(
        Prisma.sql`
          UPDATE product_variants
          SET stock = stock - ${reservation.quantity},
              reserved_stock = reserved_stock - ${reservation.quantity},
              updated_at = NOW()
          WHERE id = ${reservation.variantId}
            AND stock >= ${reservation.quantity}
            AND reserved_stock >= ${reservation.quantity}
        `,
      )
      if (affectedRows !== 1) {
        throw new ConflictException('INVENTORY_RESERVATION_NOT_AVAILABLE')
      }
      await tx.inventoryReservation.update({
        where: { id: reservation.id },
        data: { status: 'CONFIRMED' },
      })
    }
  }

  private async releaseReservations(tx: Prisma.TransactionClient, orderId: string): Promise<void> {
    const reservations = await tx.inventoryReservation.findMany({
      where: { orderId, status: 'ACTIVE' },
      select: { id: true, variantId: true, quantity: true },
    })

    for (const reservation of reservations) {
      const affectedRows = await tx.$executeRaw(
        Prisma.sql`
          UPDATE product_variants
          SET reserved_stock = reserved_stock - ${reservation.quantity},
              updated_at = NOW()
          WHERE id = ${reservation.variantId}
            AND reserved_stock >= ${reservation.quantity}
        `,
      )
      if (affectedRows !== 1) {
        throw new ConflictException('INVENTORY_RESERVATION_NOT_AVAILABLE')
      }
      await tx.inventoryReservation.update({
        where: { id: reservation.id },
        data: { status: 'EXPIRED' },
      })
    }
  }
}

function isPaymentSucceeded(event: WebhookEvent): boolean {
  return event.type === 'payment_intent.succeeded' || event.status === 'succeeded'
}

function isPaymentFailed(event: WebhookEvent): boolean {
  return (
    event.type === 'payment_intent.payment_failed' ||
    event.type === 'payment_intent.canceled' ||
    event.status === 'requires_payment_method' ||
    event.status === 'canceled'
  )
}

function toJson(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue
}
