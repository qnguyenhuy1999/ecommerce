import 'reflect-metadata'

import type { PrismaClient } from '@prisma/client'
import type { Job } from 'bullmq'

const redisGetMock = jest.fn()
const redisSetMock = jest.fn().mockResolvedValue('OK')
jest.mock('@ecom/redis', () => ({
  getRedis: () => ({ get: redisGetMock, set: redisSetMock }),
}))

import { InventoryReconciliationProcessor } from '../../src/processors/inventory-reconciliation.processor'

function buildPrisma(variantPages: Array<Array<{ id: string; stock: number; reservedStock: number }>>) {
  const findManyMock = jest.fn()
  for (const page of variantPages) {
    findManyMock.mockResolvedValueOnce(page)
  }
  // Final empty page so the cursor loop terminates cleanly.
  findManyMock.mockResolvedValueOnce([])

  const outboxCreate = jest.fn().mockResolvedValue({})

  const prisma = {
    productVariant: { findMany: findManyMock },
    outboxEvent: { create: outboxCreate },
  } as unknown as PrismaClient

  return { prisma, findManyMock, outboxCreate }
}

function buildJob(data: Record<string, unknown> = {}): Job {
  return { id: 'recon-1', name: 'sweep', data } as unknown as Job
}

describe('InventoryReconciliationProcessor', () => {
  beforeEach(() => {
    redisGetMock.mockReset()
    redisSetMock.mockClear()
    redisSetMock.mockResolvedValue('OK')
  })

  it('returns zeros for empty inventory', async () => {
    const { prisma } = buildPrisma([[]])
    const processor = new InventoryReconciliationProcessor(prisma)

    const result = await processor.process(buildJob({ batchSize: 100 }))

    expect(result).toEqual({ scanned: 0, drift: 0, healed: 0, missingInRedis: 0, errors: 0 })
    expect(redisSetMock).not.toHaveBeenCalled()
  })

  it('backfills Redis when the stock key is missing', async () => {
    const { prisma } = buildPrisma([
      [{ id: 'variant-1', stock: 10, reservedStock: 2 }],
    ])
    redisGetMock.mockResolvedValueOnce(null)
    const processor = new InventoryReconciliationProcessor(prisma)

    const result = await processor.process(buildJob({ batchSize: 5 }))

    expect(result.missingInRedis).toBe(1)
    expect(result.drift).toBe(0)
    expect(redisSetMock).toHaveBeenCalledWith('stock:variant-1', '8')
  })

  it('detects drift, self-heals Redis, and emits a drift outbox event', async () => {
    const { prisma, outboxCreate } = buildPrisma([
      [{ id: 'variant-1', stock: 10, reservedStock: 0 }],
    ])
    redisGetMock.mockResolvedValueOnce('3')
    const processor = new InventoryReconciliationProcessor(prisma)

    const result = await processor.process(buildJob({ batchSize: 5 }))

    expect(result).toMatchObject({ scanned: 1, drift: 1, healed: 1 })
    expect(redisSetMock).toHaveBeenCalledWith('stock:variant-1', '10')
    expect(outboxCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          aggregateType: 'InventoryReservation',
          eventType: 'inventory.drift_detected',
        }) as Record<string, unknown>,
      }),
    )
  })

  it('observes drift but does not heal in dry-run mode', async () => {
    const { prisma } = buildPrisma([
      [{ id: 'variant-1', stock: 10, reservedStock: 0 }],
    ])
    redisGetMock.mockResolvedValueOnce('3')
    const processor = new InventoryReconciliationProcessor(prisma)

    const result = await processor.process(buildJob({ batchSize: 5, dryRun: true }))

    expect(result.drift).toBe(1)
    expect(result.healed).toBe(0)
    expect(redisSetMock).not.toHaveBeenCalled()
  })

  it('counts redis errors but keeps scanning', async () => {
    const { prisma } = buildPrisma([
      [
        { id: 'variant-1', stock: 5, reservedStock: 0 },
        { id: 'variant-2', stock: 5, reservedStock: 1 },
      ],
    ])
    redisGetMock.mockRejectedValueOnce(new Error('redis down'))
    redisGetMock.mockResolvedValueOnce('4')
    const processor = new InventoryReconciliationProcessor(prisma)

    const result = await processor.process(buildJob({ batchSize: 10 }))

    expect(result.scanned).toBe(2)
    expect(result.errors).toBe(1)
    expect(result.drift).toBe(0)
  })
})
