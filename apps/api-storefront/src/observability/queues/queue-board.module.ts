import { BullMQAdapter } from '@bull-board/api/bullMQAdapter'
import { BaseAdapter } from '@bull-board/api/dist/src/queueAdapters/base'
import type { QueueAdapterOptions } from '@bull-board/api/dist/typings/app'
import { ExpressAdapter } from '@bull-board/express'
import { BullBoardModule } from '@bull-board/nestjs'
import { BullModule } from '@nestjs/bullmq'
import { DynamicModule, Module } from '@nestjs/common'

// @bull-board/api publishes stale bullmq types (Job.progress is `JobProgress`
// in bullmq ^5 vs. `number | object` in bull-board's QueueJob), so the default
// BullMQAdapter fails to satisfy BaseAdapter's construct signature under
// strict mode. The runtime shape is identical; this cast is purely a type
// compatibility shim and can be removed once the upstream ships matching types.
const BullMQAdapterCompat = BullMQAdapter as unknown as new (
  queue: unknown,
  options?: Partial<QueueAdapterOptions>,
) => BaseAdapter

// Names of every BullMQ queue we want to inspect from the dashboard. Keep in
// sync with apps/worker/src/worker.module.ts. Registering them here also makes
// the corresponding Queue tokens available for future producer modules (e.g.
// OrderService enqueuing an email-confirmation job).
//
// NOTE: 'outbox' is intentionally hard-coded (not imported from @ecom/shared)
// to keep this PR independent of the Outbox scaffold PR. It will be replaced
// with `OUTBOX_QUEUE_NAME` from @ecom/shared after both PRs merge.
const INSPECTABLE_QUEUES = [
  'email',
  'order-expiration',
  'commission',
  'inventory-reconciliation',
  'outbox',
] as const

/**
 * QueueBoardModule
 *
 * Mounts bull-board at `/admin/queues` so operators can inspect jobs, retries,
 * and DLQ state visually.
 *
 * Security: opt-in via `ENABLE_QUEUE_BOARD=true`. Keep disabled in production
 * until an auth guard (JWT admin role or network policy) is in front of it.
 * When disabled, `.register()` returns a module with no imports so no BullMQ
 * connections are opened and no `/admin/queues` route is mounted.
 */
@Module({})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class -- NestJS DynamicModule pattern: the static register() is the module's public factory.
export class QueueBoardModule {
  static register(): DynamicModule {
    const enabled = process.env.ENABLE_QUEUE_BOARD === 'true'
    if (!enabled) {
      return { module: QueueBoardModule }
    }

    const queueRegistrations = INSPECTABLE_QUEUES.map((name) => ({ name }))
    const boardRegistrations = INSPECTABLE_QUEUES.map((name) =>
      BullBoardModule.forFeature({ name, adapter: BullMQAdapterCompat }),
    )

    return {
      module: QueueBoardModule,
      imports: [
        BullModule.registerQueue(...queueRegistrations),
        BullBoardModule.forRoot({
          route: '/admin/queues',
          adapter: ExpressAdapter,
        }),
        ...boardRegistrations,
      ],
    }
  }
}
