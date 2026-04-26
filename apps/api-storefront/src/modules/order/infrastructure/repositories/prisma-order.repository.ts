import { Inject, Injectable } from '@nestjs/common'
import { OrderStatus as PrismaOrderStatus, Prisma, PrismaClient } from '@prisma/client'

import { InventoryService } from '../../../inventory/inventory.service'
import type {
  AdminOrderDetailView,
  AdminOrderItemView,
  AdminOrderListInput,
  AdminOrderListPage,
  AdminOrderShippingTracking,
  AdminOrderSummaryView,
  AdminSubOrderView,
} from '../../application/views/admin-order.view'
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
  InvalidOrderStatusTransitionException,
  OrderNotFoundException,
  SubOrderNotFoundException,
} from '../../domain/exceptions/order.exceptions'
import type {
  AdminOrderStatusTransitionInput,
  AdminSubOrderStatusTransitionInput,
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

const ADMIN_ORDER_LIST_INCLUDE = {
  buyer: { select: { id: true, email: true } },
  subOrders: {
    select: {
      sellerId: true,
      items: { select: { quantity: true } },
    },
  },
} satisfies Prisma.OrderInclude

const ADMIN_ORDER_DETAIL_INCLUDE = {
  buyer: { select: { id: true, email: true } },
  subOrders: {
    include: {
      seller: { select: { id: true, storeName: true } },
      items: {
        include: {
          variant: { select: { sku: true, attributes: true } },
        },
      },
    },
    orderBy: { createdAt: 'asc' as const },
  },
} satisfies Prisma.OrderInclude

type CheckoutCart = Prisma.CartGetPayload<{ include: typeof CHECKOUT_CART_INCLUDE }>
type CheckoutCartItem = CheckoutCart['items'][number]
type OrderSummaryRow = Prisma.OrderGetPayload<{ include: typeof ORDER_SUMMARY_INCLUDE }>
type AdminOrderListRow = Prisma.OrderGetPayload<{ include: typeof ADMIN_ORDER_LIST_INCLUDE }>
type AdminOrderDetailRow = Prisma.OrderGetPayload<{ include: typeof ADMIN_ORDER_DETAIL_INCLUDE }>

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

  // ─── Admin operations ────────────────────────────────────────

  async listForAdmin(input: AdminOrderListInput): Promise<AdminOrderListPage> {
    const where: Prisma.OrderWhereInput = {
      deletedAt: null,
      ...(input.status ? { status: input.status as PrismaOrderStatus } : {}),
      ...(input.sellerId ? { subOrders: { some: { sellerId: input.sellerId } } } : {}),
      ...(input.buyerEmail
        ? { buyer: { email: { contains: input.buyerEmail, mode: 'insensitive' } } }
        : {}),
      ...(input.placedFrom || input.placedTo
        ? {
            createdAt: {
              ...(input.placedFrom ? { gte: input.placedFrom } : {}),
              ...(input.placedTo ? { lte: input.placedTo } : {}),
            },
          }
        : {}),
    }

    const skip = (input.page - 1) * input.limit
    const [rows, total] = await this.prisma.$transaction([
      this.prisma.order.findMany({
        where,
        include: ADMIN_ORDER_LIST_INCLUDE,
        orderBy: { createdAt: 'desc' },
        skip,
        take: input.limit,
      }),
      this.prisma.order.count({ where }),
    ])

    return {
      data: rows.map((row): AdminOrderSummaryView => this.toAdminSummaryView(row)),
      page: input.page,
      limit: input.limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / input.limit)),
    }
  }

  async findByIdForAdmin(orderId: string): Promise<AdminOrderDetailView | null> {
    const row = await this.prisma.order.findFirst({
      where: { id: orderId, deletedAt: null },
      include: ADMIN_ORDER_DETAIL_INCLUDE,
    })
    return row ? this.toAdminDetailView(row) : null
  }

  async transitionOrderStatus(
    input: AdminOrderStatusTransitionInput,
  ): Promise<AdminOrderDetailView> {
    return this.prisma.$transaction(async (tx) => {
      const current = await tx.order.findFirst({
        where: { id: input.orderId, deletedAt: null },
        select: { status: true },
      })
      if (!current) throw new OrderNotFoundException(input.orderId)
      assertValidOrderTransition(current.status as OrderStatusView, input.toStatus)

      // Compare-and-set guards against concurrent admin transitions.
      const claimed = await tx.order.updateMany({
        where: {
          id: input.orderId,
          status: current.status,
          deletedAt: null,
        },
        data: { status: input.toStatus as PrismaOrderStatus },
      })
      if (claimed.count !== 1) {
        const refreshed = await tx.order.findUnique({
          where: { id: input.orderId },
          select: { status: true },
        })
        throw new InvalidOrderStatusTransitionException(
          refreshed?.status ?? 'UNKNOWN',
          input.toStatus,
        )
      }

      await tx.outboxEvent.create({
        data: {
          aggregateType: 'Order',
          aggregateId: input.orderId,
          eventType: `ORDER_${input.toStatus}`,
          payload: this.toJson({
            orderId: input.orderId,
            fromStatus: current.status,
            toStatus: input.toStatus,
            adminUserId: input.adminUserId,
          }),
        },
      })

      const detail = await tx.order.findUniqueOrThrow({
        where: { id: input.orderId },
        include: ADMIN_ORDER_DETAIL_INCLUDE,
      })
      return this.toAdminDetailView(detail)
    })
  }

  async transitionSubOrderStatus(
    input: AdminSubOrderStatusTransitionInput,
  ): Promise<AdminOrderDetailView> {
    return this.prisma.$transaction(async (tx) => {
      const current = await tx.subOrder.findUnique({
        where: { id: input.subOrderId },
        select: { id: true, orderId: true, status: true },
      })
      if (!current) throw new SubOrderNotFoundException(input.subOrderId)
      assertValidOrderTransition(current.status as OrderStatusView, input.toStatus)

      const data: Prisma.SubOrderUpdateManyMutationInput = {
        status: input.toStatus as PrismaOrderStatus,
      }
      if (input.shippingTracking) {
        data.shippingTracking = this.toJson(input.shippingTracking)
      }

      const claimed = await tx.subOrder.updateMany({
        where: { id: input.subOrderId, status: current.status },
        data,
      })
      if (claimed.count !== 1) {
        const refreshed = await tx.subOrder.findUnique({
          where: { id: input.subOrderId },
          select: { status: true },
        })
        throw new InvalidOrderStatusTransitionException(
          refreshed?.status ?? 'UNKNOWN',
          input.toStatus,
        )
      }

      await tx.outboxEvent.create({
        data: {
          aggregateType: 'SubOrder',
          aggregateId: input.subOrderId,
          eventType: `SUB_ORDER_${input.toStatus}`,
          payload: this.toJson({
            subOrderId: input.subOrderId,
            orderId: current.orderId,
            fromStatus: current.status,
            toStatus: input.toStatus,
            adminUserId: input.adminUserId,
            shippingTracking: input.shippingTracking ?? null,
          }),
        },
      })

      // Aggregate top-level order status from its sub-orders.
      const siblings = await tx.subOrder.findMany({
        where: { orderId: current.orderId },
        select: { status: true },
      })
      const aggregated = aggregateOrderStatus(
        siblings.map((s) => s.status as OrderStatusView),
      )
      if (aggregated) {
        await tx.order.updateMany({
          where: { id: current.orderId, status: { not: aggregated as PrismaOrderStatus } },
          data: { status: aggregated as PrismaOrderStatus },
        })
      }

      const detail = await tx.order.findUniqueOrThrow({
        where: { id: current.orderId },
        include: ADMIN_ORDER_DETAIL_INCLUDE,
      })
      return this.toAdminDetailView(detail)
    })
  }

  private toAdminSummaryView(row: AdminOrderListRow): AdminOrderSummaryView {
    const itemCount = row.subOrders.reduce(
      (sum, so) => sum + so.items.reduce((isum, item) => isum + item.quantity, 0),
      0,
    )
    const sellerCount = new Set(row.subOrders.map((so) => so.sellerId)).size
    return {
      id: row.id,
      orderNumber: row.orderNumber,
      buyerId: row.buyerId,
      buyerEmail: row.buyer.email,
      status: row.status as OrderStatusView,
      subtotal: row.subtotal,
      shippingFee: row.shippingFee,
      totalAmount: row.totalAmount,
      itemCount,
      sellerCount,
      placedAt: row.createdAt.toISOString(),
    }
  }

  private toAdminDetailView(row: AdminOrderDetailRow): AdminOrderDetailView {
    const itemCount = row.subOrders.reduce(
      (sum, so) => sum + so.items.reduce((isum, item) => isum + item.quantity, 0),
      0,
    )
    const sellerCount = new Set(row.subOrders.map((so) => so.sellerId)).size
    return {
      id: row.id,
      orderNumber: row.orderNumber,
      buyerId: row.buyerId,
      buyerEmail: row.buyer.email,
      status: row.status as OrderStatusView,
      subtotal: row.subtotal,
      shippingFee: row.shippingFee,
      totalAmount: row.totalAmount,
      itemCount,
      sellerCount,
      placedAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
      shippingAddress: (row.shippingAddress ?? {}) as Record<string, unknown>,
      subOrders: row.subOrders.map(
        (subOrder): AdminSubOrderView => ({
          id: subOrder.id,
          sellerId: subOrder.sellerId,
          storeName: subOrder.seller.storeName,
          subtotal: subOrder.subtotal,
          status: subOrder.status as OrderStatusView,
          shippingTracking: parseShippingTracking(subOrder.shippingTracking),
          items: subOrder.items.map((item): AdminOrderItemView => {
            const snapshot = item.priceSnapshot as Record<string, unknown>
            return {
              id: item.id,
              variantId: item.variantId,
              productName: this.stringFromSnapshot(snapshot.productName),
              variantSku: item.variant.sku,
              attributes: (item.variant.attributes ?? {}) as Record<string, unknown>,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
            }
          }),
        }),
      ),
    }
  }
}

const VALID_TARGETS: ReadonlySet<OrderStatusView> = new Set([
  'PROCESSING',
  'SHIPPED',
  'COMPLETED',
  'CANCELLED',
])

/**
 * Allowed forward transitions for admin/seller-driven fulfillment moves
 * plus an admin-only CANCELLED escape hatch up to (but not after) shipment.
 *
 * - to=CANCELLED: from PENDING_PAYMENT | PAID | PROCESSING
 * - to=PROCESSING: from PAID
 * - to=SHIPPED:    from PROCESSING
 * - to=COMPLETED:  from SHIPPED
 *
 * Terminal source statuses (CANCELLED, REFUNDED, PENDING_REFUND, COMPLETED)
 * never allow further admin moves; refunds are handled via a separate flow.
 */
function assertValidOrderTransition(from: OrderStatusView, to: OrderStatusView): void {
  if (!VALID_TARGETS.has(to)) {
    throw new InvalidOrderStatusTransitionException(from, to)
  }
  let allowed = false
  if (to === 'CANCELLED') {
    allowed = from === 'PENDING_PAYMENT' || from === 'PAID' || from === 'PROCESSING'
  } else if (to === 'PROCESSING') {
    allowed = from === 'PAID'
  } else if (to === 'SHIPPED') {
    allowed = from === 'PROCESSING'
  } else if (to === 'COMPLETED') {
    allowed = from === 'SHIPPED'
  }
  if (!allowed) {
    throw new InvalidOrderStatusTransitionException(from, to)
  }
}

const STATUS_RANK: Record<OrderStatusView, number> = {
  PENDING_PAYMENT: 0,
  PAID: 1,
  PROCESSING: 2,
  SHIPPED: 3,
  COMPLETED: 4,
  CANCELLED: -1,
  REFUNDED: -1,
  PENDING_REFUND: -1,
}

/**
 * Roll up the top-level order status from its sub-orders so the buyer view
 * stays in sync with seller-driven fulfillment moves.
 *
 * - All sub-orders CANCELLED → CANCELLED
 * - All sub-orders ≥ COMPLETED → COMPLETED
 * - All sub-orders ≥ SHIPPED   → SHIPPED
 * - All sub-orders ≥ PROCESSING → PROCESSING
 * - Otherwise leave the order header alone (return null).
 */
function aggregateOrderStatus(statuses: OrderStatusView[]): OrderStatusView | null {
  if (statuses.length === 0) return null
  if (statuses.every((s) => s === 'CANCELLED')) return 'CANCELLED'
  // Drop cancelled/refund-track sub-orders from the rank-up calculation; an
  // order with one cancelled and one shipped sub-order should reflect SHIPPED.
  const active = statuses.filter((s) => STATUS_RANK[s] >= 0)
  if (active.length === 0) return null
  const min = Math.min(...active.map((s) => STATUS_RANK[s]))
  if (min >= STATUS_RANK.COMPLETED) return 'COMPLETED'
  if (min >= STATUS_RANK.SHIPPED) return 'SHIPPED'
  if (min >= STATUS_RANK.PROCESSING) return 'PROCESSING'
  return null
}

function parseShippingTracking(value: Prisma.JsonValue | null): AdminOrderShippingTracking | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  const record = value as Record<string, unknown>
  const carrier = typeof record.carrier === 'string' ? record.carrier : null
  const trackingNumber = typeof record.trackingNumber === 'string' ? record.trackingNumber : null
  if (!carrier || !trackingNumber) return null
  return { carrier, trackingNumber }
}
