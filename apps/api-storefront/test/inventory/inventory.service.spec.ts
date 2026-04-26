import { type PrismaClient } from '@prisma/client'

import { InventoryService } from '../../src/modules/inventory/inventory.service'
import {
  ReservationNotActiveException,
  ReservationNotFoundException,
  ReservationStockMismatchException,
  StockAdjustmentInvalidException,
  VariantNotFoundException,
} from '../../src/modules/inventory/domain/exceptions/inventory.exceptions'

type Tx = {
  productVariant: {
    findUnique: jest.Mock
    update: jest.Mock
  }
  inventoryReservation: {
    findUnique: jest.Mock
    update: jest.Mock
  }
  outboxEvent: { create: jest.Mock }
  $executeRaw: jest.Mock
  $queryRaw: jest.Mock
}

function buildTx(overrides: Partial<Tx> = {}): Tx {
  return {
    productVariant: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    inventoryReservation: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    outboxEvent: { create: jest.fn().mockResolvedValue({}) },
    $executeRaw: jest.fn().mockResolvedValue(1),
    $queryRaw: jest.fn().mockResolvedValue([]),
    ...overrides,
  }
}

function buildService(tx: Tx, extra: Partial<PrismaClient> = {}) {
  const transactionMock = jest.fn((arg: unknown) => {
    if (typeof arg === 'function') {
      return (arg as (txArg: Tx) => Promise<unknown>)(tx)
    }
    return Promise.resolve([[], 0])
  })
  const prisma = {
    $transaction: transactionMock,
    ...extra,
  } as unknown as PrismaClient
  return { service: new InventoryService(prisma), transactionMock }
}

describe('InventoryService.adjustStock', () => {
  it('rejects zero deltas', async () => {
    const tx = buildTx()
    const { service } = buildService(tx)

    await expect(
      service.adjustStock({ variantId: 'v1', delta: 0, adminUserId: 'admin-1' }),
    ).rejects.toBeInstanceOf(StockAdjustmentInvalidException)
  })

  it('throws when the variant cannot be found', async () => {
    const tx = buildTx()
    // Atomic UPDATE matched no rows; disambiguating read confirms the variant is absent.
    tx.$queryRaw.mockResolvedValue([])
    tx.productVariant.findUnique.mockResolvedValue(null)
    const { service } = buildService(tx)

    await expect(
      service.adjustStock({ variantId: 'v-missing', delta: 5, adminUserId: 'admin-1' }),
    ).rejects.toBeInstanceOf(VariantNotFoundException)
  })

  it('rejects deltas that would push stock below the reserved amount', async () => {
    const tx = buildTx()
    // Atomic UPDATE matched no rows because the invariant guard tripped;
    // the disambiguating read shows why.
    tx.$queryRaw.mockResolvedValue([])
    tx.productVariant.findUnique.mockResolvedValue({ id: 'v1', stock: 10, reservedStock: 5 })
    const { service } = buildService(tx)

    await expect(
      service.adjustStock({ variantId: 'v1', delta: -7, adminUserId: 'admin-1' }),
    ).rejects.toBeInstanceOf(StockAdjustmentInvalidException)
  })

  it('applies the delta and writes an inventory.adjusted outbox event', async () => {
    const tx = buildTx()
    tx.$queryRaw.mockResolvedValue([
      { id: 'v1', stock: 25, reserved_stock: 2, previous_stock: 10 },
    ])
    const { service } = buildService(tx)

    const result = await service.adjustStock({
      variantId: 'v1',
      delta: 15,
      adminUserId: 'admin-1',
      reason: 'restock',
    })

    expect(result).toEqual({
      variantId: 'v1',
      previousStock: 10,
      newStock: 25,
      reservedStock: 2,
      availableStock: 23,
      delta: 15,
    })
    expect(tx.$queryRaw).toHaveBeenCalledTimes(1)
    expect(tx.outboxEvent.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          aggregateType: 'InventoryReservation',
          aggregateId: 'v1',
          eventType: 'inventory.adjusted',
        }) as Record<string, unknown>,
      }),
    )
  })
})

describe('InventoryService.confirmReservation / releaseReservation', () => {
  it('throws when the reservation is missing', async () => {
    const tx = buildTx()
    tx.inventoryReservation.findUnique.mockResolvedValue(null)
    const { service } = buildService(tx)

    await expect(service.confirmReservation('res-x')).rejects.toBeInstanceOf(
      ReservationNotFoundException,
    )
  })

  it('throws when the reservation is no longer ACTIVE', async () => {
    const tx = buildTx()
    tx.inventoryReservation.findUnique.mockResolvedValue({
      id: 'res-1',
      variantId: 'v1',
      orderId: 'o1',
      quantity: 2,
      status: 'CONFIRMED',
      expiresAt: new Date(),
      createdAt: new Date(),
    })
    const { service } = buildService(tx)

    await expect(service.confirmReservation('res-1')).rejects.toBeInstanceOf(
      ReservationNotActiveException,
    )
  })

  it('confirms an active reservation and decrements stock + reserved_stock', async () => {
    const tx = buildTx()
    tx.inventoryReservation.findUnique.mockResolvedValue({
      id: 'res-1',
      variantId: 'v1',
      orderId: 'o1',
      quantity: 2,
      status: 'ACTIVE',
      expiresAt: new Date('2026-01-01T00:00:00Z'),
      createdAt: new Date('2026-01-01T00:00:00Z'),
    })
    tx.inventoryReservation.update.mockResolvedValue({
      id: 'res-1',
      variantId: 'v1',
      orderId: 'o1',
      quantity: 2,
      status: 'CONFIRMED',
      expiresAt: new Date('2026-01-01T00:00:00Z'),
      createdAt: new Date('2026-01-01T00:00:00Z'),
    })
    const { service } = buildService(tx)

    const view = await service.confirmReservation('res-1')

    expect(view.status).toBe('CONFIRMED')
    expect(tx.$executeRaw).toHaveBeenCalledTimes(1)
  })

  it('rolls back via ReservationStockMismatchException when DB rows do not match', async () => {
    const tx = buildTx({
      $executeRaw: jest.fn().mockResolvedValue(0),
    })
    tx.inventoryReservation.findUnique.mockResolvedValue({
      id: 'res-1',
      variantId: 'v1',
      orderId: 'o1',
      quantity: 2,
      status: 'ACTIVE',
      expiresAt: new Date(),
      createdAt: new Date(),
    })
    const { service } = buildService(tx)

    await expect(service.confirmReservation('res-1')).rejects.toBeInstanceOf(
      ReservationStockMismatchException,
    )
  })

  it('releases an active reservation and only decrements reserved_stock', async () => {
    const tx = buildTx()
    tx.inventoryReservation.findUnique.mockResolvedValue({
      id: 'res-1',
      variantId: 'v1',
      orderId: 'o1',
      quantity: 3,
      status: 'ACTIVE',
      expiresAt: new Date('2026-01-01T00:00:00Z'),
      createdAt: new Date('2026-01-01T00:00:00Z'),
    })
    tx.inventoryReservation.update.mockResolvedValue({
      id: 'res-1',
      variantId: 'v1',
      orderId: 'o1',
      quantity: 3,
      status: 'EXPIRED',
      expiresAt: new Date('2026-01-01T00:00:00Z'),
      createdAt: new Date('2026-01-01T00:00:00Z'),
    })
    const { service } = buildService(tx)

    const view = await service.releaseReservation('res-1')

    expect(view.status).toBe('EXPIRED')
    expect(tx.$executeRaw).toHaveBeenCalledTimes(1)
    expect(tx.inventoryReservation.update).toHaveBeenCalledWith({
      where: { id: 'res-1' },
      data: { status: 'EXPIRED' },
    })
  })
})
