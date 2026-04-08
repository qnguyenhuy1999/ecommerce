// TODO: implement commission processor
// Queue: commission — calculates and records commission after order completion
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('commission')
export class CommissionProcessor extends WorkerHost {
  async process(job: Job): Promise<void> {
    // TODO: calculate commission for each SubOrder
    // TODO: create Commission record + SellerLedger DEBIT entry
  }
}
