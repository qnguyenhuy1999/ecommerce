import { Inject, Injectable } from '@nestjs/common'
import { Prisma, PrismaClient } from '@prisma/client'

import { InventoryService } from '../../../inventory/inventory.service'
import type {
  OrderHistoryPage,
  OrderHistoryView,
} from '../../application/views/order-history.view'
import type {
  OrderItemSummaryView,
  OrderStatusView,
  OrderSummaryView,
  SubOrderSummaryView,
} from '../../application/views/order-summary.view'
import {
  CartEmptyException,
  CheckoutInsufficientStockException,
  CheckoutProductNotActiveException,
} from '../../domain/exceptions/order.exceptions'
import type {
  CreateOrderFromCartInput,
  IOrderRepository,
  ListOrdersByBuyerInput,
} from '../../domain/ports/order.repository.port'

const CHECKOUT_CART_INCLUDE = {
  items: {
    include: {
      variant: {
        include: {
          product: {
            include: {
              seller: { select: { id: true, storeName: true } },
            },
          },
        },
      },
    },
  },
} satisfies Prisma.CartInclude

const ORDER_SUMMARY_INCLUDE = {
  subOrders: {
    include: {
      seller: { select: { id: true, storeName: true } },
      items: true,
    },
  },
} satisfies Prisma.OrderInclude

type CheckoutCart = Prisma.CartGetPayload<{ include: typeof CHECKOUT_CART_INCLUDE }>
type CheckoutCartItem = CheckoutCart['items'][number]
type OrderSummaryRow = Prisma.OrderGetPayload<{ include: typeof ORDER_SUMMARY_INCLUDE }>

interface SellerCheckoutGroup {
  sellerId: string
  storeName: string
  subtotal: number
  items: CheckoutCartItem[]
}

@Injectable()
export class PrismaOrderRepository implements IOrderRepository {
  constructor(
    @Inject(PrismaClient) private readonly prisma: PrismaClient,
    private readonly inventoryService: InventoryService,
  ) {}

  async createFromCart(input: CreateOrderFromCartInput): Promise<OrderSummaryView> {
    return this.prisma.$transaction(async (tx) => {
      const cart = await tx.cart.findUnique({
        where: { userId: input.userId },
        include: CHECKOUT_CART_INCLUDE,
      })

      if (!cart || cart.items.length === 0) {
        throw new CartEmptyException()
      }

      for (const item of cart.items) {
        if (item.variant.product.status !== 'ACTIVE' || item.variant.product.deletedAt !== null) {
          throw new CheckoutProductNotActiveException()
        }
        if (item.quantity > item.variant.stock - item.variant.reservedStock) {
          throw new CheckoutInsufficientStockException()
        }
      }

      const sellerGroups = this.groupBySeller(cart.items)
      const subtotal = sellerGroups.reduce((sum, group) => sum + group.subtotal, 0)
      const shippingFee = 0
      const order = await tx.order.create({
        data: {
          orderNumber: this.generateOrderNumber(),
          buyerId: input.userId,
          status: 'PENDING_PAYMENT',
          subtotal,
          shippingFee,
          totalAmount: subtotal + shippingFee,
          shippingAddress: this.toJson(input.shippingAddress),
          subOrders: {
            create: sellerGroups.map((group) => ({
              sellerId: group.sellerId,
              subtotal: group.subtotal,
              status: 'PENDING_PAYMENT',
              items: {
                create: group.items.map((item) => ({
                  variantId: item.variantId,
                  quantity: item.quantity,
                  unitPrice: this.unitPrice(item),
                  priceSnapshot: this.toJson(this.priceSnapshot(item)),
                })),
              },
            })),
          },
        },
        include: ORDER_SUMMARY_INCLUDE,
      })

      for (const item of cart.items) {
        const reserved = await this.inventoryService.reserveVariant(tx, {
          variantId: item.variantId,
          orderId: order.id,
          quantity: item.quantity,
          expiresAt: input.reservationExpiresAt,
        })
        if (!reserved) {
          throw new CheckoutInsufficientStockException()
        }
      }

      await tx.cartItem.deleteMany({ where: { cartId: cart.id } })

      return this.toSummaryView(order)
    })
  }

  async listByBuyer(input: ListOrdersByBuyerInput): Promise<OrderHistoryPage> {
    const where: Prisma.OrderWhereInput = {
      buyerId: input.buyerId,
      deletedAt: null,
      ...(input.status ? { status: input.status } : {}),
    }

    const skip = (input.page - 1) * input.limit

    const [rows, total] = await this.prisma.$transaction([
      this.prisma.order.findMany({
        where,
        include: ORDER_SUMMARY_INCLUDE,
        orderBy: { [input.sort]: input.order },
        skip,
        take: input.limit,
      }),
      this.prisma.order.count({ where }),
    ])

    return {
      data: rows.map((row): OrderHistoryView => this.toHistoryView(row)),
      page: input.page,
      limit: input.limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / input.limit)),
    }
  }

  private toHistoryView(order: OrderSummaryRow): OrderHistoryView {
    return {
      ...this.toSummaryView(order),
      createdAt: order.createdAt.toISOString(),
    }
  }

  private groupBySeller(items: CheckoutCartItem[]): SellerCheckoutGroup[] {
    const groups = new Map<string, SellerCheckoutGroup>()
    for (const item of items) {
      const seller = item.variant.product.seller
      const lineSubtotal = this.unitPrice(item) * item.quantity
      const existing = groups.get(seller.id)
      if (existing) {
        existing.items.push(item)
        existing.subtotal += lineSubtotal
      } else {
        groups.set(seller.id, {
          sellerId: seller.id,
          storeName: seller.storeName,
          subtotal: lineSubtotal,
          items: [item],
        })
      }
    }
    return Array.from(groups.values())
  }

  private unitPrice(item: CheckoutCartItem): number {
    return item.variant.priceOverride ?? item.variant.product.price
  }

  private priceSnapshot(item: CheckoutCartItem): Record<string, unknown> {
    const product = item.variant.product
    return {
      productId: product.id,
      productName: product.name,
      productSku: product.sku,
      variantId: item.variant.id,
      variantSku: item.variant.sku,
      attributes: item.variant.attributes,
      unitPrice: this.unitPrice(item),
      sellerId: product.seller.id,
      storeName: product.seller.storeName,
    }
  }

  private toSummaryView(order: OrderSummaryRow): OrderSummaryView {
    return {
      orderId: order.id,
      orderNumber: order.orderNumber,
      status: order.status as OrderStatusView,
      subtotal: order.subtotal,
      shippingFee: order.shippingFee,
      totalAmount: order.totalAmount,
      subOrders: order.subOrders.map(
        (subOrder): SubOrderSummaryView => ({
          id: subOrder.id,
          sellerId: subOrder.sellerId,
          storeName: subOrder.seller.storeName,
          subtotal: subOrder.subtotal,
          status: subOrder.status as OrderStatusView,
          items: subOrder.items.map((item): OrderItemSummaryView => {
            const snapshot = item.priceSnapshot as Record<string, unknown>
            return {
              id: item.id,
              variantId: item.variantId,
              productName: this.stringFromSnapshot(snapshot.productName),
              variantSku: this.stringFromSnapshot(snapshot.variantSku),
              attributes: snapshot.attributes,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              priceSnapshot: snapshot,
            }
          }),
        }),
      ),
    }
  }

  private toJson(value: unknown): Prisma.InputJsonValue {
    return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue
  }

  private stringFromSnapshot(value: unknown): string {
    return typeof value === 'string' ? value : ''
  }

  private generateOrderNumber(): string {
    const date = new Date().toISOString().slice(0, 10).replaceAll('-', '')
    const random = Math.random().toString(36).slice(2, 8).toUpperCase()
    return `ORD-${date}-${random}`
  }
}
