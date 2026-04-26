import type { PrismaClient } from '@prisma/client'

import { InventoryService } from '../../../../src/modules/inventory/inventory.service'
import {
  CartEmptyException,
  CheckoutInsufficientStockException,
} from '../../../../src/modules/order/domain/exceptions/order.exceptions'
import { PrismaOrderRepository } from '../../../../src/modules/order/infrastructure/repositories/prisma-order.repository'

describe('PrismaOrderRepository', () => {
  const shippingAddress = {
    fullName: 'Jane Buyer',
    phone: '+6591234567',
    addressLine1: '123 Main Street',
    city: 'Singapore',
    postalCode: '123456',
    country: 'SG',
  }
  const expiresAt = new Date('2026-04-26T12:30:00.000Z')

  function buildTx(cart: unknown, orderCreateResult?: unknown) {
    return {
      cart: { findUnique: jest.fn().mockResolvedValue(cart) },
      order: { create: jest.fn().mockResolvedValue(orderCreateResult) },
      cartItem: { deleteMany: jest.fn().mockResolvedValue({ count: 1 }) },
    }
  }

  function buildRepo(tx: ReturnType<typeof buildTx>, inventory: Partial<InventoryService>) {
    const prisma = {
      $transaction: jest.fn((callback: (txArg: typeof tx) => Promise<unknown>) => callback(tx)),
    } as unknown as PrismaClient
    return {
      repo: new PrismaOrderRepository(prisma, inventory as InventoryService),
      prisma,
    }
  }

  function activeCart(quantity = 2) {
    return {
      id: 'cart-1',
      userId: 'user-1',
      items: [
        {
          id: 'cart-item-1',
          cartId: 'cart-1',
          variantId: 'variant-1',
          quantity,
          variant: {
            id: 'variant-1',
            sku: 'TSHIRT-BLACK-M',
            attributes: { color: 'Black', size: 'M' },
            priceOverride: null,
            stock: 10,
            reservedStock: 1,
            product: {
              id: 'product-1',
              sellerId: 'seller-1',
              sku: 'TSHIRT',
              name: 'Cotton T-Shirt',
              price: 25,
              status: 'ACTIVE',
              deletedAt: null,
              seller: { id: 'seller-1', storeName: 'Threads' },
            },
          },
        },
      ],
    }
  }

  function orderResult() {
    return {
      id: 'order-1',
      orderNumber: 'ORD-20260426-ABC123',
      status: 'PENDING_PAYMENT',
      subtotal: 50,
      shippingFee: 0,
      totalAmount: 50,
      subOrders: [
        {
          id: 'sub-order-1',
          sellerId: 'seller-1',
          subtotal: 50,
          status: 'PENDING_PAYMENT',
          seller: { id: 'seller-1', storeName: 'Threads' },
          items: [
            {
              id: 'order-item-1',
              variantId: 'variant-1',
              quantity: 2,
              unitPrice: 25,
              priceSnapshot: {
                productName: 'Cotton T-Shirt',
                variantSku: 'TSHIRT-BLACK-M',
                attributes: { color: 'Black', size: 'M' },
              },
            },
          ],
        },
      ],
    }
  }

  it('rejects an empty cart without creating an order or clearing cart items', async () => {
    const tx = buildTx(null)
    const inventory = { reserveVariant: jest.fn() }
    const { repo } = buildRepo(tx, inventory)

    await expect(
      repo.createFromCart({ userId: 'user-1', shippingAddress, reservationExpiresAt: expiresAt }),
    ).rejects.toBeInstanceOf(CartEmptyException)

    expect(tx.order.create).not.toHaveBeenCalled()
    expect(inventory.reserveVariant).not.toHaveBeenCalled()
    expect(tx.cartItem.deleteMany).not.toHaveBeenCalled()
  })

  it('rejects insufficient stock before mutating orders, reservations, or cart items', async () => {
    const cart = activeCart(10)
    cart.items[0].variant.stock = 4
    cart.items[0].variant.reservedStock = 1
    const tx = buildTx(cart)
    const inventory = { reserveVariant: jest.fn() }
    const { repo } = buildRepo(tx, inventory)

    await expect(
      repo.createFromCart({ userId: 'user-1', shippingAddress, reservationExpiresAt: expiresAt }),
    ).rejects.toBeInstanceOf(CheckoutInsufficientStockException)

    expect(tx.order.create).not.toHaveBeenCalled()
    expect(inventory.reserveVariant).not.toHaveBeenCalled()
    expect(tx.cartItem.deleteMany).not.toHaveBeenCalled()
  })

  it('creates suborders/items, reserves inventory, and clears the cart on successful checkout', async () => {
    const tx = buildTx(activeCart(), orderResult())
    const inventory = { reserveVariant: jest.fn().mockResolvedValue(true) }
    const { repo } = buildRepo(tx, inventory)

    const result = await repo.createFromCart({
      userId: 'user-1',
      shippingAddress,
      reservationExpiresAt: expiresAt,
    })

    expect(tx.order.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          buyerId: 'user-1',
          status: 'PENDING_PAYMENT',
          subtotal: 50,
          shippingFee: 0,
          totalAmount: 50,
          subOrders: {
            create: [
              expect.objectContaining({
                sellerId: 'seller-1',
                subtotal: 50,
                items: {
                  create: [
                    expect.objectContaining({
                      variantId: 'variant-1',
                      quantity: 2,
                      unitPrice: 25,
                    }),
                  ],
                },
              }),
            ],
          },
        }),
      }),
    )
    expect(inventory.reserveVariant).toHaveBeenCalledWith(tx, {
      variantId: 'variant-1',
      orderId: 'order-1',
      quantity: 2,
      expiresAt,
    })
    expect(tx.cartItem.deleteMany).toHaveBeenCalledWith({ where: { cartId: 'cart-1' } })
    expect(result).toEqual(
      expect.objectContaining({
        orderId: 'order-1',
        status: 'PENDING_PAYMENT',
        subtotal: 50,
        totalAmount: 50,
      }),
    )
    expect(result.subOrders[0].items[0]).toEqual(
      expect.objectContaining({
        productName: 'Cotton T-Shirt',
        variantSku: 'TSHIRT-BLACK-M',
        quantity: 2,
      }),
    )
  })

  it('does not clear the cart when atomic reservation fails', async () => {
    const tx = buildTx(activeCart(), orderResult())
    const inventory = { reserveVariant: jest.fn().mockResolvedValue(false) }
    const { repo } = buildRepo(tx, inventory)

    await expect(
      repo.createFromCart({ userId: 'user-1', shippingAddress, reservationExpiresAt: expiresAt }),
    ).rejects.toBeInstanceOf(CheckoutInsufficientStockException)

    expect(tx.cartItem.deleteMany).not.toHaveBeenCalled()
  })

  describe('listByBuyer', () => {
    function buildHistoryRow(overrides: { id?: string; createdAt?: Date } = {}) {
      return {
        id: overrides.id ?? 'order-1',
        orderNumber: 'ORD-20260425-ABC',
        status: 'PAID',
        subtotal: 50,
        shippingFee: 0,
        totalAmount: 50,
        createdAt: overrides.createdAt ?? new Date('2026-04-25T12:00:00.000Z'),
        subOrders: [
          {
            id: 'sub-1',
            sellerId: 'seller-1',
            subtotal: 50,
            status: 'PAID',
            seller: { id: 'seller-1', storeName: 'Threads' },
            items: [
              {
                id: 'item-1',
                variantId: 'variant-1',
                quantity: 2,
                unitPrice: 25,
                priceSnapshot: {
                  productName: 'Cotton T-Shirt',
                  variantSku: 'TSHIRT-BLACK-M',
                  attributes: { color: 'Black', size: 'M' },
                },
              },
            ],
          },
        ],
      }
    }

    function buildListPrisma(options: {
      rows: ReturnType<typeof buildHistoryRow>[]
      total: number
    }) {
      const findMany = jest.fn().mockResolvedValue(options.rows)
      const count = jest.fn().mockResolvedValue(options.total)
      const prisma = {
        order: { findMany, count },
        $transaction: jest.fn(async (ops: Promise<unknown>[]) => Promise.all(ops)),
      } as unknown as PrismaClient
      return { prisma, findMany, count }
    }

    it('scopes the query to the authenticated buyer and excludes soft-deleted orders', async () => {
      const { prisma, findMany, count } = buildListPrisma({ rows: [], total: 0 })
      const repo = new PrismaOrderRepository(prisma, {} as InventoryService)

      await repo.listByBuyer({
        buyerId: 'buyer-42',
        page: 1,
        limit: 20,
        sort: 'createdAt',
        order: 'desc',
      })

      const where = findMany.mock.calls[0][0].where
      expect(where).toEqual({ buyerId: 'buyer-42', deletedAt: null })
      expect(count).toHaveBeenCalledWith({ where })
    })

    it('applies the optional status filter', async () => {
      const { prisma, findMany } = buildListPrisma({ rows: [], total: 0 })
      const repo = new PrismaOrderRepository(prisma, {} as InventoryService)

      await repo.listByBuyer({
        buyerId: 'buyer-42',
        page: 1,
        limit: 20,
        sort: 'createdAt',
        order: 'desc',
        status: 'SHIPPED',
      })

      expect(findMany.mock.calls[0][0].where).toEqual({
        buyerId: 'buyer-42',
        deletedAt: null,
        status: 'SHIPPED',
      })
    })

    it('computes pagination metadata (totalPages) and applies skip/take correctly', async () => {
      const { prisma, findMany } = buildListPrisma({
        rows: [buildHistoryRow({ id: 'order-page-2-1' }), buildHistoryRow({ id: 'order-page-2-2' })],
        total: 7,
      })
      const repo = new PrismaOrderRepository(prisma, {} as InventoryService)

      const result = await repo.listByBuyer({
        buyerId: 'buyer-42',
        page: 2,
        limit: 3,
        sort: 'createdAt',
        order: 'asc',
      })

      expect(findMany.mock.calls[0][0]).toMatchObject({
        skip: 3,
        take: 3,
        orderBy: { createdAt: 'asc' },
      })
      expect(result).toEqual(
        expect.objectContaining({ page: 2, limit: 3, total: 7, totalPages: 3 }),
      )
      expect(result.data).toHaveLength(2)
    })

    it('returns at least one totalPages even when there are no orders', async () => {
      const { prisma } = buildListPrisma({ rows: [], total: 0 })
      const repo = new PrismaOrderRepository(prisma, {} as InventoryService)

      const result = await repo.listByBuyer({
        buyerId: 'buyer-42',
        page: 1,
        limit: 20,
        sort: 'createdAt',
        order: 'desc',
      })

      expect(result.total).toBe(0)
      expect(result.totalPages).toBe(1)
      expect(result.data).toEqual([])
    })

    it('maps each row to an OrderHistoryView including orderNumber, status, totals, and suborders/items', async () => {
      const { prisma } = buildListPrisma({ rows: [buildHistoryRow()], total: 1 })
      const repo = new PrismaOrderRepository(prisma, {} as InventoryService)

      const result = await repo.listByBuyer({
        buyerId: 'buyer-42',
        page: 1,
        limit: 20,
        sort: 'createdAt',
        order: 'desc',
      })

      expect(result.data[0]).toEqual(
        expect.objectContaining({
          orderId: 'order-1',
          orderNumber: 'ORD-20260425-ABC',
          status: 'PAID',
          subtotal: 50,
          shippingFee: 0,
          totalAmount: 50,
          createdAt: '2026-04-25T12:00:00.000Z',
        }),
      )
      expect(result.data[0].subOrders[0]).toEqual(
        expect.objectContaining({ sellerId: 'seller-1', storeName: 'Threads', status: 'PAID' }),
      )
      expect(result.data[0].subOrders[0].items[0]).toEqual(
        expect.objectContaining({ productName: 'Cotton T-Shirt', quantity: 2, unitPrice: 25 }),
      )
    })
  })
})
