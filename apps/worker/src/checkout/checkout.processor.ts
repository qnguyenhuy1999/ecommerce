import { Logger } from '@nestjs/common'
import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Job } from 'bullmq'
import { PrismaService } from '@ecom/database'
import { QUEUES } from '@ecom/shared'

interface OrderJobData {
  sessionId: string
  orderId: string
  userId: string
}

interface CartItemWithVariant {
  id: string
  productId: string
  variantId: string | null
  quantity: number
  product: {
    id: string
    shopId: string
    basePrice: { toNumber: () => number } | null
    hasVariants: boolean
  }
  variant: {
    id: string
    price: { toNumber: () => number }
    stock: number
    reservedStock: number
  } | null
}

@Processor(QUEUES.ORDER_PROCESSING, { concurrency: 10 })
export class CheckoutProcessor extends WorkerHost {
  private readonly logger = new Logger(CheckoutProcessor.name)

  constructor(private readonly prisma: PrismaService) {
    super()
  }

  async process(job: Job<OrderJobData>) {
    const { sessionId, orderId, userId } = job.data
    this.logger.log(`Processing order ${orderId} for session ${sessionId} (attempt ${job.attemptsMade + 1})`)

    const session = await this.prisma.checkoutSession.findUnique({
      where: { id: sessionId },
      include: {
        address: true,
      },
    })

    if (!session) {
      this.logger.error(`Session ${sessionId} not found`)
      throw new Error(`Session ${sessionId} not found`)
    }

    // Already fully processed — idempotent
    if (session.step === 'CONFIRMED' && session.orderId) {
      const order = await this.prisma.order.findUnique({ where: { id: session.orderId } })
      if (order) {
        this.logger.log(`Order ${orderId} already processed — skipping`)
        return { orderId: session.orderId }
      }
    }

    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                shopId: true,
                basePrice: true,
                hasVariants: true,
              },
            },
            variant: {
              select: {
                id: true,
                price: true,
                stock: true,
                reservedStock: true,
              },
            },
          },
        },
      },
    })

    if (!cart || cart.items.length === 0) {
      await this.failSession(sessionId, orderId, 'Cart is empty at processing time')
      throw new Error('Cart is empty')
    }

    const items = cart.items as CartItemWithVariant[]

    try {
      await this.prisma.$transaction(async (tx) => {
        // Step 1: Atomically deduct inventory
        for (const item of items) {
          if (item.product.hasVariants && item.variant) {
            const updated = await tx.productVariant.updateMany({
              where: {
                id: item.variant.id,
                stock: { gte: item.quantity },
              },
              data: {
                stock: { decrement: item.quantity },
                reservedStock: { decrement: item.quantity },
              },
            })

            if (updated.count === 0) {
              throw new Error(`Insufficient stock for variant ${item.variant.id}`)
            }

            await tx.inventoryTransaction.create({
              data: {
                variantId: item.variant.id,
                type: 'STOCK_OUT',
                quantity: item.quantity,
                reference: `order:${orderId}`,
                note: `Order deduction`,
              },
            })
          } else {
            const updated = await tx.product.updateMany({
              where: {
                id: item.product.id,
                baseStock: { gte: item.quantity },
              },
              data: {
                baseStock: { decrement: item.quantity },
                reservedStock: { decrement: item.quantity },
              },
            })

            if (updated.count === 0) {
              throw new Error(`Insufficient stock for product ${item.product.id}`)
            }
          }
        }

        await tx.checkoutDistributionLog.create({
          data: {
            sessionId,
            orderId,
            event: 'INVENTORY_DEDUCTED',
            status: 'SUCCESS',
            payload: { itemCount: items.length },
          },
        })

        // Step 2: Create top-level Order
        const shippingAddress = session.address
        const order = await tx.order.create({
          data: {
            id: orderId,
            buyerId: userId,
            totalAmount: session.total,
            status: 'CONFIRMED',
            shippingName: shippingAddress?.recipientName ?? null,
            shippingPhone: shippingAddress?.phone ?? null,
            shippingAddress: shippingAddress
              ? `${shippingAddress.addressLine}, ${shippingAddress.city}, ${shippingAddress.province} ${shippingAddress.postalCode}`
              : null,
          },
        })

        await tx.checkoutDistributionLog.create({
          data: {
            sessionId,
            orderId: order.id,
            event: 'ORDER_CREATED',
            status: 'SUCCESS',
            payload: { totalAmount: session.total.toNumber() },
          },
        })

        // Step 3: Split items by shopId → create SellerOrder per shop
        const shopMap = new Map<string, CartItemWithVariant[]>()
        for (const item of items) {
          const existing = shopMap.get(item.product.shopId) ?? []
          existing.push(item)
          shopMap.set(item.product.shopId, existing)
        }

        for (const [shopId, shopItems] of shopMap) {
          const subtotal = shopItems.reduce((sum, item) => {
            const price = item.product.hasVariants && item.variant
              ? item.variant.price.toNumber()
              : item.product.basePrice?.toNumber() ?? 0
            return sum + price * item.quantity
          }, 0)

          const sellerOrder = await tx.sellerOrder.create({
            data: {
              orderId: order.id,
              shopId,
              subtotal,
              status: 'CONFIRMED',
            },
          })

          for (const item of shopItems) {
            const unitPrice = item.product.hasVariants && item.variant
              ? item.variant.price.toNumber()
              : item.product.basePrice?.toNumber() ?? 0

            const productDetails = await tx.product.findUnique({
              where: { id: item.product.id },
              select: { name: true },
            })

            await tx.sellerOrderItem.create({
              data: {
                sellerOrderId: sellerOrder.id,
                variantId: item.variantId ?? item.product.id,
                productName: productDetails?.name ?? 'Unknown',
                variantLabel: null,
                quantity: item.quantity,
                unitPrice,
                totalPrice: unitPrice * item.quantity,
              },
            })
          }

          await tx.orderAuditLog.create({
            data: {
              sellerOrderId: sellerOrder.id,
              fromStatus: 'PENDING',
              toStatus: 'CONFIRMED',
              note: 'Order created via checkout',
              performedBy: userId,
            },
          })
        }

        await tx.checkoutDistributionLog.create({
          data: {
            sessionId,
            orderId: order.id,
            event: 'SELLER_ORDERS_SPLIT',
            status: 'SUCCESS',
            payload: { shopCount: shopMap.size },
          },
        })

        // Step 4: Clear cart after successful order
        await tx.cartItem.deleteMany({ where: { cartId: cart.id } })
      })

      await this.prisma.checkoutDistributionLog.create({
        data: {
          sessionId,
          orderId,
          event: 'NOTIFICATION_SENT',
          status: 'PENDING',
          payload: { note: 'Notification enqueue placeholder' },
        },
      })

      this.logger.log(`Order ${orderId} processed successfully`)
      return { orderId }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      this.logger.error(`Order ${orderId} failed: ${message}`)

      await this.failSession(sessionId, orderId, message)

      // Release inventory reservations on failure
      await this.releaseReservations(sessionId, items)

      throw error
    }
  }

  private async failSession(sessionId: string, orderId: string, errorMessage: string) {
    await this.prisma.checkoutSession.update({
      where: { id: sessionId },
      data: { step: 'FAILED' },
    })

    await this.prisma.checkoutDistributionLog.create({
      data: {
        sessionId,
        orderId,
        event: 'FAILED',
        status: 'FAILED',
        errorMessage,
      },
    })
  }

  private async releaseReservations(sessionId: string, items: CartItemWithVariant[]) {
    try {
      await this.prisma.$transaction(async (tx) => {
        for (const item of items) {
          if (item.product.hasVariants && item.variant) {
            await tx.productVariant.update({
              where: { id: item.variant.id },
              data: { reservedStock: { decrement: item.quantity } },
            })
          } else {
            await tx.product.update({
              where: { id: item.product.id },
              data: { reservedStock: { decrement: item.quantity } },
            })
          }
        }

        await tx.checkoutDistributionLog.create({
          data: {
            sessionId,
            event: 'INVENTORY_RELEASED',
            status: 'SUCCESS',
            payload: { itemCount: items.length },
          },
        })
      })
    } catch (releaseError) {
      this.logger.error(`Failed to release reservations for session ${sessionId}`, releaseError)
    }
  }
}
