import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

// TODO: implement inventory reconciliation processor
// Queue: inventory-reconciliation — periodic sync between Redis and DB

@Processor('inventory-reconciliation')
export class InventoryReconciliationProcessor extends WorkerHost {
  // eslint-disable-next-line @typescript-eslint/require-await
  async process(job: Job): Promise<void> {
    // TODO: periodically sync Redis stock counters with DB stock values
    // TODO: detect and flag any discrepancies
    // eslint-disable-next-line no-console
    console.info('[InventoryReconciliationProcessor] Processing job', job.id);
  }
}
