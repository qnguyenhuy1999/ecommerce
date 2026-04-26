import { BadRequestException, ConflictException, ForbiddenException } from '@nestjs/common'
import { OrderStatus, PaymentStatus, type PrismaClient } from '@prisma/client'

import type { NotificationService } from '../../src/modules/notification/notification.service'
import type { PaymentGateway, WebhookEvent } from '../../src/modules/payment/payment-gateway/payment-gateway.interface'
import { PaymentService } from '../../src/modules/payment/payment.service'

describe('PaymentService', () => {
  const succeededEvent: WebhookEvent = {
    id: 'evt-success',
    type: 'payment_intent.succeeded',
    paymentIntentId: 'pi_success',
    status: 'succeeded',
    raw: {},
  }

  const failedEvent: WebhookEvent = {
    id: 'evt-failed',
    type: 'payment_intent.payment_failed',
    paymentIntentId: 'pi_failed',
    status: 'requires_payment_method',
    raw: {},
  }

  function pendingOrder(payment: unknown = null) {
    return {
      id: 'order-1',
      orderNumber: 'ORD-20260426-ABC123',
      buyerId: 'user-1',
      status: OrderStatus.PENDING_PAYMENT,
      totalAmount: 50,
      deletedAt: null,
      payment,
    }
  }

  function pendingPayment(providerReference = 'pi_success') {
    return {
      id: 'payment-1',
      orderId: 'order-1',
      provider: 'stripe',
      providerReference,
      amount: 50,
      currency: 'SGD',
      status: PaymentStatus.PENDING,
      idempotencyKey: 'pay-key-1',
      order: {
        id: 'order-1',
        orderNumber: 'ORD-20260426-ABC123',
        buyerId: 'user-1',
        status: OrderStatus.PENDING_PAYMENT,
      },
    }
  }

  function buildTx(payment: unknown, updatePaymentCount = 1) {
    return {
      payment: {
        findFirst: jest.fn().mockResolvedValue(payment),
        updateMany: jest.fn().mockResolvedValue({ count: updatePaymentCount }),
      },
      inventoryReservation: {
        findMany: jest.fn().mockResolvedValue([
          { id: 'reservation-1', variantId: 'variant-1', quantity: 2 },
        ]),
        update: jest.fn().mockResolvedValue({}),
      },
      order: { updateMany: jest.fn().mockResolvedValue({ count: 1 }) },
      subOrder: { updateMany: jest.fn().mockResolvedValue({ count: 1 }) },
      notification: { create: jest.fn().mockResolvedValue({}) },
      outboxEvent: { create: jest.fn().mockResolvedValue({}) },
      $executeRaw: jest.fn().mockResolvedValue(1),
    }
  }

  function buildService(options: {
    order?: unknown
    tx?: ReturnType<typeof buildTx>
    event?: WebhookEvent
    verifyError?: Error
  }) {
    const tx = options.tx ?? buildTx(pendingPayment())
    const paymentUpdateMock = jest.fn().mockResolvedValue({
      id: 'payment-1',
      amount: 50,
      currency: 'SGD',
      status: PaymentStatus.PENDING,
    })
    const transactionMock = jest.fn((callback: (txArg: typeof tx) => Promise<unknown>) =>
      callback(tx),
    )
    const prisma = {
      order: { findUnique: jest.fn().mockResolvedValue(options.order) },
      payment: {
        create: jest.fn().mockResolvedValue({
          id: 'payment-1',
          amount: 50,
          currency: 'SGD',
          status: PaymentStatus.PENDING,
          idempotencyKey: 'pay-key-1',
        }),
        update: paymentUpdateMock,
      },
      $transaction: transactionMock,
    } as unknown as PrismaClient
    const createIntentMock = jest.fn().mockResolvedValue({
      id: 'pi_created',
      clientSecret: 'pi_created_secret_123',
      amount: 50,
      currency: 'SGD',
      status: 'pending',
    })
    const verifyWebhookMock = jest.fn(() => {
      if (options.verifyError) throw options.verifyError
      return options.event ?? succeededEvent
    })
    const gateway = {
      createIntent: createIntentMock,
      confirmPayment: jest.fn(),
      refund: jest.fn(),
      verifyWebhook: verifyWebhookMock,
    } satisfies PaymentGateway

    const notifications = {
      recordNotificationFromEvent: jest.fn().mockResolvedValue({
        id: 'notif-1',
        type: 'PAYMENT_SUCCESS',
        title: '',
        body: '',
        data: null,
        isRead: false,
        createdAt: new Date().toISOString(),
      }),
      dispatchEmailForEvent: jest.fn().mockResolvedValue(undefined),
      createFromEvent: jest.fn(),
    } as unknown as NotificationService

    return {
      service: new PaymentService(prisma, gateway, notifications),
      createIntentMock,
      paymentUpdateMock,
      transactionMock,
      tx,
      notifications,
    }
  }

  it('creates a Stripe intent only for the owning pending-payment order', async () => {
    const { service, createIntentMock, paymentUpdateMock } = buildService({
      order: pendingOrder(),
    })

    const result = await service.createIntent('user-1', {
      orderId: 'order-1',
      paymentMethod: 'stripe',
      idempotencyKey: 'pay-key-1',
    })

    expect(createIntentMock).toHaveBeenCalledWith('order-1', 50, 'SGD', 'pay-key-1')
    expect(paymentUpdateMock).toHaveBeenCalledWith({
      where: { id: 'payment-1' },
      data: { providerReference: 'pi_created' },
    })
    expect(result).toEqual(
      expect.objectContaining({
        paymentId: 'payment-1',
        clientSecret: 'pi_created_secret_123',
        providerReference: 'pi_created',
      }),
    )
  })

  it('rejects payment intent creation for another buyer', async () => {
    const { service } = buildService({ order: pendingOrder() })

    await expect(
      service.createIntent('user-2', {
        orderId: 'order-1',
        paymentMethod: 'stripe',
        idempotencyKey: 'pay-key-1',
      }),
    ).rejects.toBeInstanceOf(ForbiddenException)
  })

  it('processes a successful webhook once, pays the order, and confirms reservations', async () => {
    const tx = buildTx(pendingPayment('pi_success'))
    const { service } = buildService({ tx, event: succeededEvent })

    await expect(service.handleWebhook('{"id":"evt-success"}', 'valid-signature')).resolves.toEqual({
      received: true,
    })

    expect(tx.payment.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'payment-1', status: PaymentStatus.PENDING },
        data: expect.objectContaining({ status: PaymentStatus.SUCCESS }),
      }),
    )
    expect(tx.$executeRaw).toHaveBeenCalledTimes(1)
    expect(tx.inventoryReservation.update).toHaveBeenCalledWith({
      where: { id: 'reservation-1' },
      data: { status: 'CONFIRMED' },
    })
    expect(tx.order.updateMany).toHaveBeenCalledWith({
      where: { id: 'order-1', status: OrderStatus.PENDING_PAYMENT },
      data: { status: OrderStatus.PAID },
    })
    expect(tx.subOrder.updateMany).toHaveBeenCalledWith({
      where: { orderId: 'order-1', status: OrderStatus.PENDING_PAYMENT },
      data: { status: OrderStatus.PAID },
    })
  })

  it('ignores duplicate successful webhooks without touching inventory again', async () => {
    const tx = buildTx(pendingPayment('pi_success'), 0)
    const { service } = buildService({ tx, event: succeededEvent })

    await service.handleWebhook('{"id":"evt-success"}', 'valid-signature')

    expect(tx.payment.updateMany).toHaveBeenCalledTimes(1)
    expect(tx.inventoryReservation.findMany).not.toHaveBeenCalled()
    expect(tx.$executeRaw).not.toHaveBeenCalled()
    expect(tx.order.updateMany).not.toHaveBeenCalled()
  })

  it('rejects invalid webhook signatures', async () => {
    const { service, transactionMock } = buildService({
      verifyError: new Error('bad signature'),
    })

    await expect(service.handleWebhook('{}', 'invalid-signature')).rejects.toBeInstanceOf(
      BadRequestException,
    )
    expect(transactionMock).not.toHaveBeenCalled()
  })

  it('marks failed payments, cancels pending orders, and releases reservations', async () => {
    const tx = buildTx(pendingPayment('pi_failed'))
    const { service } = buildService({ tx, event: failedEvent })

    await service.handleWebhook('{"id":"evt-failed"}', 'valid-signature')

    expect(tx.payment.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'payment-1', status: PaymentStatus.PENDING },
        data: expect.objectContaining({ status: PaymentStatus.FAILED }),
      }),
    )
    expect(tx.inventoryReservation.update).toHaveBeenCalledWith({
      where: { id: 'reservation-1' },
      data: { status: 'EXPIRED' },
    })
    expect(tx.order.updateMany).toHaveBeenCalledWith({
      where: { id: 'order-1', status: OrderStatus.PENDING_PAYMENT },
      data: { status: OrderStatus.CANCELLED },
    })
    expect(tx.subOrder.updateMany).toHaveBeenCalledWith({
      where: { orderId: 'order-1', status: OrderStatus.PENDING_PAYMENT },
      data: { status: OrderStatus.CANCELLED },
    })
  })

  it('rolls back payment confirmation when the reservation cannot be decremented', async () => {
    const tx = buildTx(pendingPayment('pi_success'))
    tx.$executeRaw.mockResolvedValue(0)
    const { service } = buildService({ tx, event: succeededEvent })

    await expect(service.handleWebhook('{}', 'valid-signature')).rejects.toBeInstanceOf(
      ConflictException,
    )
  })
})
