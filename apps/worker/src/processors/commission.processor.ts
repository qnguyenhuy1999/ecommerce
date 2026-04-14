import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

// TODO: implement commission processor
// Queue: commission — calculates and records commission after order completion

@Processor('commission')
export class CommissionProcessor extends WorkerHost {
  // eslint-disable-next-line @typescript-eslint/require-await
  async process(job: Job): Promise<void> {
    // TODO: calculate commission for each SubOrder
    // TODO: create Commission record + SellerLedger DEBIT entry
    // eslint-disable-next-line no-console
    console.info('[CommissionProcessor] Processing job', job.id);
  }
}
