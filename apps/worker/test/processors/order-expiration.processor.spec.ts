import 'reflect-metadata'

import { OrderStatus, PaymentStatus, type PrismaClient } from '@prisma/client'
import type { Job } from 'bullmq'

const restoreStockMock = jest.fn().mockResolvedValue(undefined)
jest.mock('@ecom/redis', () => ({
  restoreStock: (...args: unknown[]) => restoreStockMock(...args),
}))

import { OrderExpirationProcessor } from '../../src/processors/order-expiration.processor'

type Tx = {
  order: {
    updateMany: jest.Mock
    findUnique: jest.Mock
  }
  subOrder: { updateMany: jest.Mock }
  payment: { updateMany: jest.Mock }
  inventoryReservation: {
    findMany: jest.Mock
    updateMany: jest.Mock
  }
  outboxEvent: { create: jest.Mock }
  $executeRaw: jest.Mock
}

function buildTx(overrides: Partial<Tx> = {}): Tx {
  return {
    order: {
      updateMany: jest.fn().mockResolvedValue({ count: 1 }),
      findUnique: jest.fn().mockResolvedValue({ orderNumber: 'ORD-1', buyerId: 'buyer-1' }),
    },
    subOrder: { updateMany: jest.fn().mockResolvedValue({ count: 2 }) },
    payment: { updateMany: jest.fn().mockResolvedValue({ count: 1 }) },
    inventoryReservation: {
      findMany: jest
        .fn()
        .mockResolvedValue([
          { id: 'res-1', variantId: 'variant-1', quantity: 2 },
          { id: 'res-2', variantId: 'variant-2', quantity: 1 },
        ]),
      updateMany: jest.fn().mockResolvedValue({ count: 1 }),
    },
    outboxEvent: { create: jest.fn().mockResolvedValue({}) },
    $executeRaw: jest.fn().mockResolvedValue(1),
    ...overrides,
  }
}

function buildPrisma(options: {
  tx: Tx
  expiredOrderIds?: Array<{ orderId: string }>
}): { prisma: PrismaClient; transaction: jest.Mock } {
  const transaction = jest.fn((callback: (txArg: Tx) => Promise<unknown>) => callback(options.tx))
  const findExpired = jest
    .fn()
    .mockResolvedValue(options.expiredOrderIds ?? [{ orderId: 'order-1' }])
  const prisma = {
    inventoryReservation: { findMany: findExpired },
    $transaction: transaction,
  } as unknown as PrismaClient
  return { prisma, transaction }
}

function buildJob(data: Record<string, unknown> = {}): Job {
  return { id: 'job-1', name: 'expire', data } as unknown as Job
}

describe('OrderExpirationProcessor', () => {
  beforeEach(() => {
    restoreStockMock.mockClear()
  })

  it('returns zeros when there are no expired orders', async () => {
    const tx = buildTx()
    const { prisma } = buildPrisma({ tx, expiredOrderIds: [] })
    const processor = new OrderExpirationProcessor(prisma)

    const result = await processor.process(buildJob())

    expect(result).toEqual({ scanned: 0, expired: 0, skipped: 0 })
    expect(tx.order.updateMany).not.toHaveBeenCalled()
  })

  it('cancels expired orders, releases reservations, and emits ORDER_CANCELLED outbox event', async () => {
    const tx = buildTx()
    const { prisma } = buildPrisma({ tx })
    const processor = new OrderExpirationProcessor(prisma)

    const result = await processor.process(buildJob())

    expect(result).toEqual({ scanned: 1, expired: 1, skipped: 0 })
    expect(tx.order.updateMany).toHaveBeenCalledWith({
      where: { id: 'order-1', status: OrderStatus.PENDING_PAYMENT },
      data: { status: OrderStatus.CANCELLED },
    })
    expect(tx.subOrder.updateMany).toHaveBeenCalledWith({
      where: { orderId: 'order-1', status: OrderStatus.PENDING_PAYMENT },
      data: { status: OrderStatus.CANCELLED },
    })
    expect(tx.payment.updateMany).toHaveBeenCalledWith({
      where: { orderId: 'order-1', status: PaymentStatus.PENDING },
      data: { status: PaymentStatus.FAILED },
    })
    expect(tx.$executeRaw).toHaveBeenCalledTimes(2)
    expect(tx.inventoryReservation.updateMany).toHaveBeenCalledTimes(2)
    expect(tx.outboxEvent.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          aggregateType: 'Order',
          aggregateId: 'order-1',
          eventType: 'ORDER_CANCELLED',
        }) as Record<string, unknown>,
      }),
    )
    expect(restoreStockMock).toHaveBeenCalledTimes(2)
    expect(restoreStockMock).toHaveBeenCalledWith('variant-1', 2)
    expect(restoreStockMock).toHaveBeenCalledWith('variant-2', 1)
  })

  it('skips orders that were paid between scan and write (race-safe)', async () => {
    const tx = buildTx({
      order: {
        updateMany: jest.fn().mockResolvedValue({ count: 0 }),
        findUnique: jest.fn(),
      },
    })
    const { prisma } = buildPrisma({ tx })
    const processor = new OrderExpirationProcessor(prisma)

    const result = await processor.process(buildJob())

    expect(result).toEqual({ scanned: 1, expired: 0, skipped: 1 })
    expect(tx.subOrder.updateMany).not.toHaveBeenCalled()
    expect(tx.outboxEvent.create).not.toHaveBeenCalled()
    expect(restoreStockMock).not.toHaveBeenCalled()
  })

  it('does not fail the job when Redis restore throws (best-effort)', async () => {
    restoreStockMock.mockRejectedValueOnce(new Error('redis down'))
    const tx = buildTx()
    const { prisma } = buildPrisma({ tx })
    const processor = new OrderExpirationProcessor(prisma)

    await expect(processor.process(buildJob())).resolves.toEqual({
      scanned: 1,
      expired: 1,
      skipped: 0,
    })
  })

  it('honours the asOf override when scanning for expired reservations', async () => {
    const tx = buildTx()
    const { prisma } = buildPrisma({ tx })
    const findManyMock = prisma.inventoryReservation.findMany as jest.Mock
    const processor = new OrderExpirationProcessor(prisma)

    await processor.process(buildJob({ asOf: '2030-01-01T00:00:00.000Z' }))

    expect(findManyMock).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          status: 'ACTIVE',
          expiresAt: { lt: new Date('2030-01-01T00:00:00.000Z') },
        }) as Record<string, unknown>,
      }),
    )
  })
})
