import { BullModule } from '@nestjs/bullmq'
import { Module } from '@nestjs/common'
import { ClsModule } from 'nestjs-cls'
import { LoggerModule } from 'nestjs-pino'

import { OUTBOX_QUEUE_NAME } from '@ecom/shared'

import { WorkerHealthController } from './health.controller'
import { buildWorkerLoggerParams } from './logger'

// Worker-side observability: structured logs + correlation-id context + a
// tiny HTTP surface for health/metrics probes. Mirrors the api-storefront
// ObservabilityModule but without bull-board (the API owns that UI).
@Module({
  imports: [
    ClsModule.forRoot({ global: true, middleware: { mount: false } }),
    LoggerModule.forRoot(buildWorkerLoggerParams()),
    BullModule.registerQueue(
      { name: 'order-expiration' },
      { name: 'inventory-reconciliation' },
      { name: OUTBOX_QUEUE_NAME },
    ),
  ],
  controllers: [WorkerHealthController],
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class -- NestJS modules are DI containers with no instance members.
export class WorkerObservabilityModule {}
