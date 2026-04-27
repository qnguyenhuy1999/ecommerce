import { Controller, Get } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import {
  HealthCheck,
  HealthCheckService,
  HealthIndicatorResult,
  MemoryHealthIndicator,
  PrismaHealthIndicator,
} from '@nestjs/terminus'
import { PrismaClient } from '@prisma/client'

import { getRedis } from '@ecom/redis'

/**
 * Kubernetes / ELB health probes.
 *
 * - `/health/live`  — liveness: answer with 200 as long as the process is up.
 *                     If this fails, the orchestrator SHOULD restart the pod.
 * - `/health/ready` — readiness: answer with 200 only when dependencies are
 *                     reachable (Postgres today; Redis to be added alongside
 *                     the @nestjs/terminus RedisHealthIndicator in a follow-up).
 *                     If this fails, the LB SHOULD stop routing traffic here.
 *
 * Kept intentionally lightweight — no auth, no rate limit. Mount outside the
 * /api/v1 prefix so orchestrators can hit `/health/*` directly.
 */
@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly prismaIndicator: PrismaHealthIndicator,
    private readonly memory: MemoryHealthIndicator,
    private readonly prisma: PrismaClient,
  ) {}

  @Get('live')
  @HealthCheck()
  liveness(): Promise<HealthIndicatorResult | { status: string }> {
    // Liveness never checks external dependencies. The process being able to
    // respond here is enough signal that it hasn't deadlocked.
    return Promise.resolve({ status: 'ok' })
  }

  @Get('ready')
  @HealthCheck()
  readiness() {
    return this.health.check([
      () => this.prismaIndicator.pingCheck('postgres', this.prisma),
      async () => {
        await getRedis().ping()
        return { redis: { status: 'up' } }
      },
      // 512 MiB RSS cap — anything above suggests a leak; trip readiness so
      // the pod is rotated before it OOMs.
      () => this.memory.checkRSS('memory_rss', 512 * 1024 * 1024),
    ])
  }
}
