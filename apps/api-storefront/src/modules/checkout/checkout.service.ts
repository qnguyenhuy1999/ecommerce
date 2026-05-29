import { randomUUID } from 'node:crypto'
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common'
import { InjectQueue } from '@nestjs/bullmq'
import type { Queue } from 'bullmq'
import { type Prisma } from '@ecom/database'
import { RedisService } from '@ecom/redis'
import type { SessionData } from '@ecom/auth'
import { QUEUES } from '@ecom/shared'
import type {
  ConfirmCheckoutDto,
  SetCheckoutAddressDto,
  SetCheckoutPaymentDto,
  SetCheckoutShippingDto,
} from './dto/checkout.dto'
import { CheckoutRepository } from './repositories/checkout.repository'

const CHECKOUT_SESSION_TTL_SECONDS = 15 * 60 // 15 minutes
const CONFIRM_LOCK_TTL_SECONDS = 30
const CONFIRM_LOCK_PREFIX = 'checkout:confirm:'

function toPaymentMethodInput(
  paymentMethod: SetCheckoutPaymentDto['paymentMethod'],
): Prisma.InputJsonObject {
  return {
    method: paymentMethod.method,
    ...(paymentMethod.details ? { details: paymentMethod.details as Prisma.InputJsonValue } : {}),
  }
}

@Injectable()
export class CheckoutService {
  private readonly logger = new Logger(CheckoutService.name)

  constructor(
    private readonly checkoutRepository: CheckoutRepository,
    private readonly redis: RedisService,
    @InjectQueue(QUEUES.ORDER_PROCESSING) private readonly orderQueue: Queue,
  ) {}

  async createSession(user: SessionData) {
    const cart = await this.checkoutRepository.findCartWithItems(user.userId)

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty')
    }

    // Validate all items and calculate subtotal
    let subtotal = 0
    for (const item of cart.items) {
      const p = item.product
      if (p.deletedAt || p.status !== 'PUBLISHED') {
        throw new BadRequestException(`Product "${item.productId}" is not available`)
      }

      if (p.hasVariants) {
        const v = item.variant
        if (!v || !v.isActive)
          throw new BadRequestException('A cart variant is no longer available')
        const available = v.stock - v.reservedStock
        if (available < item.quantity)
          throw new BadRequestException('Insufficient stock for a cart item')
        subtotal += v.price.toNumber() * item.quantity
      } else {
        const available = p.baseStock - p.reservedStock
        if (available < item.quantity)
          throw new BadRequestException('Insufficient stock for a cart item')
        subtotal += (p.basePrice?.toNumber() ?? 0) * item.quantity
      }
    }

    const idempotencyKey = randomUUID()
    const expiresAt = new Date(Date.now() + CHECKOUT_SESSION_TTL_SECONDS * 1000)

    // Optimistic inventory reservation + session creation in one transaction
    const session = await this.checkoutRepository.$transaction(async (tx) => {
      // Reserve stock for each variant/product
      for (const item of cart.items) {
        if (item.product.hasVariants && item.variant) {
          await tx.productVariant.update({
            where: { id: item.variant.id },
            data: { reservedStock: { increment: item.quantity } },
          })
          await tx.inventoryTransaction.create({
            data: {
              variantId: item.variant.id,
              type: 'RESERVATION',
              quantity: item.quantity,
              reference: 'checkout-session',
            },
          })
        } else {
          await tx.product.update({
            where: { id: item.product.id },
            data: { reservedStock: { increment: item.quantity } },
          })
        }
      }

      const created = await tx.checkoutSession.create({
        data: {
          userId: user.userId,
          idempotencyKey,
          subtotal,
          total: subtotal,
          expiresAt,
        },
        include: { distributionLogs: true },
      })

      await tx.checkoutDistributionLog.create({
        data: {
          sessionId: created.id,
          event: 'INVENTORY_RESERVED',
          status: 'SUCCESS',
          payload: { itemCount: cart.items.length },
        },
      })

      return created
    })

    return this.normalizeSession(session)
  }

  async getSession(user: SessionData, sessionId: string) {
    const session = await this.loadSession(user.userId, sessionId)
    return this.normalizeSession(session)
  }

  async setAddress(user: SessionData, sessionId: string, dto: SetCheckoutAddressDto) {
    await this.loadSession(user.userId, sessionId)

    const address = await this.checkoutRepository.findUserAddress(dto.addressId)
    if (!address) throw new NotFoundException('Address not found')
    if (address.userId !== user.userId) throw new ForbiddenException()

    const session = await this.checkoutRepository.updateSession(sessionId, {
      address: {
        connect: {
          id: dto.addressId,
        },
      },
      step: 'SHIPPING',
    })

    return this.normalizeSession(session)
  }

  async setShipping(user: SessionData, sessionId: string, dto: SetCheckoutShippingDto) {
    const session = await this.loadSession(user.userId, sessionId)
    if (session.step === 'ADDRESS') throw new BadRequestException('Set address first')

    // Calculate shipping fee (flat $0 per provider for now; real integration varies)
    const shippingSelections: Record<string, { providerId: string; shippingFee: number }> = {}
    const shippingFee = 0

    for (const s of dto.selections) {
      const method = await this.checkoutRepository.findShippingMethod(s.shopId, s.providerId)
      if (!method) {
        throw new BadRequestException(`Shipping method not available for shop ${s.shopId}`)
      }
      shippingSelections[s.shopId] = { providerId: s.providerId, shippingFee: 0 }
    }

    const updated = await this.checkoutRepository.updateSession(sessionId, {
      shippingSelections,
      shippingFee,
      total: session.subtotal.toNumber() - session.discount.toNumber() + shippingFee,
      step: 'PAYMENT',
    })

    return this.normalizeSession(updated)
  }

  async setPayment(user: SessionData, sessionId: string, dto: SetCheckoutPaymentDto) {
    const session = await this.loadSession(user.userId, sessionId)
    if (!['PAYMENT', 'REVIEW'].includes(session.step)) {
      throw new BadRequestException('Complete address and shipping steps first')
    }

    const updated = await this.checkoutRepository.updateSession(sessionId, {
      paymentMethod: toPaymentMethodInput(dto.paymentMethod),
      step: 'REVIEW',
    })

    return this.normalizeSession(updated)
  }

  async confirmCheckout(user: SessionData, sessionId: string, _dto: ConfirmCheckoutDto) {
    const session = await this.loadSession(user.userId, sessionId)

    // Idempotency: already processed
    if (session.step === 'CONFIRMED' && session.orderId) {
      return { sessionId, orderId: session.orderId, status: 'CONFIRMED' }
    }

    if (session.step === 'FAILED') throw new BadRequestException('Checkout session has failed')
    if (session.step === 'EXPIRED') throw new BadRequestException('Checkout session has expired')
    if (session.step !== 'REVIEW')
      throw new BadRequestException('Complete all steps before confirming')

    // Distributed lock: prevent duplicate confirms hitting the queue
    const lockKey = `${CONFIRM_LOCK_PREFIX}${sessionId}`
    const lockValue = randomUUID()
    const acquired = await this.redis
      .getClient()
      .set(lockKey, lockValue, 'EX', CONFIRM_LOCK_TTL_SECONDS, 'NX')

    if (!acquired) {
      throw new ConflictException('Checkout already being processed — please wait')
    }

    try {
      // Pre-generate orderId so frontend can reference it immediately
      const orderId = randomUUID()

      await this.checkoutRepository.updateSession(sessionId, { orderId, step: 'CONFIRMED' })

      await this.orderQueue.add(
        'process-order',
        { sessionId, orderId, userId: user.userId },
        {
          jobId: `order:${sessionId}`,
          attempts: 3,
          backoff: { type: 'exponential', delay: 1000 },
          removeOnComplete: { age: 86400 },
          removeOnFail: { age: 86400 * 7 },
        },
      )

      this.logger.log(`Checkout confirmed, order ${orderId} enqueued for session ${sessionId}`)

      return { sessionId, orderId, status: 'PROCESSING' }
    } finally {
      // Release lock only if we still own it
      const current = await this.redis.get(lockKey)
      if (current === lockValue) {
        await this.redis.del(lockKey)
      }
    }
  }

  async getOrderStatus(user: SessionData, orderId: string) {
    const session = await this.checkoutRepository.findSessionByOrder(orderId, user.userId)

    if (!session) throw new NotFoundException('Order not found')

    return {
      orderId,
      sessionId: session.id,
      status: session.step,
      distributionLogs: session.distributionLogs.map((log) => ({
        id: log.id,
        event: log.event,
        status: log.status,
        errorMessage: log.errorMessage,
        createdAt: log.createdAt,
      })),
    }
  }

  // ─── Private ──────────────────────────────────────────────────────

  private async loadSession(userId: string, sessionId: string) {
    const session = await this.checkoutRepository.findSession(sessionId)

    if (!session) throw new NotFoundException('Checkout session not found')
    if (session.userId !== userId) throw new ForbiddenException()

    if (
      session.step !== 'CONFIRMED' &&
      session.step !== 'FAILED' &&
      new Date() > session.expiresAt
    ) {
      await this.checkoutRepository.updateSession(sessionId, { step: 'EXPIRED' })
      throw new BadRequestException('Checkout session has expired')
    }

    return session
  }

  private normalizeSession(session: Awaited<ReturnType<typeof this.loadSession>>) {
    return {
      id: session.id,
      idempotencyKey: session.idempotencyKey,
      step: session.step,
      addressId: session.addressId,
      shippingSelections: session.shippingSelections,
      paymentMethod: session.paymentMethod,
      couponCode: session.couponCode,
      subtotal: session.subtotal.toNumber(),
      shippingFee: session.shippingFee.toNumber(),
      discount: session.discount.toNumber(),
      total: session.total.toNumber(),
      orderId: session.orderId,
      expiresAt: session.expiresAt,
      createdAt: session.createdAt,
      distributionLogs: session.distributionLogs.map((log) => ({
        id: log.id,
        event: log.event,
        status: log.status,
        errorMessage: log.errorMessage,
        createdAt: log.createdAt,
      })),
    }
  }
}
