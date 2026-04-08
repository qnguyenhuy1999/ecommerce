// TODO: implement email processor
// Queue: email — handles: welcome email, order confirmation, refund notification, seller approval
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('email')
export class EmailProcessor extends WorkerHost {
  async process(job: Job): Promise<void> {
    switch (job.name) {
      // TODO: case 'welcome': send welcome email
      // TODO: case 'order-confirmation': send order confirmation
      // TODO: case 'seller-approved': send approval email
      default:
        console.log(`[EmailProcessor] Unknown job: ${job.name}`);
    }
  }
}
