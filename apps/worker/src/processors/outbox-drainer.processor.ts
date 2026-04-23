import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Logger } from '@nestjs/common'
import { OutboxStatus, PrismaClient } from '@prisma/client'
import { Job } from 'bullmq'

import {
  OUTBOX_DRAIN_JOB_NAME,
  OUTBOX_QUEUE_NAME,
  type OutboxAggregateType,
  type OutboxDrainJobData,
  type OutboxEnvelope,
  type OutboxEventType,
} from '@ecom/shared'

// Default batch size and retry cap for draining outbox rows. Tuned for the
// MVP path (BullMQ in Redis, single-worker). When/if we replace BullMQ with
// Kafka in Phase 2, we'll swap the publisher but keep the drainer contract.
const DEFAULT_BATCH_SIZE = 100
const DEFAULT_MAX_ATTEMPTS = 10

/**
 * OutboxDrainerProcessor
 *
 * Polls the OutboxEvent table for PENDING rows whose availableAt <= now,
 * marks them IN-FLIGHT by setting attempts++, publishes each as a typed
 * OutboxEnvelope onto the appropriate downstream queue, and marks the row
 * PUBLISHED on success or FAILED after `maxAttempts`.
 *
 * Scheduling: a separate cron producer enqueues a drain-batch job every
 * few seconds (to be added when an OrderService actually writes to the
 * OutboxEvent table). For now this processor is registered but idle —
 * zero behavior change until producers opt in.
 *
 * Invariants:
 *   - The drainer NEVER executes business logic; it's a dumb pipe.
 *   - Publishing is best-effort with retries; if a row can't be delivered
 *     after DEFAULT_MAX_ATTEMPTS, status becomes FAILED and on-call gets
 *     paged via the to-be-added alerting rule on outbox_failed_total.
 */
@Processor(OUTBOX_QUEUE_NAME)
export class OutboxDrainerProcessor extends WorkerHost {
  private readonly logger = new Logger(OutboxDrainerProcessor.name)

  constructor(private readonly prisma: PrismaClient) {
    super()
  }

  async process(job: Job<OutboxDrainJobData>): Promise<{ drained: number }> {
    if (job.name !== OUTBOX_DRAIN_JOB_NAME) {
      this.logger.warn(`Ignoring unknown outbox job: ${job.name}`)
      return { drained: 0 }
    }

    const batchSize = job.data.batchSize ?? DEFAULT_BATCH_SIZE
    const maxAttempts = job.data.maxAttempts ?? DEFAULT_MAX_ATTEMPTS

    const now = new Date()
    const batch = await this.prisma.outboxEvent.findMany({
      where: {
        status: OutboxStatus.PENDING,
        availableAt: { lte: now },
      },
      orderBy: { createdAt: 'asc' },
      take: batchSize,
    })

    if (batch.length === 0) {
      return { drained: 0 }
    }

    let drained = 0
    for (const row of batch) {
      const envelope: OutboxEnvelope = {
        outboxId: row.id,
        aggregateType: row.aggregateType as OutboxAggregateType,
        aggregateId: row.aggregateId,
        eventType: row.eventType as OutboxEventType,
        payload: row.payload,
        createdAt: row.createdAt.toISOString(),
      }

      try {
        // TODO(@platform, 2026-04-23): Publish envelope to downstream consumers.
        // For now we only log — wiring the publisher is intentionally deferred
        // until the first producer (OrderService.checkout) writes outbox rows.
        // When ready, inject an EventBus port here and call bus.publish(envelope).
        this.logger.debug(
          `Outbox publish (stubbed): ${envelope.eventType} ${envelope.outboxId}`,
        )

        await this.prisma.outboxEvent.update({
          where: { id: row.id },
          data: {
            status: OutboxStatus.PUBLISHED,
            attempts: row.attempts + 1,
            publishedAt: new Date(),
            lastError: null,
          },
        })
        drained++
      } catch (err) {
        const attempts = row.attempts + 1
        const nextStatus = attempts >= maxAttempts ? OutboxStatus.FAILED : OutboxStatus.PENDING
        // Exponential backoff: base 1s, cap 5m.
        const backoffMs = Math.min(1000 * 2 ** Math.min(attempts, 8), 5 * 60 * 1000)
        const availableAt = new Date(Date.now() + backoffMs)
        await this.prisma.outboxEvent.update({
          where: { id: row.id },
          data: {
            status: nextStatus,
            attempts,
            lastError: stringifyError(err),
            availableAt,
          },
        })
        this.logger.warn(
          `Outbox publish failed for ${row.id} (attempt ${String(attempts)}): ${stringifyError(err)}`,
        )
      }
    }

    return { drained }
  }
}

function stringifyError(err: unknown): string {
  if (err instanceof Error) return `${err.name}: ${err.message}`
  return String(err)
}
