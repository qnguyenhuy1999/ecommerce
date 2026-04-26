import 'reflect-metadata'

import type { PrismaClient } from '@prisma/client'
import type { Queue } from 'bullmq'

import type { NotificationView } from '../../src/modules/notification/application/views/notification.view'
import type { NotificationEvent } from '../../src/modules/notification/domain/events/notification.events'
import type { INotificationRepository } from '../../src/modules/notification/domain/ports/notification.repository.port'
import {
  NotificationService,
  buildNotificationFromEvent,
} from '../../src/modules/notification/notification.service'

function buildView(overrides: Partial<NotificationView> = {}): NotificationView {
  return {
    id: 'notif-1',
    type: 'ORDER_PAID',
    title: 'Order Paid',
    body: 'Your order ORD-1 has been paid.',
    data: { orderId: 'order-1', orderNumber: 'ORD-1' },
    isRead: false,
    createdAt: '2026-04-25T12:00:00.000Z',
    ...overrides,
  }
}

function buildRepo(overrides: Partial<INotificationRepository> = {}): INotificationRepository {
  return {
    list: jest.fn(),
    findById: jest.fn(),
    create: jest.fn().mockResolvedValue(buildView()),
    markRead: jest.fn(),
    ...overrides,
  }
}

function buildPrisma(email: string | null = 'buyer@example.com') {
  return {
    user: {
      findUnique: jest.fn().mockResolvedValue(email ? { email } : null),
    },
  } as unknown as PrismaClient
}

function buildQueue(): Queue {
  return {
    add: jest.fn().mockResolvedValue({ id: 'job-1' }),
  } as unknown as Queue
}

describe('buildNotificationFromEvent', () => {
  it('maps ORDER_PAID into the in-app payload + order-confirmation email job', () => {
    const built = buildNotificationFromEvent({
      type: 'ORDER_PAID',
      userId: 'user-1',
      orderId: 'order-1',
      orderNumber: 'ORD-20260425-001',
    })
    expect(built.notification.type).toBe('ORDER_PAID')
    expect(built.notification.body).toContain('ORD-20260425-001')
    expect(built.email?.name).toBe('order-confirmation')
    expect(built.email?.needsEmail).toBe(true)
  })

  it('maps PAYMENT_FAILED into the payment-failed email job', () => {
    const built = buildNotificationFromEvent({
      type: 'PAYMENT_FAILED',
      userId: 'user-1',
      orderId: 'order-1',
      orderNumber: 'ORD-1',
      paymentId: 'pay-1',
    })
    expect(built.notification.type).toBe('PAYMENT_FAILED')
    expect(built.email?.name).toBe('payment-failed')
  })

  it('maps SELLER_APPROVED into the seller-approved email job', () => {
    const built = buildNotificationFromEvent({
      type: 'SELLER_APPROVED',
      userId: 'user-1',
      sellerId: 'seller-1',
      storeName: 'Acme',
    })
    expect(built.notification.type).toBe('SELLER_APPROVED')
    expect(built.notification.body).toContain('Acme')
    expect(built.email?.name).toBe('seller-approved')
  })

  it('does not emit an email job for SELLER_REJECTED', () => {
    const built = buildNotificationFromEvent({
      type: 'SELLER_REJECTED',
      userId: 'user-1',
      sellerId: 'seller-1',
      storeName: 'Acme',
      reason: 'Documents incomplete',
    })
    expect(built.notification.body).toContain('Documents incomplete')
    expect(built.email).toBeNull()
  })

  it('does not emit an email job for PAYMENT_SUCCESS', () => {
    const built = buildNotificationFromEvent({
      type: 'PAYMENT_SUCCESS',
      userId: 'user-1',
      orderId: 'order-1',
      orderNumber: 'ORD-1',
      paymentId: 'pay-1',
    })
    expect(built.email).toBeNull()
  })

  it('does not emit an email job for ORDER_SHIPPED', () => {
    const built = buildNotificationFromEvent({
      type: 'ORDER_SHIPPED',
      userId: 'user-1',
      orderId: 'order-1',
      orderNumber: 'ORD-1',
      trackingNumber: 'TRACK-1',
    })
    expect(built.notification.type).toBe('ORDER_SHIPPED')
    expect(built.notification.data).toMatchObject({ trackingNumber: 'TRACK-1' })
    expect(built.email).toBeNull()
  })
})

describe('NotificationService.recordNotificationFromEvent', () => {
  it('creates the notification row using the caller-provided tx client', async () => {
    const repo = buildRepo()
    const queue = buildQueue()
    const prisma = buildPrisma()
    const service = new NotificationService(repo, prisma, queue)

    const tx = { marker: 'tx' } as unknown as Parameters<INotificationRepository['create']>[0]['tx']
    await service.recordNotificationFromEvent({
      type: 'PAYMENT_SUCCESS',
      userId: 'user-1',
      orderId: 'order-1',
      orderNumber: 'ORD-1',
      paymentId: 'pay-1',
      tx,
    })

    expect(repo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'user-1',
        type: 'PAYMENT_SUCCESS',
        tx,
      }),
    )
    expect(queue.add).not.toHaveBeenCalled()
  })
})

describe('NotificationService.dispatchEmailForEvent', () => {
  it('resolves the user email and enqueues the email job', async () => {
    const repo = buildRepo()
    const prisma = buildPrisma('buyer@example.com')
    const queue = buildQueue()
    const service = new NotificationService(repo, prisma, queue)

    await service.dispatchEmailForEvent({
      type: 'ORDER_PAID',
      userId: 'user-1',
      orderId: 'order-1',
      orderNumber: 'ORD-1',
    })

    expect(queue.add).toHaveBeenCalledWith(
      'order-confirmation',
      expect.objectContaining({
        to: 'buyer@example.com',
        userId: 'user-1',
        orderId: 'order-1',
        orderNumber: 'ORD-1',
      }),
    )
  })

  it('skips enqueueing when the user has no email on file', async () => {
    const repo = buildRepo()
    const prisma = buildPrisma(null)
    const queue = buildQueue()
    const service = new NotificationService(repo, prisma, queue)

    await service.dispatchEmailForEvent({
      type: 'ORDER_PAID',
      userId: 'user-1',
      orderId: 'order-1',
      orderNumber: 'ORD-1',
    })

    expect(queue.add).not.toHaveBeenCalled()
  })

  it('does not throw when the email queue is unreachable', async () => {
    const repo = buildRepo()
    const prisma = buildPrisma('buyer@example.com')
    const queue = {
      add: jest.fn().mockRejectedValue(new Error('connection refused')),
    } as unknown as Queue
    const service = new NotificationService(repo, prisma, queue)

    await expect(
      service.dispatchEmailForEvent({
        type: 'PAYMENT_FAILED',
        userId: 'user-1',
        orderId: 'order-1',
        orderNumber: 'ORD-1',
        paymentId: 'pay-1',
      }),
    ).resolves.toBeUndefined()
  })

  it('skips dispatch when the event type has no email job', async () => {
    const repo = buildRepo()
    const prisma = buildPrisma('buyer@example.com')
    const queue = buildQueue()
    const service = new NotificationService(repo, prisma, queue)

    await service.dispatchEmailForEvent({
      type: 'PAYMENT_SUCCESS',
      userId: 'user-1',
      orderId: 'order-1',
      orderNumber: 'ORD-1',
      paymentId: 'pay-1',
    })

    expect(queue.add).not.toHaveBeenCalled()
  })
})

describe('NotificationService.createFromEvent', () => {
  it('records the notification and dispatches the email in one call', async () => {
    const repo = buildRepo()
    const prisma = buildPrisma('buyer@example.com')
    const queue = buildQueue()
    const service = new NotificationService(repo, prisma, queue)

    const event: NotificationEvent = {
      type: 'SELLER_APPROVED',
      userId: 'user-1',
      sellerId: 'seller-1',
      storeName: 'Acme',
    }
    await service.createFromEvent(event)

    expect(repo.create).toHaveBeenCalledWith(
      expect.objectContaining({ userId: 'user-1', type: 'SELLER_APPROVED' }),
    )
    expect(queue.add).toHaveBeenCalledWith('seller-approved', expect.objectContaining({
      to: 'buyer@example.com',
      sellerId: 'seller-1',
      storeName: 'Acme',
    }))
  })
})
