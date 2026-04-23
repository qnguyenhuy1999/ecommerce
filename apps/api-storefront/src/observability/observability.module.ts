
import { Module } from '@nestjs/common'
import { ClsModule } from 'nestjs-cls'
import { LoggerModule } from 'nestjs-pino'
import { randomUUID } from 'node:crypto'

import { HealthModule } from './health/health.module'
import { buildLoggerParams } from './logger'
import { MetricsModule } from './metrics/metrics.module'
import { QueueBoardModule } from './queues/queue-board.module'

/**
 * ObservabilityModule
 *
 * Bundles the four "must-have before launch" ops primitives:
 *   - Structured logging (pino) with redaction of auth/cookie/password fields
 *   - Correlation ID propagation (nestjs-cls): x-request-id in, same id on the
 *     way out, same id in every downstream log line
 *   - Liveness/readiness probes (@nestjs/terminus) at /health/live|/health/ready
 *   - Prometheus metrics at /metrics
 *   - Optional BullMQ dashboard at /admin/queues (opt-in via ENABLE_QUEUE_BOARD)
 *
 * Mount once in AppModule. No global interceptors are registered — CLS runs as
 * a middleware, pino logs are attached via pino-http, and /health + /metrics
 * are plain controllers.
 */
@Module({
  imports: [
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
        generateId: true,
        idGenerator: (req: { headers?: Record<string, string | string[] | undefined> }) => {
          const header =
            req.headers?.['x-request-id'] ??
            req.headers?.['x-correlation-id']
          if (Array.isArray(header)) return header[0] ?? randomUUID()
          if (typeof header === 'string' && header.length > 0) return header
          return randomUUID()
        },
      },
    }),
    LoggerModule.forRoot(buildLoggerParams()),
    HealthModule,
    MetricsModule,
    QueueBoardModule.register(),
  ],
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class -- NestJS modules are DI containers with no instance members.
export class ObservabilityModule {}
