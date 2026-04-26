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
})
