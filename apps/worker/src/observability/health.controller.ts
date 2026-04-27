import { InjectQueue } from '@nestjs/bullmq'
import { Controller, Get, Header } from '@nestjs/common'
import type { Queue } from 'bullmq'
import { collectDefaultMetrics, register } from 'prom-client'

import { getRedis } from '@ecom/redis'
import { OUTBOX_QUEUE_NAME } from '@ecom/shared'

// Ensure default Node metrics are registered exactly once per process. Guarded
// because `collectDefaultMetrics` has module-level state that survives reloads
// in dev.
let defaultsRegistered = false
function ensureDefaultMetrics(): void {
  if (defaultsRegistered) return
  collectDefaultMetrics({ labels: { service: 'worker' } })
  defaultsRegistered = true
}

/**
 * Worker observability endpoints.
 *
 * The worker runs as a background NestJS process, but it already listens on
 * HTTP (port 0 before this change). We keep the HTTP surface minimal:
 *   - /health/live  — liveness for k8s
 *   - /health/ready — readiness (always OK today; add queue-drain checks later)
 *   - /metrics      — Prometheus scrape for default Node collectors + future
 *                     BullMQ counters (jobs_processed_total, etc.)
 *
 * No /api/v1 prefix: keeps the URLs stable for ops tooling.
 */
@Controller()
export class WorkerHealthController {
  constructor(
    @InjectQueue('order-expiration') private readonly orderExpirationQueue: Queue,
    @InjectQueue('inventory-reconciliation') private readonly inventoryReconciliationQueue: Queue,
    @InjectQueue(OUTBOX_QUEUE_NAME) private readonly outboxQueue: Queue,
  ) {
    ensureDefaultMetrics()
  }

  @Get('health/live')
  live(): { status: string } {
    return { status: 'ok' }
  }

  @Get('health/ready')
  async ready(): Promise<{ status: string; redis: string; queues: Record<string, string> }> {
    await getRedis().ping()
    await Promise.all([
      this.orderExpirationQueue.getJobCounts('waiting', 'delayed', 'active', 'failed'),
      this.inventoryReconciliationQueue.getJobCounts('waiting', 'delayed', 'active', 'failed'),
      this.outboxQueue.getJobCounts('waiting', 'delayed', 'active', 'failed'),
    ])
    return {
      status: 'ok',
      redis: 'ok',
      queues: {
        'order-expiration': 'ok',
        'inventory-reconciliation': 'ok',
        [OUTBOX_QUEUE_NAME]: 'ok',
      },
    }
  }

  @Get('metrics')
  @Header('Content-Type', register.contentType)
  async metrics(): Promise<string> {
    return await register.metrics()
  }
}
