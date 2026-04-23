import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Job } from 'bullmq'

// TODO(@platform, 2026-04-23): Implement order-expiration processor (cancel unpaid orders after reservation TTL).
// Queue: order-expiration
@Processor('order-expiration')
export class OrderExpirationProcessor extends WorkerHost {
  // eslint-disable-next-line @typescript-eslint/require-await -- Placeholder processor; implementation will be async.
  async process(job: Job): Promise<void> {
    // TODO(@platform, 2026-04-23): Find PENDING_PAYMENT orders past expiry.
    // TODO(@platform, 2026-04-23): Restore inventory reservations.
    // TODO(@platform, 2026-04-23): Emit ORDER_EXPIRED event.
    // eslint-disable-next-line no-console -- Temporary job visibility while processor is stubbed.
    console.info('[OrderExpirationProcessor] Processing job', job.id)
  }
}
