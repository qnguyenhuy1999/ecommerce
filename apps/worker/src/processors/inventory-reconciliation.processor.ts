import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Logger } from '@nestjs/common'
import { Prisma, PrismaClient } from '@prisma/client'
import { Job } from 'bullmq'

import { getRedis } from '@ecom/redis'

export interface InventoryReconciliationJobData {
  /** Maximum number of variants to scan per job. */
  batchSize?: number
  /** When true, observe drift but don't update Redis (for monitoring). */
  dryRun?: boolean
}

export interface InventoryReconciliationResult {
  scanned: number
  drift: number
  healed: number
  missingInRedis: number
  errors: number
}

const DEFAULT_BATCH_SIZE = 1_000
const STOCK_KEY_PREFIX = 'stock:'

/**
 * InventoryReconciliationProcessor
 *
 * Periodic sweep that ensures Redis stock counters (the hot path for
 * checkout reserve/restore) agree with the DB (the source of truth).
 *
 * For every variant:
 *   - dbAvailable = stock - reservedStock
 *   - redisAvailable = GET stock:<variantId>
 *
 * If Redis is missing the key entirely we backfill it. If Redis disagrees
 * with the DB, we log the drift and SET the key to dbAvailable to self-heal.
 * The DB is never written from this processor — drift is always resolved
 * in favour of the DB.
 */
@Processor('inventory-reconciliation')
export class InventoryReconciliationProcessor extends WorkerHost {
  private readonly logger = new Logger(InventoryReconciliationProcessor.name)

  constructor(private readonly prisma: PrismaClient) {
    super()
  }

  async process(
    job: Job<InventoryReconciliationJobData | undefined>,
  ): Promise<InventoryReconciliationResult> {
    const data = job.data ?? {}
    const batchSize = clampBatchSize(data.batchSize)
    const dryRun = data.dryRun === true

    const redis = getRedis()
    const result: InventoryReconciliationResult = {
      scanned: 0,
      drift: 0,
      healed: 0,
      missingInRedis: 0,
      errors: 0,
    }

    let cursor: string | undefined
    while (result.scanned < batchSize) {
      const remaining = batchSize - result.scanned
      const variants = await this.prisma.productVariant.findMany({
        where: { product: { deletedAt: null } },
        select: { id: true, stock: true, reservedStock: true },
        orderBy: { id: 'asc' },
        take: Math.min(remaining, 500),
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      })
      if (variants.length === 0) break

      for (const variant of variants) {
        result.scanned++
        const dbAvailable = variant.stock - variant.reservedStock
        const key = `${STOCK_KEY_PREFIX}${variant.id}`
        try {
          const raw = await redis.get(key)
          if (raw === null) {
            result.missingInRedis++
            if (!dryRun) await redis.set(key, dbAvailable.toString())
            continue
          }
          const redisAvailable = Number.parseInt(raw, 10)
          if (Number.isNaN(redisAvailable) || redisAvailable !== dbAvailable) {
            result.drift++
            this.logger.warn(
              `Stock drift detected: variant=${variant.id} db=${String(dbAvailable)} redis=${raw}`,
            )
            if (!dryRun) {
              await redis.set(key, dbAvailable.toString())
              result.healed++
            }
          }
        } catch (err) {
          result.errors++
          this.logger.warn(
            `Reconciliation error for variant=${variant.id}: ${stringifyError(err)}`,
          )
        }
      }

      cursor = variants[variants.length - 1]?.id
      if (!cursor) break
    }

    if (result.drift > 0 || result.missingInRedis > 0) {
      try {
        await this.prisma.outboxEvent.create({
          data: {
            aggregateType: 'InventoryReservation',
            aggregateId: 'reconciliation',
            eventType: 'inventory.drift_detected',
            payload: toJson({
              ...result,
              dryRun,
              jobId: job.id ?? null,
              detectedAt: new Date().toISOString(),
            }),
          },
        })
      } catch (err) {
        this.logger.warn(`Failed to record drift outbox event: ${stringifyError(err)}`)
      }
    }

    this.logger.log(
      `Reconciliation pass: scanned=${String(result.scanned)} drift=${String(result.drift)} healed=${String(result.healed)} missing=${String(result.missingInRedis)} errors=${String(result.errors)}`,
    )
    return result
  }
}

function clampBatchSize(requested: number | undefined): number {
  if (!requested || !Number.isFinite(requested) || requested <= 0) return DEFAULT_BATCH_SIZE
  return Math.min(10_000, Math.floor(requested))
}

function toJson(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue
}

function stringifyError(err: unknown): string {
  if (err instanceof Error) return `${err.name}: ${err.message}`
  return String(err)
}
