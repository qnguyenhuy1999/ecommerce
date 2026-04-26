import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Logger } from '@nestjs/common'
import { OrderStatus, PaymentStatus, Prisma, PrismaClient } from '@prisma/client'
import { Job } from 'bullmq'

import { restoreStock } from '@ecom/redis'

export interface OrderExpirationJobData {
  /** Optional override for "now" — used by tests / dry runs. */
  asOf?: string
  /** Cap how many orders this job tries to expire in a single pass. */
  batchSize?: number
}

export interface OrderExpirationResult {
  scanned: number
  expired: number
  skipped: number
}

const DEFAULT_BATCH_SIZE = 200
const REASON_EXPIRED = 'RESERVATION_EXPIRED'

/**
 * OrderExpirationProcessor
 *
 * Cancels orders that are still PENDING_PAYMENT after their inventory
 * reservations have lapsed. For each such order, in a single transaction:
 *
 *   1. Atomically claim the cancel by transitioning the order/sub-orders/
 *      payment from PENDING_PAYMENT to CANCELLED. The conditional
 *      `updateMany` guards against a webhook racing in and paying the
 *      order between scan and write — if the count is zero, we skip.
 *   2. Decrement reserved_stock for every reservation that's still ACTIVE
 *      and mark each EXPIRED. Both updates are conditional so an already
 *      reconciled reservation is a no-op rather than an error.
 *   3. Write a single ORDER_CANCELLED row to the outbox so downstream
 *      consumers (notifications, analytics) get notified after the tx
 *      commits.
 *
 * Redis stock counters are restored on a best-effort basis after the tx
 * commits — Redis is a cache, the DB is the source of truth.
 */
@Processor('order-expiration')
export class OrderExpirationProcessor extends WorkerHost {
  private readonly logger = new Logger(OrderExpirationProcessor.name)

  constructor(private readonly prisma: PrismaClient) {
    super()
  }

  async process(job: Job<OrderExpirationJobData | undefined>): Promise<OrderExpirationResult> {
    const data = job.data ?? {}
    const now = data.asOf ? new Date(data.asOf) : new Date()
    const batchSize = clampBatchSize(data.batchSize)

    const candidateOrders = await this.findExpiredOrderIds(now, batchSize)
    if (candidateOrders.length === 0) {
      return { scanned: 0, expired: 0, skipped: 0 }
    }

    let expired = 0
    let skipped = 0
    const restoreLog: Array<{ variantId: string; quantity: number }> = []

    for (const orderId of candidateOrders) {
      const outcome = await this.expireOrder(orderId)
      if (outcome.cancelled) {
        expired++
        restoreLog.push(...outcome.releasedReservations)
      } else {
        skipped++
      }
    }

    // Best-effort Redis cache restore. Failures here are logged but never
    // poison the job — the DB has already been reconciled and the
    // inventory-reconciliation worker will heal Redis on its next sweep.
    for (const release of restoreLog) {
      try {
        await restoreStock(release.variantId, release.quantity)
      } catch (err) {
        this.logger.warn(
          `Redis stock restore failed for variant=${release.variantId}: ${stringifyError(err)}`,
        )
      }
    }

    this.logger.log(
      `Expired orders: scanned=${String(candidateOrders.length)} expired=${String(expired)} skipped=${String(skipped)}`,
    )
    return { scanned: candidateOrders.length, expired, skipped }
  }

  private async findExpiredOrderIds(now: Date, take: number): Promise<string[]> {
    const rows = await this.prisma.inventoryReservation.findMany({
      where: { status: 'ACTIVE', expiresAt: { lt: now } },
      select: { orderId: true },
      distinct: ['orderId'],
      take,
    })
    return rows.map((row) => row.orderId)
  }

  private async expireOrder(orderId: string): Promise<{
    cancelled: boolean
    releasedReservations: Array<{ variantId: string; quantity: number }>
  }> {
    return this.prisma.$transaction(async (tx) => {
      const claimedOrder = await tx.order.updateMany({
        where: { id: orderId, status: OrderStatus.PENDING_PAYMENT },
        data: { status: OrderStatus.CANCELLED },
      })
      // The order was paid (or already cancelled) between scan and write —
      // bail out so we don't double-cancel.
      if (claimedOrder.count !== 1) {
        return { cancelled: false, releasedReservations: [] }
      }

      await tx.subOrder.updateMany({
        where: { orderId, status: OrderStatus.PENDING_PAYMENT },
        data: { status: OrderStatus.CANCELLED },
      })
      await tx.payment.updateMany({
        where: { orderId, status: PaymentStatus.PENDING },
        data: { status: PaymentStatus.FAILED },
      })

      const releasedReservations = await this.releaseOrderReservations(tx, orderId)

      const order = await tx.order.findUnique({
        where: { id: orderId },
        select: { orderNumber: true, buyerId: true },
      })

      await tx.outboxEvent.create({
        data: {
          aggregateType: 'Order',
          aggregateId: orderId,
          eventType: 'ORDER_CANCELLED',
          payload: toJson({
            orderId,
            orderNumber: order?.orderNumber ?? null,
            buyerId: order?.buyerId ?? null,
            reason: REASON_EXPIRED,
            cancelledAt: new Date().toISOString(),
            releasedReservations,
          }),
        },
      })

      return { cancelled: true, releasedReservations }
    })
  }

  private async releaseOrderReservations(
    tx: Prisma.TransactionClient,
    orderId: string,
  ): Promise<Array<{ variantId: string; quantity: number }>> {
    const reservations = await tx.inventoryReservation.findMany({
      where: { orderId, status: 'ACTIVE' },
      select: { id: true, variantId: true, quantity: true },
    })

    const released: Array<{ variantId: string; quantity: number }> = []
    for (const reservation of reservations) {
      // Conditional decrement: if a concurrent path already released this
      // reservation, the row's reserved_stock won't satisfy the predicate
      // and the update is a no-op — we still mark the reservation EXPIRED
      // so the audit trail is consistent.
      const affected = await tx.$executeRaw(
        Prisma.sql`
          UPDATE product_variants
          SET reserved_stock = reserved_stock - ${reservation.quantity},
              updated_at = NOW()
          WHERE id = ${reservation.variantId}
            AND reserved_stock >= ${reservation.quantity}
        `,
      )
      await tx.inventoryReservation.updateMany({
        where: { id: reservation.id, status: 'ACTIVE' },
        data: { status: 'EXPIRED' },
      })
      // Only restore the Redis cache when the DB decrement actually moved
      // reserved_stock — otherwise the two would diverge and the cache
      // would over-report availability until the reconciliation worker
      // healed it.
      if (affected === 1) {
        released.push({ variantId: reservation.variantId, quantity: reservation.quantity })
      }
    }
    return released
  }
}

function clampBatchSize(requested: number | undefined): number {
  if (!requested || !Number.isFinite(requested) || requested <= 0) return DEFAULT_BATCH_SIZE
  return Math.min(1000, Math.floor(requested))
}

function toJson(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue
}

function stringifyError(err: unknown): string {
  if (err instanceof Error) return `${err.name}: ${err.message}`
  return String(err)
}
