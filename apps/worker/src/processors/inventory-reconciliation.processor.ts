import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Job } from 'bullmq'

// TODO(@platform, 2026-04-23): Implement inventory reconciliation (sync Redis counters with DB and flag drift).
// Queue: inventory-reconciliation
@Processor('inventory-reconciliation')
export class InventoryReconciliationProcessor extends WorkerHost {
  // eslint-disable-next-line @typescript-eslint/require-await -- Placeholder processor; implementation will be async.
  async process(job: Job): Promise<void> {
    // TODO(@platform, 2026-04-23): Periodically sync Redis stock counters with DB stock values.
    // TODO(@platform, 2026-04-23): Detect and flag discrepancies for investigation.
    // eslint-disable-next-line no-console -- Temporary job visibility while processor is stubbed.
    console.info('[InventoryReconciliationProcessor] Processing job', job.id)
  }
}
