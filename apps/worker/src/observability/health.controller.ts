import { Controller, Get, Header } from '@nestjs/common'
import { collectDefaultMetrics, register } from 'prom-client'

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
  constructor() {
    ensureDefaultMetrics()
  }

  @Get('health/live')
  live(): { status: string } {
    return { status: 'ok' }
  }

  @Get('health/ready')
  ready(): { status: string } {
    // TODO(@platform, 2026-04-23): check BullMQ connection + pending drain.
    return { status: 'ok' }
  }

  @Get('metrics')
  @Header('Content-Type', register.contentType)
  async metrics(): Promise<string> {
    return await register.metrics()
  }
}
