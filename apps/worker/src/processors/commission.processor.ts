import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Job } from 'bullmq'

// TODO(@platform, 2026-04-23): Implement commission processor (calculate + record commissions after order completion).
// Queue: commission
@Processor('commission')
export class CommissionProcessor extends WorkerHost {
  // eslint-disable-next-line @typescript-eslint/require-await -- Placeholder processor; implementation will be async.
  async process(job: Job): Promise<void> {
    // TODO(@platform, 2026-04-23): Calculate commission for each SubOrder.
    // TODO(@platform, 2026-04-23): Create Commission record + SellerLedger DEBIT entry.
    // eslint-disable-next-line no-console -- Temporary job visibility while processor is stubbed.
    console.info('[CommissionProcessor] Processing job', job.id)
  }
}
